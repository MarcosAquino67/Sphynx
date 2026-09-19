import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
MOBILE_DIR = os.path.join(BASE_DIR, "mobile")


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
    abrir_terminal(BACKEND_DIR, "uvicorn main:app --reload")
    abrir_terminal(MOBILE_DIR, "npx expo start")
    print("¡Listo! Se abrieron dos ventanas CMD:")
    print("  1) Backend (http://127.0.0.1:8000)")
    print("  2) App Móvil Expo (QR para escanear con Expo Go)")


if __name__ == "__main__":
    main()