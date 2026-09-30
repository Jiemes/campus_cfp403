# Campus Virtual CFP N° 403 Mercedes - Plataforma de Programación

Plataforma web interactiva e inmersiva desarrollada para los cursos de programación del **Centro de Formación Profesional N° 403 de Mercedes (Provincia de Buenos Aires)**.

---

## 🚀 Arquitectura y Filosofía de Diseño

La plataforma fue diseñada bajo el principio de **desacoplamiento total entre interfaz y contenidos**:
1. **Frontend Desacoplado**: [index.html](file:///c:/ProyectosPython/campus_cfp403/index.html) y [css/styles.css](file:///c:/ProyectosPython/campus_cfp403/css/styles.css) constituyen una plantilla visual fija y reutilizable.
2. **Inyección Reactiva**: [js/main.js](file:///c:/ProyectosPython/campus_cfp403/js/main.js) lee asíncronamente archivos JSON y puebla dinámicamente las 4 pestañas de trabajo sin recargar la página.
3. **Persistencia Local**: El progreso del alumno (clases completadas y última clase visitada) se conserva automáticamente en `localStorage`.
4. **Laboratorio Integrado**: Incluye un editor con números de línea, indentación de 4 espacios (PEP 8), shortcuts (`Ctrl + Enter`) y ejecución en vivo de Python con Pyodide (WebAssembly en el navegador) y emulador pedagógico de respaldo.

---

## 📁 Estructura del Proyecto

```text
campus_cfp403/
├── index.html                  # Plantilla maestra fija con Sidebar y 4 Pestañas
├── README.md                   # Documentación técnica y guía de expansión
├── css/
│   └── styles.css              # Sistema de diseño (Azul Cian, Negro Grafito, Gris Acero)
├── js/
│   └── main.js                 # Controlador de la plataforma, routing y sandbox
└── data/
    ├── classes-index.json      # Manifiesto de las 37 clases en 6 módulos temáticos
    ├── clase_13.json           # Clase 13: Paradigma POO en Python
    └── clase_22.json           # Clase 22: Persistencia y SQLite3 con Python
```

---

## 🛠️ Cómo Inyectar Nuevas Clases (De la 1 a la 37)

Para sumar el contenido de cualquiera de las clases restantes, **no es necesario tocar ningún archivo HTML ni CSS**. Solo se requiere crear el archivo JSON respectivo en la carpeta `data/`:

### 1. Convención de Nombres
El archivo debe llamarse `clase_XX.json` con el número formateado a dos dígitos:
- Clase 1: `data/clase_01.json`
- Clase 7: `data/clase_07.json`
- Clase 31: `data/clase_31.json`

### 2. Esquema JSON Estándar

```json
{
  "id": 13,
  "numero": 13,
  "moduloId": 3,
  "moduloNombre": "Módulo 3: Programación Orientada a Objetos (POO)",
  "titulo": "Título formal de la clase",
  "descripcionCorta": "Resumen conceptual de 1 o 2 oraciones.",
  "duracionEstimada": "3 Horas de cátedra",
  "dificultad": "Inicial | Intermedio | Avanzado",
  
  "briefing": {
    "introduccion": "Texto introductorio extenso. Soporta **negrita**, *cursiva* y `código`.",
    "secciones": [
      {
        "id": "sec-1",
        "titulo": "1. Nombre del Subtema",
        "contenido": "Explicación detallada y sin resumir del contenido teórico.",
        "codigo": "# Ejemplo de código Python para esta sección\nprint('Hola')",
        "callout": {
          "tipo": "tip",
          "titulo": "Consejo Profesional",
          "texto": "Explicación de buenas prácticas o sintaxis PEP 8."
        }
      }
    ],
    "conclusiones": [
      "Conclusión 1 de la sesión.",
      "Conclusión 2 de la sesión."
    ]
  },

  "sandbox": {
    "lenguaje": "python",
    "archivoNombre": "practica_clase_13.py",
    "codigoInicial": "# Código editable inicial que verá el estudiante",
    "salidaEsperada": "Salida en terminal que genera el código"
  },

  "mision": {
    "titulo": "Desafío del Mundo Real",
    "nivel": "Intermedio",
    "puntosXP": 150,
    "contexto": "Planteo del problema aplicado a Mercedes o la industria.",
    "requerimientos": [
      "Criterio de aceptación 1",
      "Criterio de aceptación 2"
    ],
    "pistas": [
      "Pista 1 para orientar la resolución."
    ],
    "codigoPlantilla": "# Plantilla que se puede inyectar al editor con un clic"
  },

  "recursos": {
    "video": {
      "tipo": "youtube",
      "url": "https://www.youtube.com/embed/VIDEO_ID",
      "titulo": "Grabación de la clase",
      "duracion": "45 min"
    },
    "descargas": [
      {
        "nombre": "Apunte_Oficial.pdf",
        "descripcion": "Manual de la sesión",
        "tamano": "2.5 MB",
        "tipo": "pdf",
        "url": "recursos/apunte.pdf"
      }
    ],
    "enlaces": [
      {
        "titulo": "Documentación Oficial",
        "url": "https://docs.python.org"
      }
    ]
  }
}
```

---

## 🎨 Paleta Institucional Implementada

* **Azul Cian / Turquesa Primario**: `#00e5ff` (acento brillante) y `#00b4d8` (marca institucional).
* **Negro Grafito Profundo**: `#07090d` (fondo de pantalla) y `#0d1117` (fondo de paneles).
* **Gris Acero**: `#1c2431` y `#243042` (tarjetas, editores y divisores de código).
* **Verde Éxito**: `#10b981` (clases completadas y checkmarks superados).
