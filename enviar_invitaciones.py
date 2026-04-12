"""
Script de envío automatizado de invitaciones de boda por WhatsApp.
Incluye video personalizado + mensaje con link a Google Form.

Uso:
    python enviar_invitaciones.py setup    # Primera vez: configurar sesiones
    python enviar_invitaciones.py          # Enviar invitaciones
    python enviar_invitaciones.py test     # Enviar solo al primer contacto (prueba)
"""

import pandas as pd
import urllib.parse
import random
import time
import logging
import sys
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN - EDITAR SEGÚN TUS NECESIDADES
# ═══════════════════════════════════════════════════════════════════════════════

CUENTAS = [
    {
        "nombre": "Mauricio",
        "session_file": "sesion_mauricio.json",
        "variantes": [
            "Hola {nombre} 😄 Soy Mauricio.\nTe invitamos a nuestra boda 💍\n\nConfirma tu asistencia aquí:\n{url}\n\n¡Un abrazo!",
            "Hola {nombre}! 😄\nCon mucha ilusión te invitamos a nuestra boda 💍\n\nPor favor confirma aquí:\n{url}\n\n¡Esperamos verte!",
        ]
    },
    {
        "nombre": "Esposa",  # ← Cambia por el nombre de tu esposa
        "session_file": "sesion_esposa.json",
        "variantes": [
            "Hola {nombre} 😄 Soy [Nombre].\nTe invitamos a nuestra boda 💍\n\nConfirma tu asistencia aquí:\n{url}\n\n¡Un abrazo!",
            "Hola {nombre}! 😄\nQueremos invitarte a nuestra boda 💍\n\nConfírmanos aquí:\n{url}\n\n¡Te esperamos!",
        ]
    },
]

CONFIG = {
    # Archivos
    "input_file": "invitados_enviar.xlsx",  # Generado por preparar_invitados.py
    "output_file": "invitados_resultado.xlsx",
    "video_file": "video_invitacion.mp4",  # ← Ruta a tu video
    
    # Google Form
    "form_base_url": "https://docs.google.com/forms/d/e/1FAIpQLSdHqRZAK_zBUusDjocL-qNLuJMYIjLXrqDBet0JoXuO7vB4aQ/viewform",
    "form_entry_field": "entry.825958218",
    
    # Teléfono
    "default_country_code": "52",  # México
    
    # Delays (segundos) - Ajusta según tu tolerancia al riesgo
    "delay_antes_adjuntar": (2, 4),
    "delay_carga_video": (5, 10),      # Depende del tamaño del video
    "delay_antes_enviar": (2, 4),
    "delay_entre_mensajes": (30, 60),  # Más conservador por enviar multimedia
    "pausa_larga_cada": 8,             # Cada 8 mensajes
    "pausa_larga_rango": (300, 600),   # 5-10 minutos
    
    # Modo de envío
    "modo": "alternado",  # "paralelo" o "alternado"
    "headless": False,    # False para ver el navegador
}

# ═══════════════════════════════════════════════════════════════════════════════
# LOGGING
# ═══════════════════════════════════════════════════════════════════════════════

log_filename = f"envios_{datetime.now():%Y%m%d_%H%M%S}.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler(log_filename, encoding="utf-8"),
        logging.StreamHandler()
    ]
)
log = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════════════════════════════════
# FUNCIONES AUXILIARES
# ═══════════════════════════════════════════════════════════════════════════════

def normalize_phone(phone: str, country_code: str = CONFIG["default_country_code"]) -> str:
    """Normaliza teléfono: solo dígitos, agrega código de país si falta."""
    digits = "".join(ch for ch in str(phone) if ch.isdigit())
    if not digits:
        return ""
    if len(digits) == 10:
        digits = country_code + digits
    return digits


def build_invitation_url(invitado_id: str) -> str:
    """Construye la URL del form con el ID prellenado."""
    base = CONFIG["form_base_url"]
    field = CONFIG["form_entry_field"]
    encoded_id = urllib.parse.quote(str(invitado_id))
    return f"{base}?usp=pp_url&{field}={encoded_id}"


def build_message(nombre: str, invitado_id: str, cuenta: dict) -> str:
    """Construye el mensaje personalizado."""
    url = build_invitation_url(invitado_id)
    template = random.choice(cuenta["variantes"])
    return template.format(nombre=nombre, url=url)


def random_sleep(rango: tuple, msg: str = ""):
    """Pausa aleatoria entre min y max segundos."""
    t = random.uniform(*rango)
    if msg:
        log.debug(f"⏳ {msg} ({t:.1f}s)")
    time.sleep(t)


