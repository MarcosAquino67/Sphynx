# data_preguntas.py
# Banco bilingüe según cuadernillos MEC 3er curso:
# - Lecciones 101-104: Movimiento Circular (FIS_PE_3_E_03may07)
# - Lecciones 201-204: Lentes (FIS_PC_3_E_31may04jun)

PREGUNTAS_FISICA = [
    {
        "id": 1,
        "leccion_id": 101,
        "tema": "Período y frecuencia",
        "pregunta_es": "Un cuerpo efectúa 300 vueltas sobre una circunferencia en 2,5 min. ¿Cuál es el período del movimiento?",
        "pregunta_jopara": "Peteĩ mba’e ojapo 300 vueltas 2,5 min-pe. Mboy período?",
        "opciones": ["0.5 s", "2 s", "150 s", "0.2 s"],
        "respuesta_correcta": "0.5 s",
        "explicacion_jopara": "T = tiempo / vueltas = 150 s / 300 = 0,5 s."
    },
    {
        "id": 2,
        "leccion_id": 101,
        "tema": "Período y frecuencia",
        "pregunta_es": "Una rueda completa 150 giros por minuto. ¿Cuál es su frecuencia?",
        "pregunta_jopara": "Peteĩ rueda ojapo 150 giros 1 min-pe. Mboy frecuencia?",
        "opciones": ["2.5 Hz", "150 Hz", "0.4 Hz", "15 Hz"],
        "respuesta_correcta": "2.5 Hz",
        "explicacion_jopara": "f = giros / tiempo = 150 / 60 = 2,5 Hz."
    },
    {
        "id": 3,
        "leccion_id": 102,
        "tema": "Velocidad angular",
        "pregunta_es": "Un móvil gira con velocidad angular media de 10 rad/s. ¿Qué ángulo describe en 5 s?",
        "pregunta_jopara": "Peteĩ mba’e ohyvy 10 rad/s-pe. Mboy ángulo 5 s-pe?",
        "opciones": ["50 rad", "2 rad", "15 rad", "5 rad"],
        "respuesta_correcta": "50 rad",
        "explicacion_jopara": "θ = ω · t = 10 · 5 = 50 rad."
    },
    {
        "id": 4,
        "leccion_id": 102,
        "tema": "Velocidad angular",
        "pregunta_es": "Una rueda está girando a razón de 4 vueltas por segundo. ¿Cuál es su velocidad angular?",
        "pregunta_jopara": "Peteĩ rueda ojapo 4 vueltas 1 s-pe. Mboy velocidad angular?",
        "opciones": ["25.1 rad/s", "4 rad/s", "8 rad/s", "12.6 rad/s"],
        "respuesta_correcta": "25.1 rad/s",
        "explicacion_jopara": "ω = 2π · f = 2π · 4 ≈ 25,1 rad/s."
    },
    {
        "id": 5,
        "leccion_id": 103,
        "tema": "Velocidad tangencial",
        "pregunta_es": "Una plataforma gira con velocidad angular de 0,8 rad/s. Una caja está a 4 m del centro. ¿Cuál es su velocidad tangencial?",
        "pregunta_jopara": "Peteĩ caja oĩ 4 m centro-gui, plataforma ω = 0,8 rad/s. Mboy velocidad tangencial?",
        "opciones": ["3.2 m/s", "0.8 m/s", "4.8 m/s", "12.8 m/s"],
        "respuesta_correcta": "3.2 m/s",
        "explicacion_jopara": "v = ω · R = 0,8 · 4 = 3,2 m/s."
    },
    {
        "id": 6,
        "leccion_id": 103,
        "tema": "Velocidad tangencial",
        "pregunta_es": "Una rueda de 2 m de radio gira a 4 vueltas por segundo. ¿Cuál es la velocidad tangencial en el borde?",
        "pregunta_jopara": "Peteĩ rueda R = 2 m ojapo 4 vueltas 1 s-pe. Mboy velocidad borde-pe?",
        "opciones": ["50.2 m/s", "8 m/s", "25.1 m/s", "4 m/s"],
        "respuesta_correcta": "50.2 m/s",
        "explicacion_jopara": "v = 2π · f · R = 2π · 4 · 2 ≈ 50,2 m/s."
    },
    {
        "id": 7,
        "leccion_id": 104,
        "tema": "Aceleración centrípeta",
        "pregunta_es": "Una rueda de 0,3 m de radio gira con velocidad angular de 220 rad/s. ¿Cuál es el módulo de la aceleración centrípeta?",
        "pregunta_jopara": "Peteĩ rueda R = 0,3 m, ω = 220 rad/s. Mboy aceleración centrípeta?",
        "opciones": ["14520 m/s²", "66 m/s²", "220 m/s²", "660 m/s²"],
        "respuesta_correcta": "14520 m/s²",
        "explicacion_jopara": "ac = ω² · R = 220² · 0,3 = 14520 m/s²."
    },
    {
        "id": 8,
        "leccion_id": 104,
        "tema": "Aceleración centrípeta",
        "pregunta_es": "En el movimiento circular uniforme, ¿hacia dónde apunta la aceleración centrípeta?",
        "pregunta_jopara": "MCU-pe, moõ ohecha aceleración centrípeta?",
        "opciones": ["Hacia el centro", "Hacia afuera", "En dirección del movimiento", "No hay aceleración"],
        "respuesta_correcta": "Hacia el centro",
        "explicacion_jopara": "Ohecha centro-pe: dirección radial, sentido hacia el centro."
    },
    {
        "id": 9,
        "leccion_id": 201,
        "tema": "Lente convergente",
        "pregunta_es": "Un objeto de 4 cm está a 20 cm de una lente convergente de distancia focal 12 cm. ¿Dónde se forma la imagen?",
        "pregunta_jopara": "Objeto 4 cm oĩ 20 cm lente convergente f = 12 cm renondépe. Moõ oiko imagen?",
        "opciones": ["30 cm, real", "12 cm, virtual", "20 cm, real", "8 cm, virtual"],
        "respuesta_correcta": "30 cm, real",
        "explicacion_jopara": "1/f = 1/s + 1/s’ → s’ = 30 cm, imagen real."
    },
    {
        "id": 10,
        "leccion_id": 201,
        "tema": "Lente convergente",
        "pregunta_es": "¿Qué defecto de la visión se corrige con lentes convergentes?",
        "pregunta_jopara": "Mba’e problema de visión o-corregi lente convergente?",
        "opciones": ["Hipermetropía", "Miopía", "Daltonismo", "Cataratas"],
        "respuesta_correcta": "Hipermetropía",
        "explicacion_jopara": "Lente convergente o-corregi hipermetropía (objetos cercanos)."
    },
    {
        "id": 11,
        "leccion_id": 202,
        "tema": "Lente divergente",
        "pregunta_es": "Un objeto de 10 cm está a 24 cm de una lente divergente de distancia focal 16 cm. ¿Cuál es el aumento?",
        "pregunta_jopara": "Objeto 10 cm, 24 cm lente divergente f = 16 cm renondépe. Mboy aumento?",
        "opciones": ["0.4", "2.5", "1.5", "0.24"],
        "respuesta_correcta": "0.4",
        "explicacion_jopara": "s’ = -9,6 cm; A = 9,6 / 24 = 0,4 (menor, derecha, virtual)."
    },
    {
        "id": 12,
        "leccion_id": 202,
        "tema": "Lente divergente",
        "pregunta_es": "¿Cómo es la imagen formada por una lente divergente?",
        "pregunta_jopara": "Mba’eichagua imagen ojapo lente divergente?",
        "opciones": [
            "Virtual, derecha y menor",
            "Real, invertida y mayor",
            "Real, derecha e igual",
            "Virtual, invertida y mayor"
        ],
        "respuesta_correcta": "Virtual, derecha y menor",
        "explicacion_jopara": "Divergente: imagen virtual, derecha ha menor objeto-gui."
    },
    {
        "id": 13,
        "leccion_id": 203,
        "tema": "Elementos de la lente",
        "pregunta_es": "¿Qué es la distancia focal de una lente?",
        "pregunta_jopara": "Mba’e ha’e distancia focal peteĩ lente-pe?",
        "opciones": [
            "Distancia entre el foco y el centro óptico",
            "Distancia entre el objeto y la imagen",
            "Grosor de la lente",
            "Diámetro de la lente"
        ],
        "respuesta_correcta": "Distancia entre el foco y el centro óptico",
        "explicacion_jopara": "f ha’e distancia foco (F) ha centro óptico (O) mbytépe."
    },
    {
        "id": 14,
        "leccion_id": 204,
        "tema": "Ecuaciones de lentes",
        "pregunta_es": "Se tiene una lente divergente de 10 cm de distancia focal. Si el objeto está a 15 cm, ¿a qué distancia está la imagen?",
        "pregunta_jopara": "Lente divergente f = 10 cm, objeto 15 cm-pe. Moõ oiko imagen?",
        "opciones": ["6 cm", "25 cm", "5 cm", "10 cm"],
        "respuesta_correcta": "6 cm",
        "explicacion_jopara": "1/s’ = -1/10 - 1/15 = -1/6 → 6 cm, virtual."
    }
]