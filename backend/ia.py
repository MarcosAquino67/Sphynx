# ia.py — SPHYNX IA: proxy a Google Gemini (gratis sin tarjeta).
#
# Cómo conseguir la key (sin tarjeta):
#   1) Entrá a https://aistudio.google.com con tu cuenta de Google.
#   2) Creá una API key gratis (~250 pedidos/día, con visión/fotos).
#   3) Pegala en backend/.env como GEMINI_API_KEY=tu_key
#      (ese archivo NO se sube a git) y levantá con python iniciar.py.
#
# Opcional: IA_MODEL para forzar otro modelo (default gemini-3.8-flash).
# La key vive SOLO en el servidor: el celular nunca la ve,
# la app llama a POST /api/ia de este backend.

import os

import httpx

GEMINI_URL_TPL = "https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent"

SYSTEM_ES = (
    "Sos SPHYNX IA, tutor de Física para estudiantes de 3er curso "
    "(programa MEC: Movimiento Circular Uniforme y Lentes, más física general "
    "de secundaria: cinemática, fuerzas, energía, electricidad, óptica). "
    "REGLA DURA: solo respondés preguntas de FÍSICA. "
    "Si la pregunta o la imagen NO es de física (matemática pura, historia, "
    "chistes, tareas de otras materias, fotos no relacionadas, etc.), respondé "
    "EXACTAMENTE esto y nada más: "
    "'Solo puedo ayudarte con Física 🙂 Probá preguntarme sobre movimiento "
    "circular, lentes, fuerzas, energía o electricidad.' "
    "Si SÍ es física: respondé en español claro, corto (máx 120 palabras), "
    "con 1 ejemplo de la vida real y, si aplica, la fórmula. "
    "Si te mandan una imagen: analizala solo si muestra algo de física "
    "(diagrama, ejercicio, experimento, gráfica); si no, usá la respuesta "
    "de rechazo de arriba."
)

SYSTEM_JOPARA = (
    "Nde ha'e SPHYNX IA, mbo'ehára Física rehegua 3er curso-pe g̃uarã "
    "(programa MEC: Movimiento Circular Uniforme ha Lentes, más física general "
    "secundaria: cinemática, fuerza, energía, electricidad, óptica). "
    "REGLA DURA: SOLO Física rehegua reñe'ẽ. "
    "Ñeporandu térã ta'anga NDaha'éiramo física (matemática año, historia, "
    "chiste, ambue materia, foto ndaha'éiva física, etc.), erete KÓVA añoite "
    "ha mba'eveichavéramo: "
    "'¡Epa! Che ajapo solo Física rehegua 🙂 Eporandu movimiento circular, "
    "lentes, fuerza, energía térã electricidad rehegua.' "
    "Física-rõ: eñe'ẽ joparaite (guaraní + español oñembojehe'ávo, "
    "ichaite oñeñe'ẽva colegiopé), mbyky (máx 120 ñe'ẽ), peteĩ ejemplo "
    "tekovépe g̃uarã reheve ha fórmula oĩrõ. "
    "Ta'anga oĩrõ: ehecha solo física ohechaukárõ (diagrama, ejercicio, "
    "experimento, gráfica); nahánirirõ, eipuru pe rechazo ñe'ẽ yvategua."
)


def _system_para(idioma: str) -> str:
    return SYSTEM_JOPARA if idioma == "jopara" else SYSTEM_ES


def estado_proveedor() -> dict:
    """Dice qué proveedor IA está activo, sin mostrar la key."""
    key = os.getenv("GEMINI_API_KEY", "")
    if not key:
        return {
            "configurado": False,
            "detalle": "Falta GEMINI_API_KEY. Creá una gratis en "
            "https://aistudio.google.com y ponela en backend/.env",
        }
    return {"configurado": True, "proveedor": "gemini", "modelo": os.getenv("IA_MODEL", "gemini-3.8-flash")}


def preguntar_ia(texto: str, idioma: str = "es", imagen_base64=None, historial=None) -> str:
    """Pregunta a Gemini y devuelve el texto de respuesta."""
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        raise RuntimeError(
            "Falta GEMINI_API_KEY en el servidor. Creá una gratis (sin tarjeta) "
            "en https://aistudio.google.com y ponela en backend/.env"
        )
    modelo = os.getenv("IA_MODEL", "gemini-3.8-flash")

    contents = []
    for m in historial or []:
        contents.append({
            "role": "model" if m.get("rol") != "usuario" else "user",
            "parts": [{"text": m.get("texto", "")[:2000]}],
        })
    partes = [{"text": texto[:2000]}]
    if imagen_base64:
        if imagen_base64.startswith("data:"):
            cab, _, b64 = imagen_base64.partition(",")
            mime = cab.split(";")[0].split(":")[1] if ":" in cab else "image/jpeg"
        else:
            mime, b64 = "image/jpeg", imagen_base64
        partes.append({"inline_data": {"mime_type": mime, "data": b64}})
    contents.append({"role": "user", "parts": partes})

    resp = httpx.post(
        GEMINI_URL_TPL.format(modelo=modelo),
        headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
        json={
            "system_instruction": {"parts": [{"text": _system_para(idioma)}]},
            "contents": contents,
            "generationConfig": {"maxOutputTokens": 600},
        },
        timeout=90.0,
    )
    resp.raise_for_status()
    data = resp.json()
    textos = [
        p.get("text", "")
        for p in data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
        if p.get("text")
    ]
    if not textos:
        raise RuntimeError(f"Respuesta inesperada de Gemini: {str(data)[:300]}")
    return "\n".join(textos).strip()
