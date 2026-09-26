import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
MOBILE_DIR = os.path.join(BASE_DIR, "mobile")

# Variables que el backend de SPHYNX IA puede usar (ver backend/ia.py)
CLAVES_IA = (
    "GEMINI_API_KEY",
    "OPENCODE_API_KEY",
    "ZEN_API_KEY",
    "OPENROUTER_API_KEY",
    "IA_PROVIDER",
    "IA_MODEL",
)


def leer_env_archivo():
    """Lee backend/.env (KEY=VALOR por línea). No se sube a git."""
    vals = {}
    ruta = os.path.join(BACKEND_DIR, ".env")
    if os.path.isfile(ruta):
        with open(ruta, encoding="utf-8") as f:
            for linea in f:
                linea = linea.strip()
                if not linea or linea.startswith("#") or "=" not in linea:
                    continue
                k, _, v = linea.partition("=")
                k, v = k.strip(), v.strip().strip('"').strip("'")
                if k and v:
                    vals[k] = v
    return vals


def abrir_terminal(directorio, comando):
    if not sys.platform.startswith("win"):
        print("Este script está pensado para ejecutarse en Windows.")
        sys.exit(1)

    subprocess.Popen(
        ["cmd", "/k", comando],
        cwd=directorio,
        creationflags=subprocess.CREATE_NEW_CONSOLE,
    )


def main():
    archivo = leer_env_archivo()
    sets = []
    for k in CLAVES_IA:
        v = os.environ.get(k) or archivo.get(k)
        if v:
            sets.append(f"set {k}={v}")

    backend_cmd = " && ".join(sets + ["uvicorn main:app --reload --host 0.0.0.0 --port 8000"])
    abrir_terminal(BACKEND_DIR, backend_cmd)
    abrir_terminal(MOBILE_DIR, "npx expo start -c")

    print("¡Listo! Se abrieron dos ventanas CMD:")
    print("  1) Backend + SPHYNX IA (http://127.0.0.1:8000, visible en tu Wi-Fi)")
    print("  2) App Móvil Expo (QR para escanear con Expo Go)")
    if not any(os.environ.get(k) or archivo.get(k) for k in CLAVES_IA[:4]):
        print("")
        print("AVISO: no hay API key -> SPHYNX IA no va a responder.")
        print("  Crea backend/.env con GEMINI_API_KEY=tu_key")
        print("  (gratis sin tarjeta en https://aistudio.google.com)")


if __name__ == "__main__":
    main()
