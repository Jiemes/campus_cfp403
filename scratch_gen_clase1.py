import json
import os

os.makedirs('c:/ProyectosPython/campus_cfp403/data/clases', exist_ok=True)

contenido_teorico = """<div class="theory-container">
  <header class="theory-header">
    <div class="badge badge-module">Clase 1 • Fundamentos Profesionales</div>
    <h2 class="theory-main-title">Introducción al Mundo de la Programación Profesional</h2>
  </header>

  <div class="briefing-intro-card">
    <p>Bienvenido/a a una de las disciplinas más desafiantes y gratificantes de la era moderna. Programar no es simplemente escribir código; es resolver problemas complejos mediante la lógica y la creatividad. En este curso, te formarás como un profesional capaz de entender el pasado de la informática para liderar el futuro de la Inteligencia Artificial y los Videojuegos.</p>
  </div>

  <div class="objectives-card" style="background: rgba(0, 229, 255, 0.05); border: 1px solid var(--cyan-600); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; margin: 1.5rem 0;">
    <h3 style="color: var(--cyan-300); font-size: 1.1rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🎯</span> Objetivos de Aprendizaje
    </h3>
    <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; padding-left: 0.25rem;">
      <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.95rem; color: var(--text-secondary);">
        <span style="color: var(--cyan-400);">●</span> Analizar la transición del cálculo mecánico a la computación universal.
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.95rem; color: var(--text-secondary);">
        <span style="color: var(--cyan-400);">●</span> Comprender la física del dato: del bit a la arquitectura de Von Neumann.
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.95rem; color: var(--text-secondary);">
        <span style="color: var(--cyan-400);">●</span> Diferenciar lenguajes por su nivel de abstracción y método de ejecución.
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.95rem; color: var(--text-secondary);">
        <span style="color: var(--cyan-400);">●</span> Dominar el ecosistema de trabajo profesional (Cloud + IDE).
      </li>
    </ul>
  </div>

  <article class="briefing-section">
    <h3 class="briefing-section-title">1. Requisitos para ser Programador</h3>
    <p class="briefing-text">Más allá de los conocimientos técnicos, un programador de alto rendimiento, hoy necesita desarrollar ciertas habilidades fundamentales:</p>
    <ul class="theory-feature-list">
      <li><strong>Pensamiento Lógico:</strong> La capacidad de descomponer un problema grande en partes pequeñas y manejables.</li>
      <li><strong>Curiosidad Constante:</strong> El software evoluciona cada día. Un profesional nunca deja de estudiar.</li>
      <li><strong>Gestión de la Frustración:</strong> Programar implica enfrentarse a errores (bugs). El éxito radica en la persistencia para encontrar la solución.</li>
      <li><strong>Atención al Detalle:</strong> Un solo carácter fuera de lugar puede detener un sistema entero.</li>
      <li><strong>Competencias Digitales:</strong> El dominio de herramientas en la nube es indispensable para la colaboración profesional.</li>
    </ul>
    <img src="assets/img/clase1_1.jpg" alt="Requisitos para ser Programador" class="img-institucional">
  </article>

  <article class="briefing-section">
    <h3 class="briefing-section-title">2. Mitos de la Programación</h3>
    <p class="briefing-text">Es vital derribar falsas creencias que suelen alejar a potenciales talentos de esta carrera:</p>
    <ul class="theory-feature-list">
      <li><strong>"Hay que ser un genio en matemáticas":</strong> Si bien la lógica es matemática, no necesitas resolver ecuaciones complejas para crear la mayoría de los programas o videojuegos. La lógica es más importante que el cálculo.</li>
      <li><strong>"La IA va a reemplazar a los programadores":</strong> La IA es una herramienta poderosa que potencia al programador, pero carece de la visión estratégica y la ética humana necesaria para liderar proyectos.</li>
      <li><strong>"Es solo para gente joven":</strong> La programación es una disciplina basada en la experiencia y el criterio. Nunca es tarde para empezar a construir soluciones digitales.</li>
      <li><strong>"Programar es estar solo frente a una PC":</strong> El desarrollo moderno es altamente colaborativo y requiere comunicación constante con equipos y clientes.</li>
    </ul>
    <img src="assets/img/clase1_2.jpg" alt="Mitos de la Programación" class="img-institucional">
  </article>

  <article class="briefing-section">
    <h3 class="briefing-section-title">3. Bases de la Programación</h3>
    <p class="briefing-text">Todo software, desde una página web simple hasta un videojuego de última generación, se basa en los mismos pilares:</p>
    <ul class="theory-feature-list">
      <li><strong>Algoritmos:</strong> Una secuencia de pasos lógicos y finitos para resolver un problema.</li>
      <li><strong>Sintaxis:</strong> El conjunto de reglas que definen cómo se escribe un lenguaje de programación para que la computadora lo entienda.</li>
      <li><strong>Abstracción:</strong> La capacidad de ignorar los detalles irrelevantes para enfocarse en el funcionamiento general del sistema.</li>
      <li><strong>Datos:</strong> La materia prima. Sin información para procesar, el software no tiene propósito.</li>
    </ul>
  </article>

  <article class="briefing-section">
    <h3 class="briefing-section-title">4. Estructura de una Computadora (Arquitectura)</h3>
    <p class="briefing-text">Para dominar el software, debemos conocer el "cuerpo" que lo ejecuta. La estructura básica se divide en dos grandes mundos que trabajan en conjunto:</p>

    <h4 style="color: var(--cyan-300); margin: 1.25rem 0 0.5rem 0; font-size: 1.05rem;">4.1. HARDWARE (La parte física)</h4>
    <p class="briefing-text">Es todo lo tangible. En la programación de videojuegos, entender el hardware es clave para optimizar el rendimiento:</p>
    <ul class="theory-feature-list">
      <li><strong>CPU (Unidad Central de Procesamiento):</strong> El cerebro que ejecuta las instrucciones del código.</li>
      <li><strong>Memoria RAM:</strong> El espacio donde se cargan los programas mientras se usan. Es volátil (se borra al apagar).</li>
      <li><strong>Almacenamiento (SSD/HDD/Nube):</strong> Donde guardamos la información de forma permanente.</li>
      <li><strong>GPU (Unidad de Procesamiento Gráfico):</strong> Crucial para videojuegos; se encarga de los cálculos visuales complejos.</li>
    </ul>
    <img src="assets/img/clase1_3.jpg" alt="Componentes de Hardware" class="img-institucional">

    <h4 style="color: var(--cyan-300); margin: 1.25rem 0 0.5rem 0; font-size: 1.05rem;">4.2. SOFTWARE (La parte lógica)</h4>
    <p class="briefing-text">Es el conjunto de instrucciones que le dicen al hardware qué hacer.</p>
    <ul class="theory-feature-list">
      <li><strong>Software de Sistema:</strong> El que permite que el hardware funcione y que otros programas se ejecuten.</li>
      <li><strong>Software de Aplicación:</strong> Programas diseñados para realizar tareas específicas (Editores de código, navegadores, videojuegos).</li>
      <li><strong>Software de Desarrollo:</strong> Las herramientas que usamos para crear otros programas (Compiladores, IDEs como VS Code).</li>
    </ul>
    <img src="assets/img/clase1_4.jpg" alt="Capas de Software" class="img-institucional">
  </article>

  <article class="briefing-section">
    <h3 class="briefing-section-title">5. Sistemas Operativos (S.O.)</h3>
    <p class="briefing-text">Es el Software que coordina y dirige todos los servicios y aplicaciones que utiliza el usuario en una computadora, por eso es el más importante y fundamental. Se trata de programas que permiten y regulan los aspectos más básicos del sistema.</p>
    <p class="briefing-text">El sistema operativo es el protocolo básico de operatividad de la computadora, coordina todas sus demás funciones de comunicaciones, de procesamiento, de interfaz con el usuario.</p>
    <p class="briefing-text">Son parte esencial del funcionamiento de los sistemas informáticos y la pieza de software central en la cadena de procesos, ya que establecen las condiciones mínimas para que todo funcione: la administración de los recursos, el método de comunicación con el usuario y con otros sistemas, las aplicaciones adicionales.</p>
    <p class="briefing-text">El sistema operativo generalmente suele utilizarse como un sinónimo con el cual se hace referencia al software de sistema, esto se debe a que muchos sistemas operativos permiten al usuario interactuar con los elementos que conforman el software de sistema. Además de funcionar como el medio de interacción entre el usuario y la computadora por medio de una interfaz interactiva, el SO hace posible modificar y gestionar parámetros del uso de hardware del equipo.</p>
    <img src="assets/img/clase1_5.jpg" alt="Arquitectura del Sistema Operativo" class="img-institucional">
    <ul class="theory-feature-list">
      <li><strong>Funciones principales:</strong> Gestionar la memoria RAM, administrar los archivos en el disco y controlar los periféricos (teclado, mouse, monitor).</li>
      <li><strong>Entornos Modernos:</strong> Hoy en día, los S.O. están integrados con la nube, permitiendo sincronización constante.</li>
      <li><strong>Tipos comunes:</strong> Windows, Linux, MacOS, Android, IOS</li>
    </ul>
  </article>

  <div class="briefing-section" style="border-left: 3px solid var(--cyan-400); padding-left: 1.25rem; margin: 2rem 0;">
    <h3 style="color: var(--cyan-300); font-family: var(--font-display); font-size: 1.2rem;">La Arquitectura del Código y la Evolución del Pensamiento Sistémico</h3>
  </div>

  <article class="briefing-section">
    <h3 class="briefing-section-title">6. El Génesis: De los Engranajes a la Lógica Pura</h3>
    <p class="briefing-text">La programación no es una invención moderna; es la culminación de milenios de búsqueda por automatizar el pensamiento.</p>

    <h4 style="color: var(--cyan-300); margin: 1.25rem 0 0.5rem 0; font-size: 1.05rem;">6.1 El Sueño de Babbage y Lovelace</h4>
    <p class="briefing-text">En el siglo XIX, Charles Babbage diseñó la Máquina Analítica. No era electrónica, funcionaba con vapor y engranajes, pero ya contenía los conceptos que hoy usamos en Python o C++: una unidad de procesamiento (el "Mill"), una memoria (el "Store") y una forma de entrada (tarjetas perforadas).</p>
    <p class="briefing-text">Sin embargo, fue Ada Lovelace quien vio más allá. Ella escribió el primer algoritmo para calcular los números de Bernoulli y comprendió que, si algo podía representarse lógicamente, la máquina podía procesarlo. Lovelace es la madre del software porque separó la máquina física del concepto lógico.</p>
    <img src="assets/img/clase1_6.jpg" alt="Charles Babbage y Ada Lovelace" class="img-institucional">

    <h4 style="color: var(--cyan-300); margin: 1.25rem 0 0.5rem 0; font-size: 1.05rem;">6.2 La Revolución de Turing</h4>
    <p class="briefing-text">En 1936, Alan Turing introdujo la idea de la "Máquina Universal". Demostró que una sola máquina, con las instrucciones adecuadas, podía realizar la tarea de cualquier otra máquina. Este es el nacimiento del concepto de Software: el hardware es el cuerpo, pero el software es la "mente" que lo reconfigura para ser una calculadora, una consola de juegos o un asistente de IA.</p>
    <img src="assets/img/clase1_7.jpg" alt="Alan Turing y la Máquina Universal" class="img-institucional">
  </article>

  <article class="briefing-section">
    <h3 class="briefing-section-title">7. La Física del Dato: ¿Cómo "piensa" la computadora?</h3>
    <p class="briefing-text">Un programador profesional debe entender que, bajo la pantalla, solo hay electricidad y magnetismo.</p>

    <h4 style="color: var(--cyan-300); margin: 1.25rem 0 0.5rem 0; font-size: 1.05rem;">7.1 El Sistema Binario (La base de todo)</h4>
    <p class="briefing-text">Las computadoras funcionan con transistores, que actúan como interruptores: dejan pasar luz/electricidad (1) o no (0).</p>
    <ul class="theory-feature-list">
      <li><strong>Bit:</strong> La unidad mínima (0 o 1).</li>
      <li><strong>Byte:</strong> Un conjunto de 8 bits. Con un byte podemos representar 256 estados diferentes (suficiente para el abecedario, números y símbolos básicos).</li>
      <li><strong>Código ASCII:</strong> Es el "traductor". Por ejemplo, cuando presionas la 'A', el teclado envía el código binario 01000001 (65 en decimal) al procesador.</li>
    </ul>
    <img src="assets/img/clase1_8.jpg" alt="El Sistema Binario" class="img-institucional">

    <h4 style="color: var(--cyan-300); margin: 1.25rem 0 0.5rem 0; font-size: 1.05rem;">7.2 La Arquitectura de Von Neumann</h4>
    <p class="briefing-text">Casi todos los dispositivos actuales (PC, Celular, Consola) siguen este esquema:</p>
    <ol style="padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; margin: 0.75rem 0; color: var(--text-secondary);">
      <li><strong>CPU (Procesador):</strong> El cerebro que ejecuta instrucciones.</li>
      <li><strong>Memoria RAM:</strong> El espacio de trabajo volátil (rápido pero se borra al apagar).</li>
      <li><strong>Unidad de Almacenamiento:</strong> Donde guardamos los archivos (Disco rígido, SSD, Nube).</li>
      <li><strong>Periféricos de Entrada/Salida:</strong> Teclado, monitor, joystick.</li>
    </ol>
    <img src="assets/img/clase1_9.jpg" alt="Arquitectura de Von Neumann" class="img-institucional">
  </article>

  <article class="briefing-section">
    <h3 class="briefing-section-title">8. Niveles de Abstracción: El Puente entre el Humano y la Máquina</h3>
    <p class="briefing-text">Programar es traducir un deseo humano a un lenguaje que el silicio entienda.</p>
    <ul class="theory-feature-list">
      <li><strong>Lenguajes de Bajo Nivel (Assembler):</strong> Instrucciones directas al procesador. Son rápidos pero extremadamente difíciles de escribir para un humano.</li>
      <li><strong>Lenguajes de Alto Nivel (Python, C++, Java):</strong> Usan palabras en inglés y estructuras lógicas que podemos entender.</li>
      <li><strong>Compiladores e Intérpretes:</strong> Son los "traductores" que convierten nuestro código de alto nivel en ceros y unos para el procesador.</li>
    </ul>
  </article>

  <article class="briefing-section">
    <h3 class="briefing-section-title">9. El Nuevo Paradigma: La IA como el "Siguiente Nivel"</h3>
    <p class="briefing-text">Hoy, la Inteligencia Artificial no ha reemplazado al programador, ha elevado su rol.</p>
    <ul class="theory-feature-list">
      <li><strong>Ayer:</strong> El programador pasaba horas buscando un error de sintaxis (un punto y coma olvidado).</li>
      <li><strong>Hoy:</strong> La IA (como Gravity o Copilot) genera la sintaxis base, permitiendo que el programador se enfoque en la <strong>arquitectura</strong>, la <strong>lógica de negocio</strong> y la <strong>creatividad</strong>.</li>
      <li><strong>El Riesgo:</strong> Si no conoces la historia y la lógica base (lo que estamos viendo hoy), no sabrás cuando la IA cometa un error lógico profundo o genere un código inseguro.</li>
    </ul>
  </article>

  <article class="briefing-section">
    <h3 class="briefing-section-title">10. Laboratorio y Configuración del Entorno (Cloud Computing)</h3>
    <p class="briefing-text">Un profesional de sistemas no guarda sus archivos "en el escritorio". Los gestiona en la nube para asegurar persistencia, versión y colaboración.</p>

    <h4 style="color: var(--cyan-300); margin: 1.25rem 0 0.5rem 0; font-size: 1.05rem;">10.1 Gestión en Google Drive</h4>
    <ol style="padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; margin: 0.75rem 0; color: var(--text-secondary);">
      <li>Ingresa a tu unidad de Drive.</li>
      <li>Crea una carpeta llamada <code>2026-CURSOPROGRAMACIÓN-TUAPELLIDO</code>.</li>
      <li>Dentro, organiza por bloques, crea las siguientes carpetas: <code>01_Fundamentos</code>, <code>02_Lógica</code>, <code>03_Python</code>, <code>04_Activos_IA</code>, <code>05_Proyecto_Final</code>.</li>
      <li>Permisos: Haz clic derecho en la carpeta principal, selecciona "Compartir" y agrega el correo <code>cfp403mercedes@abc.gob.ar</code> con permiso de Editor.</li>
    </ol>
    <img src="assets/img/clase1_10.jpg" alt="Estructura de Google Drive" class="img-institucional">

    <div class="callout callout-tip" style="margin-top: 1.5rem;">
      <span class="callout-title">🔗 Recursos y Herramientas Pro</span>
      <p class="callout-text">
        ● <strong>Documentación:</strong> Guía ASCII Completa (Para entender la traducción de caracteres).<br>
        ● <strong>Simulador:</strong> Turing Machine Simulator (Visualiza cómo funciona la lógica de una máquina universal).
      </p>
    </div>
  </article>
</div>"""

