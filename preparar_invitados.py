"""
Script para preparar el archivo de invitados.

Lógica:
1. Agrupa por 'Número' (ID de familia/grupo)
2. Excluye los que tienen 'x' en columna 'Sacar'
3. De cada grupo, selecciona UNA persona con número de WhatsApp válido
4. Genera el archivo final para enviar invitaciones

Uso:
    python preparar_invitados.py
"""

import pandas as pd
import re
from pathlib import Path

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════════════════════

INPUT_FILE = "invitados.xlsx"
OUTPUT_FILE = "invitados_enviar.xlsx"
REPORTE_FILE = "reporte_preparacion.xlsx"

# ═══════════════════════════════════════════════════════════════════════════════
# FUNCIONES
# ═══════════════════════════════════════════════════════════════════════════════

def es_numero_valido(valor) -> bool:
    """
    Verifica si el valor es un número de WhatsApp válido.
    Válido: empieza con + seguido de dígitos
    Inválido: vacío, 'Preguntar', 'PREGUNTAR', '⇧', etc.
    """
    if pd.isna(valor):
        return False
    
    valor_str = str(valor).strip()
    
    # Lista de valores inválidos
    invalidos = ['preguntar', '⇧', '', 'nan', 'none']
    if valor_str.lower() in invalidos:
        return False
    
    # Debe empezar con + y tener al menos 8 dígitos
    if valor_str.startswith('+'):
        digitos = re.sub(r'\D', '', valor_str)
        return len(digitos) >= 8
    
    # También aceptar números sin + pero con suficientes dígitos
    digitos = re.sub(r'\D', '', valor_str)
    return len(digitos) >= 10


def normalizar_telefono(valor) -> str:
    """Normaliza el número de teléfono."""
    if not es_numero_valido(valor):
        return ""
    
    valor_str = str(valor).strip()
    
    # Extraer solo dígitos
    digitos = re.sub(r'\D', '', valor_str)
    
    return digitos


def debe_excluir(row) -> bool:
    """Verifica si la fila debe ser excluida (columna 'Sacar' tiene 'x')."""
    sacar = row.get('Sacar', '')
    if pd.isna(sacar):
        return False
    return str(sacar).strip().lower() == 'x'


def seleccionar_representante(grupo: pd.DataFrame) -> pd.Series:
    """
    De un grupo familiar, selecciona el mejor representante:
    1. No debe estar marcado para 'Sacar'
    2. Debe tener número de WhatsApp válido
    3. Prioriza por orden en el Excel (primero que cumpla)
    """
    for _, row in grupo.iterrows():
        # Verificar que no está excluido
        if debe_excluir(row):
            continue
        
        # Verificar que tiene número válido
        telefono = row.get('NúmeroWhatsApp', '')
        if es_numero_valido(telefono):
            return row
    
    # Si no hay ninguno válido, retornar None
    return None


def generar_id(numero_grupo, nombre) -> str:
    """Genera un ID único basado en el número de grupo."""
    return f"G{str(numero_grupo).zfill(3)}"


