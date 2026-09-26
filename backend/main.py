# main.py
from fastapi import FastAPI, HTTPException
from typing import Optional

from data_preguntas import PREGUNTAS_FISICA
from database import inicializar_bd, get_connection
from ia import estado_proveedor, preguntar_ia
from models import IAPregunta, SincronizacionPayload

app = FastAPI(
    title="Sphynx API - Física en Jopara",
    description="Backend para la app móvil de física bilingüe y sincronización offline",
    version="1.0.0"
)


@app.on_event("startup")
def arranque():
    inicializar_bd()


@app.get("/")
def inicio():
    return {"mensaje": "API Sphynx corriendo correctamente", "estado": "online"}


@app.get("/api/preguntas", summary="Obtener banco de preguntas")
def obtener_preguntas(idioma: Optional[str] = "jopara"):
    """
    Retorna el listado completo de preguntas para que la app las guarde en su SQLite local.
    """
    return {"total": len(PREGUNTAS_FISICA), "preguntas": PREGUNTAS_FISICA}


@app.post("/api/sincronizar", summary="Sincronizar progreso guardado offline")
def sincronizar_progreso(payload: SincronizacionPayload):
    """
    Recibe la ráfaga de respuestas que el usuario guardó localmente en el celular sin internet.
    """
    cantidad = len(payload.respuestas_offline)
    try:
        with get_connection() as conn:
            conn.executemany(
                """
                INSERT INTO respuestas
                    (usuario_id, pregunta_id, respuesta_seleccionada, es_correcta, fecha_respuesta)
                VALUES (?, ?, ?, ?, ?)
                """,
                [
                    (
                        r.usuario_id,
                        r.pregunta_id,
                        r.respuesta_seleccionada,
                        1 if r.es_correcta else 0,
                        r.fecha_respuesta,
                    )
                    for r in payload.respuestas_offline
                ],
            )
            conn.execute(
                """
                INSERT INTO usuarios (usuario_id, streak, last_day)
                VALUES (?, ?, ?)
                ON CONFLICT(usuario_id) DO UPDATE SET
                    streak = excluded.streak,
                    last_day = excluded.last_day
                """,
                (payload.usuario_id, payload.streak, payload.last_day),
            )
            conn.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar en la base de datos: {e}")

    return {
        "status": "exito",
        "mensaje": f"Se sincronizaron {cantidad} respuestas del usuario {payload.usuario_id}",
        "registros_procesados": cantidad
    }


@app.get("/api/ia/estado", summary="Ver proveedor IA activo (sin mostrar la key)")
def estado_sphynx_ia():
    """Para diagnosticar: dice si hay key y qué proveedor/modelo se usa."""
    return estado_proveedor()


@app.post("/api/ia", summary="Preguntar a SPHYNX IA (Muse Spark, solo física)")
def preguntar_sphynx_ia(payload: IAPregunta):
    """
    Proxy a Muse Spark 1.3 vía OpenRouter. La API key vive en el servidor.
    Solo responde física (ES/Jopara según payload.idioma); acepta imagen opcional.
    """
    if not payload.texto.strip() and not payload.imagen_base64:
        raise HTTPException(status_code=400, detail="Mandá una pregunta o una imagen.")
    idioma = payload.idioma if payload.idioma in ("es", "jopara") else "es"
    try:
        respuesta = preguntar_ia(
            texto=payload.texto.strip() or "¿Qué se ve en esta imagen? ¿Es de física?",
            idioma=idioma,
            imagen_base64=payload.imagen_base64,
            historial=[m.model_dump() for m in payload.historial[-8:]],
        )
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"La IA no respondió, probá de nuevo: {e}")
    return {"status": "exito", "respuesta": respuesta, "idioma": idioma}