def validar_archivos():
    """Valida que existan los archivos necesarios."""
    errores = []
    
    if not Path(CONFIG["input_file"]).exists():
        errores.append(f"❌ No existe el archivo de invitados: {CONFIG['input_file']}")
    
    if not Path(CONFIG["video_file"]).exists():
        errores.append(f"❌ No existe el video: {CONFIG['video_file']}")
    else:
        # Validar tamaño del video (WhatsApp límite ~16MB para video)
        size_mb = Path(CONFIG["video_file"]).stat().st_size / (1024 * 1024)
        if size_mb > 16:
            errores.append(f"⚠️  El video pesa {size_mb:.1f}MB. WhatsApp tiene límite de ~16MB")
        else:
            log.info(f"📹 Video: {CONFIG['video_file']} ({size_mb:.1f}MB)")
    
    if errores:
        for e in errores:
            log.error(e)
        sys.exit(1)


def load_dataframe() -> pd.DataFrame:
    """Carga el Excel y prepara columnas de estado."""
    df = pd.read_excel(CONFIG["input_file"])
    
    # Validar columnas requeridas (generadas por preparar_invitados.py)
    required = ["Nombre", "Telefono", "ID"]
    missing = [col for col in required if col not in df.columns]
    if missing:
        log.error(f"❌ Faltan columnas en el Excel: {missing}")
        log.error(f"   Columnas encontradas: {list(df.columns)}")
        log.error(f"   ¿Ejecutaste primero 'python preparar_invitados.py'?")
        sys.exit(1)
    
    # Agregar columnas de tracking si no existen
    for col in ["Estado", "Enviado_at", "Enviado_por", "Error"]:
        if col not in df.columns:
            df[col] = ""
    
    # El teléfono ya viene normalizado de preparar_invitados.py
    # Pero por si acaso, aseguramos que sea string
    df["Telefono"] = df["Telefono"].astype(str)
    
    return df


def save_progress(df: pd.DataFrame):
    """Guarda progreso al archivo de resultados."""
    df.to_excel(CONFIG["output_file"], index=False)


# ═══════════════════════════════════════════════════════════════════════════════
# CLASE PRINCIPAL - WHATSAPP SENDER
# ═══════════════════════════════════════════════════════════════════════════════

