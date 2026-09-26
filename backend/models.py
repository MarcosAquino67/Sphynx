# models.py
from pydantic import BaseModel
from typing import List, Optional


class RespuestaUsuario(BaseModel):
    usuario_id: str
    pregunta_id: int
    respuesta_seleccionada: str
    es_correcta: bool
    fecha_respuesta: str


class SincronizacionPayload(BaseModel):
    usuario_id: str
    streak: int
    last_day: str
    respuestas_offline: List[RespuestaUsuario]


class IAMensaje(BaseModel):
    rol: str  # 'usuario' | 'ia'
    texto: str


class IAPregunta(BaseModel):
    texto: str
    idioma: str = "es"  # 'es' | 'jopara'
    imagen_base64: Optional[str] = None  # data URL o base64 puro (jpeg/png)
    historial: List[IAMensaje] = []