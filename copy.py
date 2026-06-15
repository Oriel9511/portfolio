import os
import sys
import argparse
import time
from concurrent.futures import ThreadPoolExecutor

# ---------- Configuración de Exclusiones ----------

# Usamos 'set' para búsqueda O(1) (igual que HashSet en PowerShell)
EXCLUDED_DIRS = {
    # Ocultas / VCS / IDE
    ".git", ".svn", ".hg", ".idea", ".vscode", ".history",
    # Builds / artefactos
    "build", "dist", "out", "target", "coverage", "cov", ".next", ".nuxt", ".angular", "public",
    "bin", "obj", "Debug", "Release",
    # Dependencias comunes
    "node_modules", "vendor", "__pycache__", ".yarn", ".pnpm-store", ".parcel-cache",
    # Entornos/SDK caches
    "env", ".env", "venv", ".venv", ".tox", ".pytest_cache", ".mypy_cache",
    ".gradle", ".m2", ".bundle", ".terraform", ".dart_tool", ".cargo", "Pods", "Carthage"
}

# Normalizamos a minúsculas para comparación insensible a mayúsculas
EXCLUDED_EXTS = {
    # Compilados/binaries
    "exe", "dll", "pdb", "o", "obj", "so", "dylib", "a", "lib", "lo", "la", "ps1", "sh",
    # Bytecode/VM
    "class", "jar", "war", "ear", "beam", "pyc", "pyo", "elc", "cbc",
    # Otros artefactos
    "out", "swp", "swo", "tmp", "dsym", "ipa", "apk", "aar",
    # Paquetes/archivos no-código
    "zip", "tar", "gz", "tgz", "bz2", "xz", "7z", "rar",
    # Imágenes/medios
    "png", "jpg", "jpeg", "gif", "webp", "svg", "ico", "mp3", "mp4", "mov", "wav", "ogg",
    # PDFs/Docs
    "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"
}

def get_file_content(filepath, root_path):
    """
    Lee un archivo y devuelve su contenido formateado en Markdown.
    """
    try:
        # Intentamos leer como UTF-8
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        # Calcular ruta relativa para el encabezado
        relative_path = os.path.relpath(filepath, root_path)

        return f"### 📄 Archivo: `{relative_path}`\n```\n{content}\n```\n"
    except Exception as e:
        print(f"⚠️  Advertencia: No se pudo leer '{filepath}': {e}", file=sys.stderr)
        return ""

def main():
    parser = argparse.ArgumentParser(description="Genera un Markdown con el código fuente del directorio.")
    parser.add_argument("BaseName", help="El nombre base para el archivo de salida.")
    args = parser.parse_args()

    output_file = f"{args.BaseName}.md"
    root_dir = os.getcwd()

    start_time = time.time()
    print(f"🔍 Escaneando archivos en '{root_dir}'...")

    files_to_process = []

    # 1. Escaneo recursivo (os.walk)
    for root, dirs, files in os.walk(root_dir):
        # Modificar 'dirs' in-place para que os.walk no entre en carpetas excluidas
        # Esto es equivalente a la lógica de exclusión de carpetas del script original
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS and not d.startswith('.')]

        for file in files:
            ext = file.split('.')[-1].lower() if '.' in file else ""

            # Filtro de extensiones y archivos ocultos
            if ext in EXCLUDED_EXTS or file.startswith('.'):
                continue

            full_path = os.path.join(root, file)
            files_to_process.append(full_path)

    print(f"✅ Se encontraron {len(files_to_process)} archivos para procesar.")
    print("🚀 Procesando archivos en paralelo...")

    markdown_results = []

    # 2. Procesamiento en paralelo (ThreadPoolExecutor)
    # Equivalente a ForEach-Object -Parallel
    # max_workers=None usa automáticamente el número de procesadores * 5 por defecto
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(get_file_content, f, root_dir) for f in files_to_process]

        for future in futures:
            result = future.result()
            if result:
                markdown_results.append(result)

    # 3. Escribir salida
    print(f"💾 Escribiendo el archivo de salida: '{output_file}'...")
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("\n".join(markdown_results))

        elapsed = time.time() - start_time
        print(f"✅ Proceso completado en {elapsed:.2f} segundos. Markdown generado: '{output_file}'")
    except Exception as e:
        print(f"❌ Error al escribir el archivo: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()