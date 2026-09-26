# ia.py — SPHYNX IA: proxy a un modelo de IA (default: Gemini gratis).
#
# Tres proveedores (se elige solo, en este orden):
#   1) OpenCode Zen: OPENCODE_API_KEY de https://opencode.ai
#      (modelo muse-spark-1.3-contributor-free, Free/Free, pero Zen
#      exige cargar datos de facturación aunque uses modelos free).
#   2) Google Gemini (GRATIS sin tarjeta, recomendado si no tenés tarjeta):
#      - Entrá a https://aistudio.google.com, creá una API key gratis.
#      - Definí GEMINI_API_KEY antes de levantar uvicorn.
#      - Sin tarjeta, con visión (fotos) y ~250 pedidos/día.
#   3) OpenRouter (alternativa): OPENROUTER_API_KEY de
#      https://openrouter.ai/settings/keys, modelo
#      meta/muse-spark-1.3-contributor.
#
# Variables opcionales: IA_PROVIDER=zen|gemini|openrouter|auto (default auto),
# IA_MODEL para forzar otro modelo. La key vive SOLO en el servidor:
# el celular nunca la ve, la app llama a POST /api/ia de este backend.

import os

import httpx

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
# En Zen este modelo se sirve por Responses API (no chat/completions).
ZEN_URL = "https://opencode.ai/zen/v1/responses"
GEMINI_URL_TPL = "https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent"


def _config():
    """Devuelve (proveedor, url, api_key, modelo, headers_extra)."""
    provider = os.getenv("IA_PROVIDER", "auto").lower()
    zen_key = os.getenv("OPENCODE_API_KEY") or os.getenv("ZEN_API_KEY")
    gem_key = os.getenv("GEMINI_API_KEY")
    or_key = os.getenv("OPENROUTER_API_KEY")
    if provider == "auto":
        if zen_key:
            provider = "zen"
        elif gem_key:
            provider = "gemini"
        else:
            provider = "openrouter"
    if provider == "zen":
        if not zen_key:
            raise RuntimeError(
                "Falta OPENCODE_API_KEY en el servidor. "
                "Entrá a https://opencode.ai, iniciá sesión, copiá tu key y "
                "definila como variable de entorno antes de levantar uvicorn."
            )
        modelo = os.getenv("IA_MODEL", "muse-spark-1.3-contributor-free")
        return "zen", ZEN_URL, zen_key, modelo, {}
    if provider == "gemini":
        if not gem_key:
            raise RuntimeError(
                "Falta GEMINI_API_KEY en el servidor. "
                "Creá una gratis (sin tarjeta) en https://aistudio.google.com "
                "y definila como variable de entorno antes de levantar uvicorn."
            )
        modelo = os.getenv("IA_MODEL", "gemini-2.5-flash")
        return "gemini", GEMINI_URL_TPL.format(modelo=modelo), gem_key, modelo, {}
    if not or_key:
        raise RuntimeError(
            "Falta OPENROUTER_API_KEY en el servidor. "
            "Conseguí una gratis en https://openrouter.ai/settings/keys "
            "y definila como variable de entorno antes de levantar uvicorn."
        )
    modelo = os.getenv("IA_MODEL", "meta/muse-spark-1.3-contributor")
    return "openrouter", OPENROUTER_URL, or_key, modelo, {
        "HTTP-Referer": "https://github.com/MarcosAquino67/Sphynx",
        "X-Title": "Sphynx IA",
    }

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


def _data_url(imagen_base64) -> str:
    if imagen_base64.startswith("data:"):
        return imagen_base64
    return f"data:image/jpeg;base64,{imagen_base64}"