mision_practica = """<div class="mission-card">
  <div class="mission-header-bar">
    <div>
      <h3 class="mission-title">Actividades de la Clase 1: Análisis Histórico y Lógica de Datos</h3>
      <span class="badge badge-module">CFP N° 403 Mercedes</span>
    </div>
    <span class="badge badge-diff">Nivel: Fundamentos • 100 XP</span>
  </div>

  <div class="callout callout-important" style="margin: 1.25rem 0;">
    <span class="callout-title">📋 Modalidad de Entrega en Plataforma</span>
    <p class="callout-text">
      En lugar de utilizar Google Drive para esta entrega, <strong>redacta tus respuestas directamente en la pestaña 'Laboratorio Web'</strong> en el procesador de texto integrado. Al concluir tu desarrollo, pulsa el botón <strong>'Guardar y Entregar Documento'</strong> para asentar tu trabajo en el expediente académico.
    </p>
  </div>

  <div class="mission-part" style="margin-bottom: 1.75rem;">
    <h4 style="color: var(--cyan-300); font-family: var(--font-display); font-size: 1.1rem; border-bottom: 1px solid var(--steel-border); padding-bottom: 0.5rem; margin-bottom: 1rem;">
      Parte 1: El Analista e Historiador
    </h4>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="background: var(--bg-surface-2); border-left: 3px solid var(--cyan-400); padding: 1rem; border-radius: var(--radius-sm);">
        <strong style="color: #ffffff;">1. Ensayo Técnico:</strong>
        <p style="margin-top: 0.35rem; color: var(--text-secondary);">
          Explica por qué se dice que Ada Lovelace fue la primera programadora si en su época no existían las computadoras electrónicas. Relaciónalo con el concepto de <em>algoritmo</em>.
        </p>
      </div>
      <div style="background: var(--bg-surface-2); border-left: 3px solid var(--cyan-400); padding: 1rem; border-radius: var(--radius-sm);">
        <strong style="color: #ffffff;">2. Análisis de Evolución:</strong>
        <p style="margin-top: 0.35rem; color: var(--text-secondary);">
          Elige una consola de videojuegos de los años 80 (ej: NES) y compárala con una actual o con el hardware necesario para correr una IA hoy. Menciona diferencias en bits, memoria y capacidad de procesamiento.
        </p>
      </div>
    </div>
  </div>

  <div class="mission-part" style="margin-bottom: 1.75rem;">
    <h4 style="color: var(--cyan-300); font-family: var(--font-display); font-size: 1.1rem; border-bottom: 1px solid var(--steel-border); padding-bottom: 0.5rem; margin-bottom: 1rem;">
      Parte 2: Lógica de Datos
    </h4>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div style="background: var(--bg-surface-2); border-left: 3px solid var(--cyan-400); padding: 1rem; border-radius: var(--radius-sm);">
        <strong style="color: #ffffff;">1. Binario a Mano:</strong>
        <p style="margin-top: 0.35rem; color: var(--text-secondary);">
          Traduce la palabra <strong>"CODE"</strong> a binario utilizando la tabla ASCII (cada letra es un byte). Muestra el desarrollo paso a paso.
        </p>
      </div>
      <div style="background: var(--bg-surface-2); border-left: 3px solid var(--cyan-400); padding: 1rem; border-radius: var(--radius-sm);">
        <strong style="color: #ffffff;">2. Investigación de Hardware:</strong>
        <p style="margin-top: 0.35rem; color: var(--text-secondary);">
          Busca las especificaciones de tu propia computadora o celular. Anota: Modelo de CPU, cantidad de RAM y tipo de almacenamiento. Explica brevemente qué función cumple cada uno según lo visto en clase.
        </p>
      </div>
    </div>
  </div>

  <div class="mission-context" style="margin-top: 1rem;">
    <strong>📌 Recuerda:</strong> La prolijidad en el documento de entrega y el uso de terminología técnica son parte de la evaluación. ¡Bienvenidos al mundo profesional!
  </div>

  <div class="mission-actions" style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: flex-end;">
    <button class="btn btn-outline-cyan btn-sm" id="btnGoToEditor">
      Ir al Editor de Ensayo (Laboratorio)
    </button>
    <button class="btn btn-cyan btn-sm" id="btnValidateMission">
      Marcar Actividades Completadas (+100 XP)
    </button>
  </div>
</div>"""