class WhatsAppSender:
    """Maneja una sesión de WhatsApp Web para enviar mensajes con video."""
    
    def __init__(self, cuenta: dict):
        self.cuenta = cuenta
        self.nombre = cuenta["nombre"]
        self.session_file = Path(cuenta["session_file"])
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None
        self.enviados = 0
        self.video_path = str(Path(CONFIG["video_file"]).absolute())
    
    def iniciar(self):
        """Inicia el navegador y espera login de WhatsApp."""
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=CONFIG["headless"])
        
        if self.session_file.exists():
            self.context = self.browser.new_context(storage_state=str(self.session_file))
            log.info(f"[{self.nombre}] 📂 Sesión cargada desde {self.session_file}")
        else:
            self.context = self.browser.new_context()
            log.info(f"[{self.nombre}] 🆕 Nueva sesión")
        
        self.page = self.context.new_page()
        self.page.goto("https://web.whatsapp.com")
        
        log.info(f"[{self.nombre}] 📱 Esperando WhatsApp Web... (escanea QR si es necesario)")
        
        # Esperar a que cargue WhatsApp (lista de chats visible)
        self.page.wait_for_selector(
            "div[aria-label='Chat list'], div[aria-label='Lista de chats']",
            timeout=120000  # 2 minutos para escanear QR
        )
        
        # Guardar sesión
        self.context.storage_state(path=str(self.session_file))
        log.info(f"[{self.nombre}] ✅ WhatsApp listo")
    
    def _detectar_numero_invalido(self) -> bool:
        """Detecta si WhatsApp muestra error de número inválido."""
        try:
            # Buscar textos de error comunes
            error_patterns = [
                "text=/phone number shared via url is invalid/i",
                "text=/número de teléfono compartido/i",
                "text=/invalid/i",
            ]
            for pattern in error_patterns:
                if self.page.locator(pattern).count() > 0:
                    return True
            
            # Buscar el popup de error
            if self.page.locator("div[data-animate-modal-popup='true']").count() > 0:
                return True
                
            return False
        except Exception:
            return False
    
    def _esperar_envio(self, timeout: int = 60000) -> bool:
        """Espera a que el mensaje se envíe (aparece el checkmark)."""
        try:
            # Buscar el último mensaje con check de enviado
            self.page.wait_for_selector(
                "span[data-icon='msg-check'], span[data-icon='msg-dblcheck']",
                timeout=timeout
            )
            return True
        except PlaywrightTimeout:
            return False
    
    def enviar_con_video(self, nombre: str, phone: str, invitado_id: str) -> dict:
        """Envía video + mensaje personalizado a un contacto."""
        resultado = {
            "estado": "",
            "timestamp": "",
            "enviado_por": self.nombre,
            "error": ""
        }
        
        try:
            # Navegar al chat
            url = f"https://web.whatsapp.com/send?phone={phone}"
            log.info(f"[{self.nombre}] ➡️  Enviando a {nombre} ({phone})")
            self.page.goto(url)
            
            random_sleep(CONFIG["delay_antes_adjuntar"], "Esperando chat")
            
            # Verificar número inválido
            if self._detectar_numero_invalido(self):
                resultado["estado"] = "NUMERO_INVALIDO"
                resultado["error"] = "WhatsApp no reconoce el número"
                log.warning(f"[{self.nombre}] ❌ Número inválido: {phone}")
                return resultado
            
            # Esperar que cargue el chat
            try:
                self.page.wait_for_selector(
                    "div[contenteditable='true'][data-tab='10']",
                    timeout=30000
                )
            except PlaywrightTimeout:
                resultado["estado"] = "CHAT_NO_CARGO"
                resultado["error"] = "No se pudo abrir el chat"
                log.error(f"[{self.nombre}] ⏰ Chat no cargó: {nombre}")
                return resultado
            
            # ═══════════════════════════════════════════════════════════════
            # PASO 1: Abrir menú de adjuntar
            # ═══════════════════════════════════════════════════════════════
            attach_button = self.page.locator("span[data-icon='plus'], span[data-icon='attach-menu-plus']").first
            attach_button.click()
            random_sleep((1, 2))
            
            # ═══════════════════════════════════════════════════════════════
            # PASO 2: Seleccionar input de fotos/videos y subir archivo
            # ═══════════════════════════════════════════════════════════════
            # WhatsApp tiene un input oculto para archivos
            file_input = self.page.locator("input[accept*='video']").first
            file_input.set_input_files(self.video_path)
            
            log.debug(f"[{self.nombre}] 📤 Subiendo video...")
            random_sleep(CONFIG["delay_carga_video"], "Cargando video")
            
            # ═══════════════════════════════════════════════════════════════
            # PASO 3: Agregar caption (mensaje) al video
            # ═══════════════════════════════════════════════════════════════
            # Buscar el campo de caption en la vista previa del video
            caption_selectors = [
                "div[contenteditable='true'][data-tab='10']",
                "div.copyable-text.selectable-text[contenteditable='true']",
                "p.selectable-text[data-lexical-text='true']",
            ]
            
            caption_box = None
            for selector in caption_selectors:
                try:
                    # En la vista de preview, el caption es el campo editable
                    caption_box = self.page.locator(selector).last
                    if caption_box.is_visible():
                        break
                except Exception:
                    continue
            
            if caption_box:
                mensaje = build_message(nombre, invitado_id, self.cuenta)
                caption_box.fill(mensaje)
                random_sleep(CONFIG["delay_antes_enviar"])
            else:
                log.warning(f"[{self.nombre}] ⚠️  No se pudo agregar caption")
            
            # ═══════════════════════════════════════════════════════════════
            # PASO 4: Enviar
            # ═══════════════════════════════════════════════════════════════
            send_button = self.page.locator("span[data-icon='send']").first
            send_button.click()
            
            # Esperar confirmación de envío
            if self._esperar_envio(timeout=90000):  # 90 seg para video
                resultado["estado"] = "ENVIADO"
                resultado["timestamp"] = datetime.now().isoformat()
                self.enviados += 1
                log.info(f"[{self.nombre}] ✅ Enviado a {nombre}")
            else:
                resultado["estado"] = "NO_CONFIRMADO"
                resultado["error"] = "No se detectó confirmación de envío"
                log.warning(f"[{self.nombre}] ⚠️  No confirmado: {nombre}")
            
            # Pausa entre mensajes
            random_sleep(CONFIG["delay_entre_mensajes"], "Entre mensajes")
            
            # Pausa larga cada N mensajes
            if self.enviados > 0 and self.enviados % CONFIG["pausa_larga_cada"] == 0:
                log.info(f"[{self.nombre}] 🧠 Pausa larga anti-bloqueo...")
                random_sleep(CONFIG["pausa_larga_rango"])
                
        except PlaywrightTimeout as e:
            resultado["estado"] = "TIMEOUT"
            resultado["error"] = str(e)[:100]
            log.error(f"[{self.nombre}] ⏰ Timeout: {nombre}")
            
        except Exception as e:
            resultado["estado"] = "ERROR"
            resultado["error"] = str(e)[:100]
            log.error(f"[{self.nombre}] 💥 Error con {nombre}: {e}")
        
        return resultado
    
    def cerrar(self):
        """Cierra el navegador guardando la sesión."""
        try:
            if self.context:
                self.context.storage_state(path=str(self.session_file))
            if self.browser:
                self.browser.close()
            if self.playwright:
                self.playwright.stop()
        except Exception as e:
            log.warning(f"[{self.nombre}] Error al cerrar: {e}")
        
        log.info(f"[{self.nombre}] 👋 Cerrado. Total enviados: {self.enviados}")