def _llamar_openrouter(url, api_key, modelo, headers_extra, sistema, texto, imagen_base64, historial) -> str:
    mensajes = [{"role": "system", "content": sistema}]
    for m in historial or []:
        mensajes.append(
            {"role": "user" if m.get("rol") == "usuario" else "assistant", "content": m.get("texto", "")[:2000]}
        )
    contenido = [{"type": "text", "text": texto[:2000]}]
    if imagen_base64:
        contenido.append({"type": "image_url", "image_url": {"url": _data_url(imagen_base64)}})
    mensajes.append({"role": "user", "content": contenido})

    resp = httpx.post(
        url,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            **headers_extra,
        },
        json={"model": modelo, "messages": mensajes, "max_tokens": 500, "temperature": 0.7},
        timeout=90.0,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"].strip()


def _llamar_zen(url, api_key, modelo, sistema, texto, imagen_base64, historial) -> str:
    """Zen sirve este modelo por Responses API (input/output, no messages)."""
    entrada = [{"role": "system", "content": sistema}]
    for m in historial or []:
        entrada.append({
            "role": "user" if m.get("rol") == "usuario" else "assistant",
            "content": m.get("texto", "")[:2000],
        })
    partes = [{"type": "input_text", "text": texto[:2000]}]
    if imagen_base64:
        partes.append({"type": "input_image", "image_url": _data_url(imagen_base64)})
    entrada.append({"role": "user", "content": partes})

    resp = httpx.post(
        url,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={"model": modelo, "input": entrada, "max_output_tokens": 600},
        timeout=90.0,
    )
    resp.raise_for_status()
    data = resp.json()
    textos = []
    for item in data.get("output", []):
        if item.get("type") == "message":
            for c in item.get("content", []):
                if c.get("type") == "output_text":
                    textos.append(c.get("text", ""))
    if not textos:
        raise RuntimeError(f"Respuesta inesperada de Zen: {str(data)[:300]}")
    return "\n".join(textos).strip()


def _split_data_url(imagen_base64):
    """Devuelve (mime, base64_puro) desde un data URL o base64 pelado."""
    if imagen_base64.startswith("data:"):
        cab, _, b64 = imagen_base64.partition(",")
        mime = cab.split(";")[0].split(":")[1] if ":" in cab else "image/jpeg"
        return mime, b64
    return "image/jpeg", imagen_base64


def _llamar_gemini(url, api_key, sistema, texto, imagen_base64, historial) -> str:
    """Gemini generateContent: system_instruction + contents user/model, con visión."""
    contents = []
    for m in historial or []:
        contents.append({
            "role": "model" if m.get("rol") != "usuario" else "user",
            "parts": [{"text": m.get("texto", "")[:2000]}],
        })
    partes = [{"text": texto[:2000]}]
    if imagen_base64:
        mime, b64 = _split_data_url(imagen_base64)
        partes.append({"inline_data": {"mime_type": mime, "data": b64}})
    contents.append({"role": "user", "parts": partes})

    resp = httpx.post(
        url,
        headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
        json={
            "system_instruction": {"parts": [{"text": sistema}]},
            "contents": contents,
            "generationConfig": {"maxOutputTokens": 600, "temperature": 0.7},
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


def estado_proveedor() -> dict:
    """Dice qué proveedor IA está activo, sin mostrar la key."""
    try:
        proveedor, _, _, modelo, _ = _config()
        return {"configurado": True, "proveedor": proveedor, "modelo": modelo}
    except RuntimeError as e:
        return {"configurado": False, "detalle": str(e)}


def preguntar_ia(texto: str, idioma: str = "es", imagen_base64=None, historial=None) -> str:
    """Llama al proveedor configurado y devuelve el texto de respuesta."""
    proveedor, url, api_key, modelo, headers_extra = _config()
    sistema = _system_para(idioma)
    if proveedor == "zen":
        return _llamar_zen(url, api_key, modelo, sistema, texto, imagen_base64, historial)
    if proveedor == "gemini":
        return _llamar_gemini(url, api_key, sistema, texto, imagen_base64, historial)
    return _llamar_openrouter(url, api_key, modelo, headers_extra, sistema, texto, imagen_base64, historial)
