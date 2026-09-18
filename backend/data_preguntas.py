# data_preguntas.py
# Banco bilingüe (5 preguntas por lección) según cuadernillos MEC 3er curso:
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
        "leccion_id": 101,
        "tema": "Período y frecuencia",
        "pregunta_es": "Un ventilador de techo gira a razón de 240 rpm. ¿Cuál es su período?",
        "pregunta_jopara": "Ventilador ojere 240 rpm. Mboy período?",
        "opciones": ["0.25 s", "4 s", "240 s", "0.04 s"],
        "respuesta_correcta": "0.25 s",
        "explicacion_jopara": "f = 240/60 = 4 Hz; T = 1/4 = 0,25 s."
    },
    {
        "id": 4,
        "leccion_id": 101,
        "tema": "Período y frecuencia",
        "pregunta_es": "La rueda de un parque gira con período de 20 segundos. ¿Cuál es su frecuencia en rpm?",
        "pregunta_jopara": "Rueda T = 20 s. Mboy frecuencia rpm-pe?",
        "opciones": ["3 rpm", "20 rpm", "0.05 rpm", "60 rpm"],
        "respuesta_correcta": "3 rpm",
        "explicacion_jopara": "f = 1/20 = 0,05 Hz = 3 rpm."
    },
    {
        "id": 5,
        "leccion_id": 101,
        "tema": "Período y frecuencia",
        "pregunta_es": "¿A cuántos rpm equivale una frecuencia de 1 Hz?",
        "pregunta_jopara": "Mboy rpm-pe oĩ 1 Hz?",
        "opciones": ["60 rpm", "100 rpm", "6 rpm", "3600 rpm"],
        "respuesta_correcta": "60 rpm",
        "explicacion_jopara": "1 Hz = 1 vuelta 1 s-pe = 60 rpm."
    },
    {
        "id": 6,
        "leccion_id": 102,
        "tema": "Velocidad angular",
        "pregunta_es": "Un móvil gira con velocidad angular media de 10 rad/s. ¿Qué ángulo describe en 5 s?",
        "pregunta_jopara": "Peteĩ mba’e ojere 10 rad/s-pe. Mboy ángulo 5 s-pe?",
        "opciones": ["50 rad", "2 rad", "15 rad", "5 rad"],
        "respuesta_correcta": "50 rad",
        "explicacion_jopara": "θ = ω · t = 10 · 5 = 50 rad."
    },
    {
        "id": 7,
        "leccion_id": 102,
        "tema": "Velocidad angular",
        "pregunta_es": "Una rueda está girando a razón de 4 vueltas por segundo. ¿Cuál es su velocidad angular?",
        "pregunta_jopara": "Peteĩ rueda ojapo 4 vueltas 1 s-pe. Mboy velocidad angular?",
        "opciones": ["25.1 rad/s", "4 rad/s", "8 rad/s", "12.6 rad/s"],
        "respuesta_correcta": "25.1 rad/s",
        "explicacion_jopara": "ω = 2π · f = 2π · 4 ≈ 25,1 rad/s."
    },
    {
        "id": 8,
        "leccion_id": 102,
        "tema": "Velocidad angular",
        "pregunta_es": "Una rueda completa 150 giros por minuto. ¿Cuál es su velocidad angular?",
        "pregunta_jopara": "Rueda 150 rpm. Mboy velocidad angular?",
        "opciones": ["15.7 rad/s", "150 rad/s", "2.5 rad/s", "30 rad/s"],
        "respuesta_correcta": "15.7 rad/s",
        "explicacion_jopara": "ω = 2π · 2,5 ≈ 15,7 rad/s."
    },
    {
        "id": 9,
        "leccion_id": 102,
        "tema": "Velocidad angular",
        "pregunta_es": "Una rueda de 60 cm de radio avanza a 86,4 km/h (24 m/s) sin deslizarse. ¿Con qué velocidad angular gira?",
        "pregunta_jopara": "Rueda R = 0,6 m, v = 24 m/s. Mboy ω?",
        "opciones": ["40 rad/s", "144 rad/s", "24 rad/s", "14.4 rad/s"],
        "respuesta_correcta": "40 rad/s",
        "explicacion_jopara": "ω = v/R = 24/0,6 = 40 rad/s."
    },
    {
        "id": 10,
        "leccion_id": 102,
        "tema": "Velocidad angular",
        "pregunta_es": "Un automóvil recorre una pista circular de 80 m de radio a 72 km/h (20 m/s). ¿Cuál es su velocidad angular?",
        "pregunta_jopara": "Auto R = 80 m, v = 20 m/s. Mboy ω?",
        "opciones": ["0.25 rad/s", "3.6 rad/s", "1.6 rad/s", "20 rad/s"],
        "respuesta_correcta": "0.25 rad/s",
        "explicacion_jopara": "ω = v/R = 20/80 = 0,25 rad/s."
    },
    {
        "id": 11,
        "leccion_id": 103,
        "tema": "Velocidad tangencial",
        "pregunta_es": "Una plataforma gira con velocidad angular de 0,8 rad/s. Una caja está a 4 m del centro. ¿Cuál es su velocidad tangencial?",
        "pregunta_jopara": "Peteĩ caja oĩ 4 m centro-gui, plataforma ω = 0,8 rad/s. Mboy velocidad tangencial?",
        "opciones": ["3.2 m/s", "0.8 m/s", "4.8 m/s", "12.8 m/s"],
        "respuesta_correcta": "3.2 m/s",
        "explicacion_jopara": "v = ω · R = 0,8 · 4 = 3,2 m/s."
    },
    {
        "id": 12,
        "leccion_id": 103,
        "tema": "Velocidad tangencial",
        "pregunta_es": "Una rueda de 2 m de radio gira a 4 vueltas por segundo. ¿Cuál es la velocidad tangencial en el borde?",
        "pregunta_jopara": "Peteĩ rueda R = 2 m ojapo 4 vueltas 1 s-pe. Mboy velocidad borde-pe?",
        "opciones": ["50.2 m/s", "8 m/s", "25.1 m/s", "4 m/s"],
        "respuesta_correcta": "50.2 m/s",
        "explicacion_jopara": "v = 2π · f · R = 2π · 4 · 2 ≈ 50,2 m/s."
    },
    {
        "id": 13,
        "leccion_id": 103,
        "tema": "Velocidad tangencial",
        "pregunta_es": "Un ventilador gira a 240 rpm (4 Hz) y sus paletas miden 1,2 m de radio. ¿Cuál es la velocidad tangencial en el extremo?",
        "pregunta_jopara": "Ventilador 4 Hz, R = 1,2 m. Mboy vt extremo-pe?",
        "opciones": ["30.2 m/s", "4.8 m/s", "288 m/s", "2.9 m/s"],
        "respuesta_correcta": "30.2 m/s",
        "explicacion_jopara": "v = 2π · 4 · 1,2 ≈ 30,2 m/s."
    },
    {
        "id": 14,
        "leccion_id": 103,
        "tema": "Velocidad tangencial",
        "pregunta_es": "Una rueda gira a 150 rpm. ¿Cuál es la velocidad de un punto situado a 12 cm del eje?",
        "pregunta_jopara": "Rueda 150 rpm, punto 12 cm eje-gui. Mboy velocidad?",
        "opciones": ["1.88 m/s", "18 m/s", "0.79 m/s", "22.6 m/s"],
        "respuesta_correcta": "1.88 m/s",
        "explicacion_jopara": "v = ω·R = 15,7·0,12 ≈ 1,88 m/s."
    },
    {
        "id": 15,
        "leccion_id": 103,
        "tema": "Velocidad tangencial",
        "pregunta_es": "¿Cuál es la velocidad tangencial justo en el centro de una rueda que gira?",
        "pregunta_jopara": "Mboy velocidad centro-pe?",
        "opciones": ["0 m/s", "Igual que en el borde", "La mitad que en el borde", "El doble que en el borde"],
        "respuesta_correcta": "0 m/s",
        "explicacion_jopara": "Centro-pe R = 0 → v = ω·0 = 0."
    },
    {
        "id": 16,
        "leccion_id": 104,
        "tema": "Aceleración centrípeta",
        "pregunta_es": "Una rueda de 0,3 m de radio gira con velocidad angular de 220 rad/s. ¿Cuál es el módulo de la aceleración centrípeta?",
        "pregunta_jopara": "Peteĩ rueda R = 0,3 m, ω = 220 rad/s. Mboy aceleración centrípeta?",
        "opciones": ["14520 m/s²", "66 m/s²", "220 m/s²", "660 m/s²"],
        "respuesta_correcta": "14520 m/s²",
        "explicacion_jopara": "ac = ω² · R = 220² · 0,3 = 14520 m/s²."
    },
    {
        "id": 17,
        "leccion_id": 104,
        "tema": "Aceleración centrípeta",
        "pregunta_es": "En el movimiento circular uniforme, ¿hacia dónde apunta la aceleración centrípeta?",
        "pregunta_jopara": "MCU-pe, moõ ohecha aceleración centrípeta?",
        "opciones": ["Hacia el centro", "Hacia afuera", "En dirección del movimiento", "No hay aceleración"],
        "respuesta_correcta": "Hacia el centro",
        "explicacion_jopara": "Ohecha centro-pe: dirección radial, sentido hacia el centro."
    },
    {
        "id": 18,
        "leccion_id": 104,
        "tema": "Aceleración centrípeta",
        "pregunta_es": "En la periferia de un disco de 40 cm de diámetro (R = 0,2 m), la velocidad tangencial es 12 m/s. ¿Cuál es la aceleración radial?",
        "pregunta_jopara": "Disco R = 0,2 m, vt = 12 m/s. Mboy aceleración radial?",
        "opciones": ["720 m/s²", "60 m/s²", "28.8 m/s²", "2880 m/s²"],
        "respuesta_correcta": "720 m/s²",
        "explicacion_jopara": "ac = v²/R = 144/0,2 = 720 m/s²."
    },
    {
        "id": 19,
        "leccion_id": 104,
        "tema": "Aceleración centrípeta",
        "pregunta_es": "¿Cuál es la fórmula de la aceleración centrípeta?",
        "pregunta_jopara": "Mba’e fórmula aceleración centrípeta?",
        "opciones": ["ac = v²/R", "ac = v·R", "ac = ω/R", "ac = v·R²"],
        "respuesta_correcta": "ac = v²/R",
        "explicacion_jopara": "ac = v²/R = ω²·R."
    },
    {
        "id": 20,
        "leccion_id": 104,
        "tema": "Aceleración centrípeta",
        "pregunta_es": "Una rueda gira con período de 20 s y velocidad tangencial de 4,71 m/s. ¿Cuál es el radio de la rueda?",
        "pregunta_jopara": "Rueda T = 20 s, vt = 4,71 m/s. Mboy radio?",
        "opciones": ["15 m", "94.2 m", "0.31 m", "47.1 m"],
        "respuesta_correcta": "15 m",
        "explicacion_jopara": "R = v·T/2π = 94,2/6,28 ≈ 15 m."
    },
    {
        "id": 21,
        "leccion_id": 201,
        "tema": "Lente convergente",
        "pregunta_es": "Un objeto de 4 cm está a 20 cm de una lente convergente de distancia focal 12 cm. ¿Dónde se forma la imagen?",
        "pregunta_jopara": "Objeto 4 cm oĩ 20 cm lente convergente f = 12 cm renondépe. Moõ oiko imagen?",
        "opciones": ["30 cm, real", "12 cm, virtual", "20 cm, real", "8 cm, virtual"],
        "respuesta_correcta": "30 cm, real",
        "explicacion_jopara": "1/f = 1/s + 1/s’ → s’ = 30 cm, imagen real."
    },
    {
        "id": 22,
        "leccion_id": 201,
        "tema": "Lente convergente",
        "pregunta_es": "¿Qué defecto de la visión se corrige con lentes convergentes?",
        "pregunta_jopara": "Mba’e problema de visión o-corregi lente convergente?",
        "opciones": ["Hipermetropía", "Miopía", "Daltonismo", "Cataratas"],
        "respuesta_correcta": "Hipermetropía",
        "explicacion_jopara": "Lente convergente o-corregi hipermetropía (objetos cercanos)."
    },
    {
        "id": 23,
        "leccion_id": 201,
        "tema": "Lente convergente",
        "pregunta_es": "En el caso anterior (objeto 4 cm a 20 cm, f = 12 cm, imagen a 30 cm). ¿Cuál es el tamaño y las características de la imagen?",
        "pregunta_jopara": "Mismo caso. Mboy tamaño ha características imagen?",
        "opciones": [
            "6 cm, real, invertida y mayor",
            "1.3 cm, virtual, derecha y menor",
            "6 cm, virtual, derecha y mayor",
            "2 cm, real, derecha e igual"
        ],
        "respuesta_correcta": "6 cm, real, invertida y mayor",
        "explicacion_jopara": "m = -30/20 = -1,5 → i = 6 cm, real, invertida, mayor."
    },
    {
        "id": 24,
        "leccion_id": 201,
        "tema": "Lente convergente",
        "pregunta_es": "Un cuerpo de 40 cm se sitúa a 1 m de una lente convergente de distancia focal 0,5 m. ¿Dónde se forma la imagen?",
        "pregunta_jopara": "Objeto 40 cm, 1 m lente f = 0,5 m renondépe. Moõ imagen?",
        "opciones": ["1 m", "0.5 m", "2 m", "1.5 m"],
        "respuesta_correcta": "1 m",
        "explicacion_jopara": "1/s’ = 1/0,5 − 1/1 = 1 → s’ = 1 m."
    },
    {
        "id": 25,
        "leccion_id": 201,
        "tema": "Lente convergente",
        "pregunta_es": "En el caso anterior (objeto 40 cm a 1 m, f = 0,5 m, imagen a 1 m). ¿Cuál es el aumento y el tamaño de la imagen?",
        "pregunta_jopara": "Mismo caso. Mboy aumento ha tamaño?",
        "opciones": ["A = −1, i = 0.4 m", "A = 1, i = 0.4 m", "A = −2, i = 0.8 m", "A = −0.5, i = 0.2 m"],
        "respuesta_correcta": "A = −1, i = 0.4 m",
        "explicacion_jopara": "A = -1 → i = 0,4 m: igual tamaño, invertida, real."
    },
    {
        "id": 26,
        "leccion_id": 202,
        "tema": "Lente divergente",
        "pregunta_es": "Un objeto de 10 cm está a 24 cm de una lente divergente de distancia focal 16 cm. ¿Cuál es el aumento?",
        "pregunta_jopara": "Objeto 10 cm, 24 cm lente divergente f = 16 cm renondépe. Mboy aumento?",
        "opciones": ["0.4", "2.5", "1.5", "0.24"],
        "respuesta_correcta": "0.4",
        "explicacion_jopara": "s’ = -9,6 cm; A = 9,6 / 24 = 0,4 (menor, derecha, virtual)."
    },
    {
        "id": 27,
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
        "id": 28,
        "leccion_id": 202,
        "tema": "Lente divergente",
        "pregunta_es": "Un objeto de 4 cm está a 50 cm de una lente divergente de distancia focal 20 cm. ¿Dónde se forma la imagen?",
        "pregunta_jopara": "Objeto 4 cm, 50 cm lente divergente f = 20 cm renondépe. Moõ imagen?",
        "opciones": ["−14.28 cm", "14.28 cm", "−35 cm", "30 cm"],
        "respuesta_correcta": "−14.28 cm",
        "explicacion_jopara": "1/s’ = -1/20 − 1/50 → s’ = -14,28 cm."
    },
    {
        "id": 29,
        "leccion_id": 202,
        "tema": "Lente divergente",
        "pregunta_es": "Un objeto de 8 cm está a 20 cm de una lente divergente de distancia focal 30 cm. ¿Dónde se forma la imagen?",
        "pregunta_jopara": "Objeto 8 cm, 20 cm lente divergente f = 30 cm renondépe. Moõ imagen?",
        "opciones": ["−12 cm", "12 cm", "−50 cm", "10 cm"],
        "respuesta_correcta": "−12 cm",
        "explicacion_jopara": "1/s’ = -1/30 − 1/20 → s’ = -12 cm."
    },
    {
        "id": 30,
        "leccion_id": 202,
        "tema": "Lente divergente",
        "pregunta_es": "En el caso anterior (objeto 8 cm a 20 cm, f = 30 cm, imagen a −12 cm). ¿Cuánto mide la imagen?",
        "pregunta_jopara": "Mismo caso. Mboy tamaño imagen?",
        "opciones": ["4.8 cm", "12 cm", "2.4 cm", "9.6 cm"],
        "respuesta_correcta": "4.8 cm",
        "explicacion_jopara": "m = 12/20 = 0,6 → i = 4,8 cm, menor."
    },
    {
        "id": 31,
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
        "id": 32,
        "leccion_id": 203,
        "tema": "Elementos de la lente",
        "pregunta_es": "Un rayo de luz pasa por el centro óptico de una lente. ¿Qué ocurre?",
        "pregunta_jopara": "Rayo ohasa centro óptico rupi. Mba’e oiko?",
        "opciones": ["Sigue sin desviarse", "Se refleja", "Pasa por el foco", "Se absorbe"],
        "respuesta_correcta": "Sigue sin desviarse",
        "explicacion_jopara": "Centro óptico rupi ohasáva noñemomýi."
    },
    {
        "id": 33,
        "leccion_id": 203,
        "tema": "Elementos de la lente",
        "pregunta_es": "¿Cuál de estas lentes NO es convergente?",
        "pregunta_jopara": "Máva lente ndaha’éi convergente?",
        "opciones": ["Bicóncava", "Biconvexa", "Plano-convexa", "Menisco convergente"],
        "respuesta_correcta": "Bicóncava",
        "explicacion_jopara": "Bicóncava ha’e divergente (delgada centro-pe)."
    },
    {
        "id": 34,
        "leccion_id": 203,
        "tema": "Elementos de la lente",
        "pregunta_es": "¿Cuál de estas lentes es divergente?",
        "pregunta_jopara": "Máva lente ha’e divergente?",
        "opciones": ["Plano-cóncava", "Biconvexa", "Plano-convexa", "Ninguna"],
        "respuesta_correcta": "Plano-cóncava",
        "explicacion_jopara": "Plano-cóncava: delgada centro-pe, omosarambi luz."
    },
    {
        "id": 35,
        "leccion_id": 203,
        "tema": "Elementos de la lente",
        "pregunta_es": "Todo rayo paralelo al eje principal se refracta pasando por…",
        "pregunta_jopara": "Rayo paralelo eje-pe o-refracta ohasávo...",
        "opciones": ["El foco imagen", "El centro óptico", "El objeto", "El infinito"],
        "respuesta_correcta": "El foco imagen",
        "explicacion_jopara": "Regla 1: paralelo → foco imagen rupi."
    },
    {
        "id": 36,
        "leccion_id": 204,
        "tema": "Ecuaciones de lentes",
        "pregunta_es": "Se tiene una lente divergente de 10 cm de distancia focal. Si el objeto está a 15 cm, ¿a qué distancia está la imagen?",
        "pregunta_jopara": "Lente divergente f = 10 cm, objeto 15 cm-pe. Moõ oiko imagen?",
        "opciones": ["6 cm", "25 cm", "5 cm", "10 cm"],
        "respuesta_correcta": "6 cm",
        "explicacion_jopara": "1/s’ = -1/10 − 1/15 = -1/6 → 6 cm, virtual."
    },
    {
        "id": 37,
        "leccion_id": 204,
        "tema": "Ecuaciones de lentes",
        "pregunta_es": "Una lupa se sostiene a 40 mm de un espécimen para producir una imagen derecha del doble de tamaño. ¿Cuál es la distancia focal?",
        "pregunta_jopara": "Lupa 40 mm, imagen derecha doble. Mboy f?",
        "opciones": ["80 mm", "40 mm", "120 mm", "20 mm"],
        "respuesta_correcta": "80 mm",
        "explicacion_jopara": "M = 2 → 1/f = 1/40 − 1/80 → f = 80 mm."
    },
    {
        "id": 38,
        "leccion_id": 204,
        "tema": "Ecuaciones de lentes",
        "pregunta_es": "En la ecuación de lentes, si la lente es divergente la distancia focal imagen f’ es…",
        "pregunta_jopara": "Lente divergente-pe, f’...",
        "opciones": ["Negativa (foco virtual)", "Positiva (foco real)", "Cero", "Infinita"],
        "respuesta_correcta": "Negativa (foco virtual)",
        "explicacion_jopara": "Divergente: F’ virtual ha f’ < 0."
    },
    {
        "id": 39,
        "leccion_id": 204,
        "tema": "Ecuaciones de lentes",
        "pregunta_es": "Con un aumento A = 0,4 y un objeto de 10 cm, ¿cuánto mide la imagen?",
        "pregunta_jopara": "A = 0,4, objeto 10 cm. Mboy imagen?",
        "opciones": ["4 cm", "0.4 cm", "25 cm", "0.04 cm"],
        "respuesta_correcta": "4 cm",
        "explicacion_jopara": "i = A · o = 0,4 · 10 = 4 cm."
    },
    {
        "id": 40,
        "leccion_id": 204,
        "tema": "Ecuaciones de lentes",
        "pregunta_es": "Al resolver la ecuación, la distancia imagen s’ da positiva. ¿Qué indica?",
        "pregunta_jopara": "s’ osẽ positiva. Mba’e he’ise?",
        "opciones": ["Imagen real", "Imagen virtual", "No hay imagen", "Imagen derecha"],
        "respuesta_correcta": "Imagen real",
        "explicacion_jopara": "s’ positiva → imagen real (lado opuesto)."
    }
]