# ═══════════════════════════════════════════════════════════════════════════════
# MODOS DE ENVÍO
# ═══════════════════════════════════════════════════════════════════════════════

def enviar_alternado(df: pd.DataFrame, senders: list):
    """Alterna entre cuentas: uno Mauricio, uno Esposa, etc."""
    pendientes = df[df["Estado"] != "ENVIADO"].index.tolist()
    total = len(pendientes)
    
    log.info(f"📋 Pendientes: {total} invitados")
    
    for idx, i in enumerate(pendientes):
        sender = senders[idx % len(senders)]
        
        row = df.loc[i]
        nombre = str(row["Nombre"]).strip()
        phone = str(row["Telefono"]).strip()
        invitado_id = str(row["ID"]).strip()
        
        # Validaciones
        if not phone:
            df.at[i, "Estado"] = "SIN_TELEFONO"
            df.at[i, "Error"] = "Teléfono vacío"
            save_progress(df)
            continue
        
        if not invitado_id:
            df.at[i, "Estado"] = "SIN_ID"
            df.at[i, "Error"] = "ID vacío"
            save_progress(df)
            continue
        
        # Enviar
        resultado = sender.enviar_con_video(nombre, phone, invitado_id)
        
        df.at[i, "Estado"] = resultado["estado"]
        df.at[i, "Enviado_at"] = resultado["timestamp"]
        df.at[i, "Enviado_por"] = resultado["enviado_por"]
        df.at[i, "Error"] = resultado["error"]
        
        save_progress(df)
        
        # Progreso
        enviados = len(df[df["Estado"] == "ENVIADO"])
        log.info(f"📊 Progreso: {enviados}/{total} ({100*enviados/total:.1f}%)")


def enviar_paralelo(df: pd.DataFrame, senders: list):
    """Cada cuenta envía a su mitad en paralelo."""
    pendientes = df[df["Estado"] != "ENVIADO"].index.tolist()
    total = len(pendientes)
    
    log.info(f"📋 Pendientes: {total} invitados (modo paralelo)")
    
    # Dividir entre cuentas
    mitad = len(pendientes) // 2
    asignaciones = {
        0: pendientes[:mitad],
        1: pendientes[mitad:]
    }
    
    def worker(sender_idx: int):
        sender = senders[sender_idx]
        indices = asignaciones[sender_idx]
        
        for i in indices:
            row = df.loc[i]
            nombre = str(row["Nombre"]).strip()
            phone = str(row["Telefono"]).strip()
            invitado_id = str(row["ID"]).strip()
            
            if not phone:
                df.at[i, "Estado"] = "SIN_TELEFONO"
                save_progress(df)
                continue
            
            if not invitado_id:
                df.at[i, "Estado"] = "SIN_ID"
                save_progress(df)
                continue
            
            resultado = sender.enviar_con_video(nombre, phone, invitado_id)
            
            df.at[i, "Estado"] = resultado["estado"]
            df.at[i, "Enviado_at"] = resultado["timestamp"]
            df.at[i, "Enviado_por"] = resultado["enviado_por"]
            df.at[i, "Error"] = resultado["error"]
            
            save_progress(df)
    
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = [executor.submit(worker, i) for i in range(len(senders))]
        for f in as_completed(futures):
            try:
                f.result()
            except Exception as e:
                log.error(f"💥 Error en worker: {e}")


# ═══════════════════════════════════════════════════════════════════════════════
# COMANDOS
# ═══════════════════════════════════════════════════════════════════════════════

