import pandas as pd
import urllib.parse
import random
import time
import logging
from pathlib import Path
from datetime import datetime
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

# ─────────────────────────────────────────────────────────────
# CONFIGURACIÓN
# ─────────────────────────────────────────────────────────────
CONFIG = {
    "input_file": "invitados.xlsx",
    "output_file": "invitados_resultado.xlsx",
    "session_file": "wa_session.json",
    "invitacion_url": "https://docs.google.com/forms/d/e/1FAIpQLSdHqRZAK_zBUusDjocL-qNLuJMYIjLXrqDBet0JoXuO7vB4aQ/viewform?usp=pp_url&entry.825958218=",
    "default_country_code": "57",  # México
    "delay_entre_mensajes": (15, 40),
    "delay_antes_enviar": (3, 6),
    "pausa_larga_cada": 10,
    "pausa_larga_rango": (180, 480),
}
    
# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler(f"envios_{datetime.now():%Y%m%d_%H%M}.log"),
        logging.StreamHandler()
    ]
)
log = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────
# FUNCIONES
# ─────────────────────────────────────────────────────────────

def normalize_phone(phone: str, country_code: str = CONFIG["default_country_code"]) -> str:
    """Normaliza teléfono: solo dígitos, agrega código de país si falta."""
    digits = "".join(ch for ch in str(phone) if ch.isdigit())
    if not digits:
        return ""
    # Si no tiene código de país (menos de 12 dígitos para MX), agregarlo
    if len(digits) == 10:
        digits = country_code + digits
    return digits


def build_message(nombre: str) -> str:
    url = CONFIG["invitacion_url"]
    variants = [
        f"Hola {nombre} 😄 Soy Mauricio.\nTe comparto la invitación a nuestra boda 💍\n\n{url}\n\nNos confirmas porfa 🙏",
        f"Hola {nombre}! 😄\nSoy Mauricio. Te envío la invitación a nuestra boda 💍\n\n{url}\n\nConfírmame si puedes asistir 🙏",
        f"Hola {nombre} 😄\nTe escribo para compartirte nuestra invitación de boda 💍\n\n{url}\n\nUn abrazo!",
    ]
    return random.choice(variants)


def random_sleep(rango: tuple[float, float], msg: str = ""):
    t = random.uniform(*rango)
    if msg:
        log.debug(f"⏳ {msg} ({t:.1f}s)")
    time.sleep(t)


def check_invalid_number(page) -> bool:
    """Detecta si WhatsApp muestra 'número no válido'."""
    try:
        # WhatsApp muestra un popup si el número no existe
        invalid_selectors = [
            "div[data-animate-modal-popup='true']",
            "text='Phone number shared via url is invalid'"
        ]
        for sel in invalid_selectors:
            if page.locator(sel).count() > 0:
                return True
        return False
    except Exception:
        return False


def wait_for_message_sent(page, timeout: int = 30000) -> bool:
    """Espera a que aparezca el checkmark de enviado."""
    try:
        # Busca el último mensaje enviado con check
        page.wait_for_selector(
            "span[data-icon='msg-check'], span[data-icon='msg-dblcheck']",
            timeout=timeout
        )
        return True
    except PlaywrightTimeout:
        return False


def load_dataframe() -> pd.DataFrame:
    """Carga el Excel y prepara columnas de estado."""
    df = pd.read_excel(CONFIG["input_file"])
    
    # Agregar columnas de tracking si no existen
    if "Estado" not in df.columns:
        df["Estado"] = ""
    if "Enviado_at" not in df.columns:
        df["Enviado_at"] = ""
    
    df["Telefono"] = df["Telefono"].apply(normalize_phone)
    return df


def save_progress(df: pd.DataFrame):
    """Guarda progreso al archivo de resultados."""
    df.to_excel(CONFIG["output_file"], index=False)


def send_messages():
    df = load_dataframe()
    session_path = Path(CONFIG["session_file"])
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        
        # Reutilizar sesión si existe
        if session_path.exists():
            context = browser.new_context(storage_state=str(session_path))
            log.info("📂 Sesión anterior cargada")
        else:
            context = browser.new_context()
        
        page = context.new_page()
        page.goto("https://web.whatsapp.com")
        
        log.info("📱 Esperando WhatsApp Web...")
        page.wait_for_selector("div[aria-label='Chat list']", timeout=0)
        log.info("✅ WhatsApp listo")
        
        # Guardar sesión para próximas ejecuciones
        context.storage_state(path=str(session_path))
        
        enviados = 0
        for i, row in df.iterrows():
            # Saltar si ya se envió
            if row["Estado"] == "ENVIADO":
                log.info(f"⏭️  Fila {i}: ya enviado, saltando")
                continue
            
            nombre = str(row["Nombre"]).strip()
            phone = str(row["Telefono"]).strip()
            
            if not phone:
                df.at[i, "Estado"] = "SIN_TELEFONO"
                log.warning(f"⚠️  Fila {i}: sin teléfono")
                save_progress(df)
                continue
            
            try:
                msg = build_message(nombre)
                encoded = urllib.parse.quote(msg)
                url = f"https://web.whatsapp.com/send?phone={phone}&text={encoded}"
                
                log.info(f"➡️  Enviando a {nombre} ({phone})")
                page.goto(url)
                
                # Esperar carga
                random_sleep((2, 4))
                
                # Verificar número inválido
                if check_invalid_number(page):
                    df.at[i, "Estado"] = "NUMERO_INVALIDO"
                    log.warning(f"❌ Número inválido: {phone}")
                    save_progress(df)
                    continue
                
                # Esperar cuadro de texto
                page.wait_for_selector(
                    "div[contenteditable='true'][data-tab='10']",
                    timeout=60000
                )
                
                random_sleep(CONFIG["delay_antes_enviar"], "Antes de enviar")
                page.keyboard.press("Enter")
                
                # Verificar envío
                if wait_for_message_sent(page):
                    df.at[i, "Estado"] = "ENVIADO"
                    df.at[i, "Enviado_at"] = datetime.now().isoformat()
                    log.info(f"✅ Enviado a {nombre}")
                else:
                    df.at[i, "Estado"] = "NO_CONFIRMADO"
                    log.warning(f"⚠️  Envío no confirmado: {nombre}")
                
                save_progress(df)
                enviados += 1
                
                # Pausas
                random_sleep(CONFIG["delay_entre_mensajes"], "Entre mensajes")
                
                if enviados % CONFIG["pausa_larga_cada"] == 0:
                    log.info("🧠 Pausa larga anti-bloqueo...")
                    random_sleep(CONFIG["pausa_larga_rango"])
                    
            except PlaywrightTimeout as e:
                df.at[i, "Estado"] = "TIMEOUT"
                log.error(f"⏰ Timeout en {nombre}: {e}")
                save_progress(df)
                
            except Exception as e:
                df.at[i, "Estado"] = f"ERROR: {str(e)[:50]}"
                log.error(f"💥 Error en {nombre}: {e}")
                save_progress(df)
        
        # Guardar sesión final
        context.storage_state(path=str(session_path))
        log.info(f"🎉 Terminado. Enviados: {enviados}")
        browser.close()


if __name__ == "__main__":
    send_messages()