def procesar_invitados():
    """Procesa el archivo de invitados y genera el archivo para envío."""
    
    print("=" * 70)
    print("PREPARACIÓN DE ARCHIVO DE INVITADOS")
    print("=" * 70)
    
    # ═══════════════════════════════════════════════════════════════════════
    # 1. CARGAR ARCHIVO
    # ═══════════════════════════════════════════════════════════════════════
    
    if not Path(INPUT_FILE).exists():
        print(f"\n❌ No existe el archivo: {INPUT_FILE}")
        return
    
    df = pd.read_excel(INPUT_FILE)
    print(f"\n📂 Archivo cargado: {INPUT_FILE}")
    print(f"   Total filas: {len(df)}")
    print(f"   Columnas: {list(df.columns)}")
    
    # Verificar columnas requeridas
    columnas_requeridas = ['Número', 'Nombre', 'NúmeroWhatsApp']
    faltantes = [col for col in columnas_requeridas if col not in df.columns]
    if faltantes:
        print(f"\n❌ Faltan columnas: {faltantes}")
        print(f"   Columnas disponibles: {list(df.columns)}")
        return
    
    # ═══════════════════════════════════════════════════════════════════════
    # 2. ANÁLISIS INICIAL
    # ═══════════════════════════════════════════════════════════════════════
    
    print("\n" + "-" * 70)
    print("📊 ANÁLISIS INICIAL")
    print("-" * 70)
    
    total_personas = len(df)
    grupos_unicos = df['Número'].nunique()
    excluidos = df.apply(debe_excluir, axis=1).sum()
    
    print(f"   Total personas: {total_personas}")
    print(f"   Grupos/familias únicos: {grupos_unicos}")
    print(f"   Marcados para excluir (Sacar='x'): {excluidos}")
    
    # Contar números válidos
    df['_telefono_valido'] = df['NúmeroWhatsApp'].apply(es_numero_valido)
    con_telefono = df['_telefono_valido'].sum()
    print(f"   Con teléfono válido: {con_telefono}")
    
    # ═══════════════════════════════════════════════════════════════════════
    # 3. SELECCIONAR UN REPRESENTANTE POR GRUPO
    # ═══════════════════════════════════════════════════════════════════════
    
    print("\n" + "-" * 70)
    print("🔍 SELECCIONANDO REPRESENTANTES POR GRUPO")
    print("-" * 70)
    
    seleccionados = []
    sin_representante = []
    grupos_excluidos = []
    
    for numero_grupo, grupo in df.groupby('Número'):
        # Verificar si TODO el grupo está excluido (todos tienen "x" en Sacar)
        todos_excluidos = grupo.apply(debe_excluir, axis=1).all()
        
        if todos_excluidos:
            # Grupo completo no se invita - no es un problema, es intencional
            grupos_excluidos.append({
                'Numero_Grupo': numero_grupo,
                'Miembros': ', '.join(grupo['Nombre'].astype(str).tolist()),
            })
            continue
        
        representante = seleccionar_representante(grupo)
        
        if representante is not None:
            # Contar solo miembros que NO están excluidos
            miembros_activos = grupo[~grupo.apply(debe_excluir, axis=1)]
            
            seleccionados.append({
                'ID': generar_id(numero_grupo, representante['Nombre']),
                'Numero_Grupo': numero_grupo,
                'Nombre': representante['Nombre'],
                'Telefono': normalizar_telefono(representante['NúmeroWhatsApp']),
                'Categoria': representante.get('Categoria', ''),
                'Tipo': representante.get('Invite type', ''),
                'Miembros_Grupo': ', '.join(miembros_activos['Nombre'].astype(str).tolist()),
                'Total_Miembros': len(miembros_activos),
            })
        else:
            # Grupo con algunos miembros activos pero ninguno tiene número válido
            miembros_activos = grupo[~grupo.apply(debe_excluir, axis=1)]
            sin_representante.append({
                'Numero_Grupo': numero_grupo,
                'Miembros': ', '.join(miembros_activos['Nombre'].astype(str).tolist()),
                'Razon': 'Ningún miembro tiene número de WhatsApp válido'
            })
    
    print(f"   ✅ Grupos con representante: {len(seleccionados)}")
    print(f"   🚫 Grupos completamente excluidos: {len(grupos_excluidos)}")
    print(f"   ❌ Grupos sin número válido: {len(sin_representante)}")
    
    # ═══════════════════════════════════════════════════════════════════════
    # 4. CREAR DATAFRAME FINAL
    # ═══════════════════════════════════════════════════════════════════════
    
    df_enviar = pd.DataFrame(seleccionados)
    
    # Agregar columnas de estado para el script de envío
    df_enviar['Estado'] = ''
    df_enviar['Enviado_at'] = ''
    df_enviar['Enviado_por'] = ''
    df_enviar['Error'] = ''
    
    # ═══════════════════════════════════════════════════════════════════════
    # 5. GUARDAR ARCHIVOS
    # ═══════════════════════════════════════════════════════════════════════
    
    # Archivo principal para envío
    df_enviar.to_excel(OUTPUT_FILE, index=False)
    print(f"\n✅ Archivo para envío guardado: {OUTPUT_FILE}")
    
    # Reporte con detalles
    with pd.ExcelWriter(REPORTE_FILE, engine='openpyxl') as writer:
        df_enviar.to_excel(writer, sheet_name='Para_Enviar', index=False)
        
        if sin_representante:
            df_sin = pd.DataFrame(sin_representante)
            df_sin.to_excel(writer, sheet_name='Sin_Representante', index=False)
        
        if grupos_excluidos:
            df_excluidos = pd.DataFrame(grupos_excluidos)
            df_excluidos.to_excel(writer, sheet_name='Excluidos', index=False)
        
        # Resumen por categoría
        if 'Categoria' in df_enviar.columns:
            resumen = df_enviar.groupby('Categoria').agg({
                'ID': 'count',
                'Total_Miembros': 'sum'
            }).rename(columns={'ID': 'Invitaciones', 'Total_Miembros': 'Personas'})
            resumen.to_excel(writer, sheet_name='Resumen_Categoria')
    
    print(f"✅ Reporte detallado guardado: {REPORTE_FILE}")
    
    # ═══════════════════════════════════════════════════════════════════════
    # 6. MOSTRAR PREVIEW Y RESUMEN
    # ═══════════════════════════════════════════════════════════════════════
    
    print("\n" + "-" * 70)
    print("📋 PREVIEW - INVITACIONES A ENVIAR")
    print("-" * 70)
    
    preview_cols = ['ID', 'Nombre', 'Telefono', 'Categoria', 'Total_Miembros']
    print(df_enviar[preview_cols].head(15).to_string(index=False))
    
    if len(df_enviar) > 15:
        print(f"   ... y {len(df_enviar) - 15} más")
    
    # Resumen por categoría
    print("\n" + "-" * 70)
    print("📊 RESUMEN POR CATEGORÍA")
    print("-" * 70)
    
    if 'Categoria' in df_enviar.columns:
        resumen = df_enviar.groupby('Categoria').agg({
            'ID': 'count',
            'Total_Miembros': 'sum'
        }).rename(columns={'ID': 'Invitaciones', 'Total_Miembros': 'Personas'})
        print(resumen.to_string())
        print("-" * 40)
        print(f"TOTAL: {len(df_enviar)} invitaciones, {df_enviar['Total_Miembros'].sum()} personas")
    
    # Mostrar grupos sin representante (solo los que tienen miembros activos sin número)
    if sin_representante:
        print("\n" + "-" * 70)
        print("⚠️  GRUPOS SIN NÚMERO DE WHATSAPP (revisar manualmente)")
        print("-" * 70)
        for item in sin_representante:
            print(f"   Grupo {item['Numero_Grupo']}: {item['Miembros']}")
    
    # Mostrar grupos excluidos (informativo)
    if grupos_excluidos:
        print("\n" + "-" * 70)
        print(f"🚫 GRUPOS EXCLUIDOS (no se invitan): {len(grupos_excluidos)} grupos")
        print("-" * 70)
    
    print("\n" + "=" * 70)
    print("✅ PREPARACIÓN COMPLETADA")
    print(f"   Archivo listo: {OUTPUT_FILE}")
    print(f"   Total invitaciones: {len(df_enviar)}")
    print("=" * 70)


def analizar_numeros():
    """Analiza los números de WhatsApp para debug."""
    
    if not Path(INPUT_FILE).exists():
        print(f"❌ No existe: {INPUT_FILE}")
        return
    
    df = pd.read_excel(INPUT_FILE)
    
    print("\n📱 ANÁLISIS DE NÚMEROS DE WHATSAPP")
    print("-" * 50)
    
    valores_unicos = df['NúmeroWhatsApp'].dropna().unique()
    
    validos = []
    invalidos = []
    
    for val in valores_unicos:
        if es_numero_valido(val):
            validos.append(str(val))
        else:
            invalidos.append(str(val))
    
    print(f"\n✅ Valores válidos ({len(validos)}):")
    for v in sorted(validos)[:10]:
        print(f"   {v}")
    if len(validos) > 10:
        print(f"   ... y {len(validos) - 10} más")
    
    print(f"\n❌ Valores inválidos ({len(invalidos)}):")
    for v in invalidos:
        print(f"   '{v}'")


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "analizar":
        analizar_numeros()
    else:
        procesar_invitados()