mensajes_tutor = {
  "texto_vacio": "Tu documento está completamente vacío. Recuerda desarrollar el ensayo sobre Ada Lovelace, la evolución del hardware (consolas/IA), el pasaje de la palabra 'CODE' a binario ASCII y las especificaciones de tu propio equipo.",
  "texto_corto": "Tu entrega parece incompleta o demasiado breve. Por favor, asegúrate de abordar con profundidad técnica la Parte 1 (Ada Lovelace y Análisis de Hardware) y la Parte 2 (Cálculo binario de 'CODE' e investigación de tus especificaciones de hardware)."
}

data = {
  "id": "clase_1",
  "numero": 1,
  "moduloId": 1,
  "moduloNombre": "Módulo 1: Fundamentos de la Computación",
  "titulo": "Clase 1: Introducción al Mundo de la Programación Profesional",
  "descripcionCorta": "Historia de la computación, arquitectura de Von Neumann, hardware vs software, sistema binario y configuración del entorno profesional.",
  "duracionEstimada": "2.5 Horas",
  "dificultad": "Principiante",
  "tipo_entorno": "editor_texto_ensayo",
  "video_url": "[Placeholder para el link del video]",
  "contenido_teorico": contenido_teorico,
  "mision_practica": mision_practica,
  "mensajes_tutor": mensajes_tutor,
  "recursos": {
    "descargas": [
      {
        "nombre": "Clase 1 - Guía Teórica Completa.pdf",
        "descripcion": "Documento institucional con el marco teórico íntegro del CFP N° 403.",
        "tamano": "1.4 MB",
        "url": "#"
      },
      {
        "nombre": "Actividades de Clase 1.pdf",
        "descripcion": "Guía de consignas de investigación y ejercicios de lógica de datos.",
        "tamano": "420 KB",
        "url": "#"
      }
    ],
    "enlaces": [
      {
        "titulo": "Guía y Tabla ASCII Completa (Standard & Extended)",
        "url": "https://www.asciitable.com/"
      },
      {
        "titulo": "Simulador Interactivo de la Máquina de Turing",
        "url": "https://turingmachine.io/"
      },
      {
        "titulo": "Museo de Historia de la Computación (Babbage & Lovelace)",
        "url": "https://www.computerhistory.org/"
      }
    ]
  }
}

# Escribir en data/clases/clase_1.json
with open('c:/ProyectosPython/campus_cfp403/data/clases/clase_1.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Escribir también en data/clase_01.json
with open('c:/ProyectosPython/campus_cfp403/data/clase_01.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Archivos generados exitosamente')