def cmd_setup():
    """Configura las sesiones de WhatsApp (escanear QR)."""
    print("=" * 60)
    print("CONFIGURACIÓN DE SESIONES DE WHATSAPP")
    print("=" * 60)
    print("\nSe abrirá un navegador para cada cuenta.")
    print("Escanea el código QR con tu teléfono.\n")
    
    for cuenta in CUENTAS:
        input(f"Presiona Enter para configurar: {cuenta['nombre']} ")
        
        sender = WhatsAppSender(cuenta)
        try:
            sender.iniciar()
            print(f"✅ {cuenta['nombre']} configurado correctamente!\n")
        finally:
            sender.cerrar()
    
    print("=" * 60)
    print("🎉 Ambas sesiones guardadas.")
    print("   Ya puedes ejecutar: python enviar_invitaciones.py")
    print("=" * 60)


def cmd_test():
    """Envía solo al primer contacto pendiente (prueba)."""
    log.info("🧪 MODO TEST - Solo se enviará al primer contacto")
    
    validar_archivos()
    df = load_dataframe()
    
    pendientes = df[df["Estado"] != "ENVIADO"]
    if pendientes.empty:
        log.info("✅ No hay contactos pendientes")
        return
    
    # Usar solo la primera cuenta
    sender = WhatsAppSender(CUENTAS[0])
    
    try:
        sender.iniciar()
        
        row = pendientes.iloc[0]
        i = pendientes.index[0]
        
        resultado = sender.enviar_con_video(
            str(row["Nombre"]).strip(),
            str(row["Telefono"]).strip(),
            str(row["ID"]).strip()
        )
        
        df.at[i, "Estado"] = resultado["estado"]
        df.at[i, "Enviado_at"] = resultado["timestamp"]
        df.at[i, "Enviado_por"] = resultado["enviado_por"]
        df.at[i, "Error"] = resultado["error"]
        
        save_progress(df)
        
        log.info(f"🧪 Test completado: {resultado['estado']}")
        
    finally:
        sender.cerrar()


def cmd_enviar():
    """Envía las invitaciones a todos los pendientes."""
    log.info("🚀 Iniciando envío de invitaciones")
    
    validar_archivos()
    df = load_dataframe()
    
    pendientes = len(df[df["Estado"] != "ENVIADO"])
    if pendientes == 0:
        log.info("✅ No hay contactos pendientes. Todos enviados!")
        return
    
    log.info(f"📋 Contactos pendientes: {pendientes}")
    log.info(f"📹 Video: {CONFIG['video_file']}")
    log.info(f"🔄 Modo: {CONFIG['modo']}")
    
    # Verificar sesiones
    for cuenta in CUENTAS:
        if not Path(cuenta["session_file"]).exists():
            log.error(f"❌ No existe sesión para {cuenta['nombre']}")
            log.error("   Ejecuta primero: python enviar_invitaciones.py setup")
            sys.exit(1)
    
    # Iniciar senders
    senders = [WhatsAppSender(cuenta) for cuenta in CUENTAS]
    
    try:
        for sender in senders:
            sender.iniciar()
        
        if CONFIG["modo"] == "paralelo":
            enviar_paralelo(df, senders)
        else:
            enviar_alternado(df, senders)
            
    finally:
        for sender in senders:
            sender.cerrar()
    
    # Resumen final
    print("\n" + "=" * 60)
    print("📊 RESUMEN FINAL")
    print("=" * 60)
    df_final = pd.read_excel(CONFIG["output_file"])
    resumen = df_final["Estado"].value_counts()
    print(resumen.to_string())
    print("=" * 60)


def cmd_status():
    """Muestra el estado actual de los envíos."""
    if not Path(CONFIG["output_file"]).exists():
        print("No hay envíos previos. El archivo de resultados no existe.")
        return
    
    df = pd.read_excel(CONFIG["output_file"])
    
    print("\n" + "=" * 60)
    print("📊 ESTADO DE ENVÍOS")
    print("=" * 60)
    print(f"Total contactos: {len(df)}")
    print("-" * 40)
    print(df["Estado"].value_counts().to_string())
    print("-" * 40)
    
    # Mostrar errores si hay
    errores = df[df["Estado"].isin(["ERROR", "TIMEOUT", "NUMERO_INVALIDO"])]
    if not errores.empty:
        print("\n⚠️  Contactos con errores:")
        for _, row in errores.iterrows():
            print(f"   - {row['Nombre']}: {row['Estado']} ({row.get('Error', '')})")
    
    print("=" * 60)


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    comandos = {
        "setup": cmd_setup,
        "test": cmd_test,
        "status": cmd_status,
    }
    
    if len(sys.argv) > 1:
        cmd = sys.argv[1].lower()
        if cmd in comandos:
            comandos[cmd]()
        else:
            print(f"Comando desconocido: {cmd}")
            print(f"Comandos disponibles: {', '.join(comandos.keys())}")
            sys.exit(1)
    else:
        cmd_enviar()


if __name__ == "__main__":
    main()
