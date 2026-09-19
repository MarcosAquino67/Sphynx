# Sphynx ⚛️ — Física Interactiva en Jopara

> **Aprendé física jugando, en español y guaraní.** Plataforma gamificada Offline-First con simuladores interactivos, mascotas y progresión estilo Duolingo. Hecha con **React Native + Expo** y **Python (FastAPI)** para el hackathon.

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo)](https://docs.expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react)](https://reactnative.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Offline First](https://img.shields.io/badge/Offline-First-4CAF50)]()
[![Jopara](https://img.shields.io/badge/Idioma-Joparaite-FFC93C)]()

---

## 🎮 ¿Qué es Sphynx?

**Sphynx** (también presentada como **Fisik-IA** en los mockups) es una app móvil para estudiantes de 3er curso que convierte los cuadernillos MEC de Física en una experiencia interactiva:

- **Interfaz gamificada** — camino en zig-zag, nodos metálicos, racha diaria y XP por acierto.
- **Bilingüe real (joparaite)** — preguntas, teoría y feedback en español y guaraní, como se habla en el cole.
- **100% offline** — todo el contenido vive en el celular (40 preguntas, teoría, simuladores y mascotas). Ideal para zonas sin internet.
- **Mascotas vivas** — gato científico y robot (GIFs sin fondo convertidos de tus videos `SALUDO.mp4` / `PRESENTACION.mp4`) que saludan con animación `reanimated` al abrir cada pantalla.

### Temas oficiales (cuadernillos MEC)

| Unidad | Tema | Subtema | Lecciones |
|---|---|---|---|
| **1 — Mecánica** | Cinemática | **Movimiento Circular (MCU)** | Período/frecuencia, Vel. angular, Vel. tangencial, Aceleración centrípeta |
| **2 — Óptica** | Luz | **Lentes** | Convergente, Divergente, Elementos, Ecuaciones |

Los demás (Cinemática/Newton, Energía, Electricidad) quedan en **Próximamente** — agregarlos es una línea en `mobile/src/data/unidades.ts`.

---

## ✨ Características principales

- **40 preguntas bilingües** (5 por lección) sacadas de los ejercicios resueltos de `FIS_PC_3` (Lentes) y `FIS_PE_3` (MCU), con explicación en jopara y orden aleatorio en cada intento.
- **Simuladores interactivos** inspirados en *PhET Geometric Optics* (código original):
  - 🔬 **Laboratorio de Lentes** — arrastrá objeto/lente, cambiá `f`, cambiá tipo y mirá los 3 rayos + imagen real/virtual (`1/f = 1/do + 1/di`).
  - 🌀 **Laboratorio Circular** — ajustá `R` y `ω` con *Play/Pausa* y vectores de `v` y `ac` en vivo. 5 desafíos jugables por simulador.
- **Progreso por dispositivo** — lecciones completadas, XP (+10 por acierto), racha diaria y perfil con nombre + foto (galería de mascotas o foto del celu via `expo-image-picker`), todo en `AsyncStorage`.
- **Pantallas completas** — `Splash` con logo + barra que se queda 1s en 67%, `WelcomeOnboarding` (siempre, 2 pasos con los dos GIFs), `BottomBar` fija (Inicio/Progreso/Perfil/Ajustes), `Acordeón` en Teoría, `Creditos` con fuentes y licencias para el hackathon.

---

## 🧱 Stack tecnológico

**Frontend (mobile/)** — Expo SDK 57, React Native 0.86, TypeScript, Expo Router, `react-native-reanimated`, `react-native-svg`, `expo-image`, `expo-image-picker`, `expo-linear-gradient`, `@expo/vector-icons`, `AsyncStorage`, `expo-sqlite` (preparado), `expo-status-bar` (fullscreen).

**Backend (backend/)** — Python 3.11, FastAPI, Pydantic, SQLite, Uvicorn, NumPy/SciPy (listo para cálculos).

**Build** — EAS Build (`eas build -p android --profile preview` → APK). Local con `gradlew` solo si tenés Android SDK; por defecto todo en la nube.

---

## 📁 Estructura del proyecto

```
Sphynx/
├── backend/
│   ├── main.py              # FastAPI: / y /api/preguntas, /api/sincronizar
│   ├── database.py          # SQLite: respuestas + usuarios (streak)
│   ├── models.py            # Pydantic
│   ├── data_preguntas.py    # 40 preguntas espejo del móvil
│   └── requirements.txt
├── mobile/
│   ├── app.json             # Sphynx, icon SPHYNX_png.png, fullscreen, package com.sphynx.app
│   ├── eas.json             # preview → apk
│   ├── src/
│   │   ├── app/             # Expo Router: _layout (Slot+BottomBar), index, subtemas, unidad, teoria, niveles, leccion, experimento, progreso, perfil, ajustes, creditos, bienvenida
│   │   ├── components/      # Button3D, HeaderUnit, BottomBar, LevelNode, MascotContainer, RobotSaludo, SplashScreen, WelcomeOnboarding, SimuladorLentes/MCU, Stepper, AccordionItem
│   │   ├── data/            # unidades.ts, preguntas.ts (40 bilingües)
│   │   ├── storage/         # perfil.ts, progreso.ts, estadisticas.ts, use-user-progress.ts
│   │   └── constants/theme.ts # UI pastel + Sphynx
│   └── assets/
│       ├── mascotas/        # gato-*.png, robot.png (sin fondo) + robot_*.gif (SALUDO/PRESENTACION sin fondo)
│       └── SPHYNX_png.png   # logo
├── iniciar.py               # abre 2 CMD: backend + expo (Windows)
└── README.md
```

---

## 🚀 Instalación y ejecución

### Requisitos
- Node 18+, Python 3.11+, Git
- Expo Go en el celu (misma Wi-Fi que la PC) o un emulador
- Para APK local: Android SDK + JDK 17 (opcional, se recomienda EAS en la nube)

### 1. Clonar
```bash
git clone https://github.com/MarcosAquino67/Sphynx.git
cd Sphynx
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# http://127.0.0.1:8000  →  /docs (Swagger)
```

### 3. Frontend
```bash
cd mobile
npm install
npx expo start -c          # QR para Expo Go
# o
python ../iniciar.py       # Windows: abre backend + expo en 2 CMD
```

- Pantalla completa sin barra de notificaciones (como Duolingo).
- Si el QR no escanea, abrí `http://localhost:8081` en la PC y escaneá desde ahí, o `npx expo start --tunnel`.

### 4. APK (recomendado: EAS, sin instalar nada pesado)
```bash
cd mobile
npm install -g eas-cli
eas login
eas build -p android --profile preview   # 5-10 min, te da link de descarga
# El apk queda en apk/Sphynx.apk si compilás local: ./gradlew assembleDebug
```

> El `apk/` y `android/` están en `.gitignore` a propósito (el APK pesa ~240 MB debug).

---

## 📲 Uso

1. **Carga** (logo + barra que hace pausa en 67%) → **Bienvenida** (robot SALUDO → PRESENTACION, siempre) → **Inicio** (Unidades).
2. **Inicio → Subtemas** (barra de progreso por subtema) → **Menú del nivel** (Aprender / Experimentar / Ejercicios).
3. **Aprender** — teoría en acordeón bilingüe. **Experimentar** — simulador con 5 desafíos (`¡Comprobar!` avanza solo). **Ejercicios** — mapa curvo + quiz con opciones barajadas, feedback `¡Iporã!` / `Ndaha'éi... ¡Probá jey!`.
4. **Perfil** — nombre + foto (mascota o del dispositivo) + XP/aciertos. **Progreso** — racha + lecciones.

---

## 🔌 Modo offline

Todo funciona en **modo avión** una vez instalada la APK. El backend solo se usa si querés sincronizar progreso (`POST /api/sincronizar` con `streak/last_day` + respuestas). Las preguntas viven duplicadas en `mobile/src/data/preguntas.ts` y `backend/data_preguntas.py` para que el móvil no dependa de la red.

---

## 🔬 Simuladores — notas de implementación

- Código **original** inspirado en PhET, no redistribuye nada de PhET.
- Lentes: `finX` con margen, markers en `<Defs>` para no desbordar, `overflow: hidden` + escala reducida para que nada salga del cuadro celeste.
- MCU: `PX_POR_M` reducido y vectores acortados para que el móvil no se escape.
- Stepper compacto para que el `+` no se salga en pantallas chicas; avatar con `contain` para no recortar la cabeza del robot.

---

## 📚 Créditos y referencias (hackathon)

La pantalla **Ajustes → Créditos y referencias** lista todo con enlaces, pero aquí va el resumen:

- **Simuladores:** Inspirados en *PhET Interactive Simulations*, University of Colorado Boulder — https://phet.colorado.edu/en/simulations/geometric-optics (CC BY-NC 4.0, https://phet.colorado.edu/en/licensing)
- **Contenidos:** Cuadernillos MEC «Tu escuela en casa» Física 3er curso (FIS_PC_3, FIS_PE_3) — Prof. Fredy David Gómez Leguizamón y equipo; Bonjorno *Física*; Tippens *Física*.
- **Imágenes/mascotas:** Material del equipo Sphynx (ilustraciones IA + videos propios `SALUDO.mp4`/`PRESENTACION.mp4` convertidos a GIF con `rembg`/`ffmpeg`, fondos removidos por el equipo).
- **Iconos:** `@expo/vector-icons` (MaterialCommunityIcons).

---

## 📄 Licencia

Proyecto educativo para el hackathon. Si reutilizás simuladores inspirados en PhET, recordá la atribución CC BY-NC 4.0.

---

## 👥 Equipo

**Sphynx** — Marcos Aquino y equipo. Física en Jopara, con mucho 💙 y con el robot saludando siempre.

> *¿Ideas?* Agregá Termodinámica como nuevo subtema en `unidades.ts` y 5 preguntas en `preguntas.ts` — el resto (acordeón, mapa, progreso) ya lo maneja solo.
