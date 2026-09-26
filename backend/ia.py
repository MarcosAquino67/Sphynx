# ia.py — SPHYNX IA: proxy a Muse Spark 1.3 vía OpenRouter.
#
# La API key vive SOLO en el servidor (variable de entorno OPENROUTER_API_KEY).
# El celular nunca la ve: la app llama a POST /api/ia de este backend.
#
# Modelo configurable con MUSE_SPARK_MODEL (default: tier contributor barato).
# Si existe variante :free del modelo, se puede usar esa sin costo:
#   MUSE_SPARK_MODEL=meta/muse-spark-1.3-contributor:free
#
# Conseguí la key gratis en: https://openrouter.ai/settings/keys

import os

import httpx

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = os.getenv("MUSE_SPARK_MODEL", "meta/muse-spark-1.3-contributor")

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


def preguntar_ia(texto: str, idioma: str = "es", imagen_base64=None, historial=None) -> str:
    """Llama a Muse Spark vía OpenRouter y devuelve el texto de respuesta."""
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    if not api_key:
        raise RuntimeError(
            "Falta OPENROUTER_API_KEY en el servidor. "
            "Conseguí una gratis en https://openrouter.ai/settings/keys "
            "y definila como variable de entorno antes de levantar uvicorn."
        )

    mensajes = [{"role": "system", "content": _system_para(idioma)}]
    for m in historial or []:
        mensajes.append(
            {"role": "user" if m.get("rol") == "usuario" else "assistant", "content": m.get("texto", "")[:2000]}
        )

    contenido = [{"type": "text", "text": texto[:2000]}]
    if imagen_base64:
        img = imagen_base64 if imagen_base64.startswith("data:") else f"data:image/jpeg;base64,{imagen_base64}"
        contenido.append({"type": "image_url", "image_url": {"url": img}})

    mensajes.append({"role": "user", "content": contenido})

    resp = httpx.post(
        OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/MarcosAquino67/Sphynx",
            "X-Title": "Sphynx IA",
        },
        json={"model": MODEL, "messages": mensajes, "max_tokens": 500, "temperature": 0.7},
        timeout=60.0,
    )
    resp.raise_for_status()
    data = resp.json()
    return data["choices"][0]["message"]["content"].strip()
