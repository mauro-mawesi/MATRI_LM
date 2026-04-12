# 💒 Envío Automatizado de Invitaciones de Boda por WhatsApp

Script para enviar invitaciones de boda por WhatsApp con video personalizado y link a Google Form de confirmación.

## ⚠️ Advertencia Importante

WhatsApp **prohíbe la automatización** y puede banear tu número si detecta comportamiento de bot. Este script incluye medidas anti-detección, pero **no hay garantías**. Recomendaciones:

- Usa un número secundario para probar primero
- No envíes más de 50-100 mensajes por día por cuenta
- Los delays están configurados de forma conservadora

## 📁 Estructura de Archivos

```
whatsapp_boda/
├── enviar_invitaciones.py   # Script principal de envío
├── preparar_invitados.py    # Procesa tu Excel y selecciona representantes
├── requirements.txt         # Dependencias
├── invitados.xlsx           # Tu lista de invitados (tu archivo original)
├── invitados_enviar.xlsx    # Generado: lista filtrada para enviar
├── video_invitacion.mp4     # Tu video de invitación
├── sesion_mauricio.json     # Sesión WhatsApp (se genera)
└── sesion_esposa.json       # Sesión WhatsApp (se genera)
```

## 🚀 Instalación

```bash
# 1. Crear entorno virtual (recomendado)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Instalar navegador de Playwright
playwright install chromium
```

## 📋 Estructura de tu Excel

Tu archivo `invitados.xlsx` debe tener estas columnas:

| Columna | Descripción |
|---------|-------------|
| `Número` | ID del grupo/familia (varios invitados pueden compartir el mismo) |
| `Invite type` | Tipo: Couple, Family, Single |
| `Nombre` | Nombre del invitado |
| `Categoria` | VIP, Amigos, Expats, Familia, etc. |
| `Sacar` | Poner "x" si NO se debe invitar |
| `NúmeroWhatsApp` | Teléfono con código de país (+57..., +52..., etc.) |

### Valores especiales en NúmeroWhatsApp:
- `+573001234567` → Número válido ✅
- `Preguntar` → No tiene número, se salta ⏭️
- `⇧` → Mismo que el anterior, se salta ⏭️
- Vacío → Se salta ⏭️

## 🔧 Uso Paso a Paso

### Paso 1: Preparar invitados

```bash
python preparar_invitados.py
```

Esto:
1. Lee tu `invitados.xlsx`
2. Agrupa por `Número` (familia/grupo)
3. Excluye los marcados con "x" en `Sacar`
4. Selecciona UN representante por grupo (el primero con número válido)
5. Genera `invitados_enviar.xlsx` con la lista final

**Salida de ejemplo:**
```
📊 ANÁLISIS INICIAL
   Total personas: 150
   Grupos/familias únicos: 78
   Marcados para excluir: 12
   Con teléfono válido: 95

🔍 SELECCIONANDO REPRESENTANTES
   ✅ Grupos con representante: 72
   ❌ Grupos sin representante: 6
```

### Paso 2: Revisar grupos sin representante

El script genera `reporte_preparacion.xlsx` con una hoja "Sin_Representante" que lista los grupos que no tienen ningún miembro con número de WhatsApp válido. **Revisa y completa esos números manualmente.**

### Paso 3: Agregar tu video

Coloca tu video como `video_invitacion.mp4` en la misma carpeta.

**Requisitos del video:**
- Formato: MP4
- Tamaño máximo: **16 MB** (límite de WhatsApp)
- Duración recomendada: < 60 segundos

### Paso 4: Configurar el script

Edita `enviar_invitaciones.py`:

```python
CUENTAS = [
    {
        "nombre": "Mauricio",  # Tu nombre
        "variantes": [
            "Hola {nombre} 😄 Soy Mauricio.\n..."  # Personaliza
        ]
    },
    {
        "nombre": "Laura",  # Nombre de tu esposa
        "variantes": [
            "Hola {nombre} 😄 Soy Laura.\n..."  # Personaliza
        ]
    },
]

CONFIG = {
    "form_base_url": "https://docs.google.com/forms/d/e/...",  # Tu form
    "form_entry_field": "entry.825958218",  # Campo del form
    # ...
}
```

### Paso 5: Configurar sesiones de WhatsApp

```bash
python enviar_invitaciones.py setup
```

Se abrirán 2 navegadores. Escanea el QR de WhatsApp Web en cada uno.

### Paso 6: Probar con UN contacto

```bash
python enviar_invitaciones.py test
```

Verifica que el video se envíe correctamente y el mensaje se vea bien.

### Paso 7: Enviar a todos

```bash
python enviar_invitaciones.py
```

### Ver estado

```bash
python enviar_invitaciones.py status
```

## 📊 Tracking de Envíos

El archivo `invitados_resultado.xlsx` se actualiza después de cada envío:

| Estado | Significado |
|--------|-------------|
| `ENVIADO` | ✅ Enviado correctamente |
| `NUMERO_INVALIDO` | ❌ WhatsApp no reconoce el número |
| `TIMEOUT` | ⏰ Se tardó demasiado |
| `NO_CONFIRMADO` | ⚠️ Se envió pero no se confirmó el check |
| `ERROR` | 💥 Otro error (ver columna Error) |

## 🔄 Retomar Envíos

Si el script se detiene por cualquier razón, simplemente ejecútalo de nuevo:

```bash
python enviar_invitaciones.py
```

Saltará automáticamente los contactos que ya tienen estado `ENVIADO`.

## ⚙️ Ajustar Velocidad

Si quieres ser más conservador (menos riesgo de ban pero más lento), edita en `CONFIG`:

```python
"delay_entre_mensajes": (45, 90),    # Más tiempo entre mensajes
"pausa_larga_cada": 5,               # Pausa larga cada 5 mensajes
"pausa_larga_rango": (600, 900),     # Pausas de 10-15 minutos
```

## 🛠️ Solución de Problemas

### "No existe sesión para..."
Ejecuta `python enviar_invitaciones.py setup` primero.

### "El video pesa más de 16MB"
Comprime el video. Opciones:
- HandBrake (gratis): https://handbrake.fr
- FFmpeg: `ffmpeg -i video.mp4 -vcodec h264 -acodec aac -crf 28 video_comprimido.mp4`

### Muchos TIMEOUT
- Aumenta los delays en CONFIG
- Verifica tu conexión a internet
- El video puede ser muy pesado

### "Grupos sin representante"
Revisa el reporte y agrega los números de WhatsApp faltantes en tu Excel original, luego ejecuta `preparar_invitados.py` de nuevo.

### Los selectores de WhatsApp no funcionan
WhatsApp Web cambia su interfaz frecuentemente. Si algo falla, puede que los selectores CSS necesiten actualizarse.

## 📱 Google Form

Para que el ID del invitado llegue prellenado:

1. Ve a tu Google Form
2. Click en ⋮ → "Obtener enlace con respuestas precargadas"
3. Llena el campo ID con cualquier valor
4. Copia el link generado
5. Extrae el `entry.XXXXXX` de la URL

Ejemplo:
```
https://docs.google.com/forms/d/e/.../viewform?usp=pp_url&entry.825958218=TEST
                                                          ^^^^^^^^^^^^^^^^
                                                          Este es tu campo
```

## 📝 Logs

Los logs se guardan en archivos `envios_YYYYMMDD_HHMMSS.log` con toda la actividad.

---

¡Felicidades por tu boda! 💒💍
