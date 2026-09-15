# models.py
from pydantic import BaseModel
from typing import List


class RespuestaUsuario(BaseModel):
    usuario_id: str
    pregunta_id: int
    respuesta_seleccionada: str
    es_correcta: bool
    fecha_respuesta: str


class SincronizacionPayload(BaseModel):
    usuario_id: str
    hearts: int
    streak: int
    last_day: str
    respuestas_offline: List[RespuestaUsuario]