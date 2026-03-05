"""
Script de migración a Firebase
================================
Pasos:
1. pip install firebase-admin
2. Pon el archivo JSON de credenciales en la misma carpeta que este script
3. Ejecuta: python migrar_firebase.py
"""

import firebase_admin
from firebase_admin import credentials, firestore
import json

# ── Inicializar Firebase ──────────────────────────────────────────────────────
cred = credentials.Certificate('compromisos-22fa4-firebase-adminsdk-fbsvc-3e5ff5e141.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
print("✅ Conectado a Firebase\n")

# ── Función para eliminar toda una colección ──────────────────────────────────
def eliminar_coleccion(nombre_col, batch_size=100):
    docs = list(db.collection(nombre_col).limit(batch_size).stream())
    deleted = 0
    for doc in docs:
        doc.reference.delete()
        deleted += 1
    if deleted >= batch_size:
        return deleted + eliminar_coleccion(nombre_col, batch_size)
    return deleted

# ── Cargar datos desde JSON ───────────────────────────────────────────────────
with open('datos_firebase.json', 'r', encoding='utf-8') as f:
    datos = json.load(f)

compromisos  = datos['compromisos']
responsables = datos['responsables']
secretarios  = datos['secretarios']

# ── 1. ELIMINAR SOLO SECRETARIOS ─────────────────────────────────────────────
print("🗑️  Eliminando secretarios existentes...")
n = eliminar_coleccion('secretarios')
print(f"   - secretarios: {n} documentos eliminados\n")

# ── 2. SUBIR SECRETARIOS ──────────────────────────────────────────────────────
print(f"📤 Subiendo {len(secretarios)} secretarios...")
col_ref = db.collection('secretarios')
for doc in secretarios:
    col_ref.add(doc)
print(f"   ✅ {len(secretarios)} secretarios subidos")

print("\n🎉 Secretarios migrados exitosamente!")
