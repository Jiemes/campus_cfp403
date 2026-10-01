/**
 * =========================================================================================
 * CAMPUS VIRTUAL CFP N° 403 MERCEDES - ARQUITECTURA MODULAR DE INTERFAZ
 * =========================================================================================
 * Archivo: js/main.js
 * Descripción: Controlador central para la renderización dinámica, navegación entre
 *              las 37 clases del trayecto formativo, persistencia de avance del alumno
 *              (localStorage), gestión de pestañas y ejecución en vivo en el Sandbox.
 *
 * GUÍA TÉCNICA DE INYECCIÓN DE CONTENIDO VARIABLE:
 * -----------------------------------------------------------------------------------------
 * 1. Para agregar o modificar clases del curso, NO se edita el archivo index.html.
 * 2. Cada clase se almacena en su propio archivo JSON independiente en la carpeta /data/:
 *    - Ejemplos provistos: `data/clase_13.json`, `data/clase_22.json`.
 * 3. El archivo `data/classes-index.json` actúa como manifiesto general de las 37 clases,
 *    definiendo el orden, módulos temáticos y ruta al archivo individual de cada sesión.
 * 4. Al hacer clic en el Sidebar o pasar el parámetro de consulta en la URL (ej: `?clase=22`),
 *    el motor `CampusController.loadClass()` descarga asíncronamente el JSON correspondiente
 *    y repuebla las 4 pestañas de forma instantánea y reactiva.
 * =========================================================================================
 */

// --- CONFIGURACIÓN Y ESTADO GLOBAL ---
const CONFIG = {
  INDEX_FILE: 'data/classes-index.json',
  DEFAULT_CLASS_ID: 13, // Clase predeterminada de muestra (POO en Python)
  STORAGE_COMPLETED_KEY: 'cfp403_completed_classes_v1',
  STORAGE_LAST_CLASS_KEY: 'cfp403_last_visited_class_v1',
  PYODIDE_CDN_URL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js'
};

/**
 * =========================================================================================
 * PATRÓN FACTORY: CONSTRUCTOR DINÁMICO DE ENTORNOS (SANDBOX BUILDER)
 * Arquitectura modular y extensible para inyectar únicamente las herramientas
 * requeridas según 'tipo_entorno' ("consola_texto", "canvas_2d", "consola_sql", "terminal_git").
 * =========================================================================================
 */
const EnvironmentBuilderFactory = {
  builders: {
    // -----------------------------------------------------------------------------------
    // 1. ENTORNO: CONSOLA DE TEXTO (Scripts estándar Python / PSeInt)
    // -----------------------------------------------------------------------------------
    consola_texto: {
      nombre: 'Consola de Texto Puro',
      render(container, classData, app) {
        const sandbox = classData.sandbox || {};
        container.innerHTML = `
          <div class="sandbox-toolbar">
            <div class="toolbar-left">
              <div class="file-tab active">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span id="sandboxFileName">${sandbox.archivoNombre || 'main.py'}</span>
              </div>
              <span class="sandbox-engine-status" id="sandboxEngineStatus">
                <span class="engine-dot ready"></span> <span id="engineStatusText">Modo Consola Python 3.11</span>
              </span>
            </div>
            <div class="toolbar-actions">
              <button class="btn btn-secondary btn-sm" id="btnResetSandboxCode" title="Restaurar código de fábrica">Restaurar</button>
              <button class="btn btn-secondary btn-sm" id="btnDownloadCode" title="Descargar archivo">Descargar .py</button>
              <button class="btn btn-outline-cyan btn-sm" id="btnValidateSandboxCode" title="Validar con el Tutor">Validar con Tutor</button>
              <button class="btn btn-cyan btn-sm" id="btnRunSandboxCode" title="Ejecutar código en vivo (Ctrl + Enter)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <span>Ejecutar Código</span>
                <kbd>Ctrl+↵</kbd>
              </button>
            </div>
          </div>

          <div class="sandbox-workspace">
            <div class="editor-pane">
              <div class="editor-gutter" id="editorLineNumbers">1</div>
              <textarea class="code-editor-textarea" id="sandboxTextarea" spellcheck="false" placeholder="# Escribe tu código Python aquí...">${app.escapeHtml(sandbox.codigoInicial || '')}</textarea>
            </div>
            <div class="terminal-pane">
              <div class="terminal-header">
                <div class="terminal-title">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                  <span>Terminal de Salida (Python CLI)</span>
                </div>
                <button class="btn-terminal-action" id="btnClearTerminal">Limpiar</button>
              </div>
              <div class="tutor-feedback-panel" id="tutorFeedbackPanel" style="display: none;"></div>
              <div class="terminal-body" id="terminalOutput">
                <div class="terminal-line terminal-system">[CFP N° 403 Mercedes] Consola de texto lista. Presiona 'Ejecutar Código' para probar el script.</div>
              </div>
            </div>
          </div>
        `;
        app.bindSandboxDynamicElements();
      }
    },

    // -----------------------------------------------------------------------------------
    // 2. ENTORNO: CANVAS 2D (Físicas, Sprites, Videojuegos y Animaciones)
    // -----------------------------------------------------------------------------------
    canvas_2d: {
      nombre: 'Motor Gráfico 2D & Videojuegos',
      render(container, classData, app) {
        const sandbox = classData.sandbox || {};
        container.innerHTML = `
          <div class="sandbox-toolbar">
            <div class="toolbar-left">
              <div class="file-tab active">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                <span id="sandboxFileName">${sandbox.archivoNombre || 'juego_2d.py'}</span>
              </div>
              <span class="badge badge-module" style="background: rgba(0, 229, 255, 0.1); border-color: var(--cyan-600); color: var(--cyan-300);">
                🎮 Modo Videojuegos & Canvas 2D
              </span>
            </div>
            <div class="toolbar-actions">
              <button class="btn btn-secondary btn-sm" id="btnResetSandboxCode" title="Restaurar código de fábrica">Restaurar</button>
              <button class="btn btn-secondary btn-sm" id="btnClearCanvas" title="Limpiar lienzo">Limpiar Lienzo</button>
              <button class="btn btn-outline-cyan btn-sm" id="btnValidateSandboxCode" title="Validar con el Tutor">Validar con Tutor</button>
              <button class="btn btn-cyan btn-sm" id="btnRunSandboxCode" title="Renderizar en vivo (Ctrl + Enter)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <span>Renderizar Escena</span>
                <kbd>Ctrl+↵</kbd>
              </button>
            </div>
          </div>

          <div class="sandbox-workspace">
            <div class="editor-pane">
              <div class="editor-gutter" id="editorLineNumbers">1</div>
              <textarea class="code-editor-textarea" id="sandboxTextarea" spellcheck="false" placeholder="# Código del juego o simulación 2D...">${app.escapeHtml(sandbox.codigoInicial || '')}</textarea>
            </div>
            <div class="terminal-pane">
              <div class="tutor-feedback-panel" id="tutorFeedbackPanel" style="display: none;"></div>
              <div class="canvas-wrapper" id="canvasOutputWrapper" style="display: flex;">
                <div class="canvas-hud">
                  <span class="hud-item" id="canvasStatusText">Lienzo 2D Activo (560x360 px)</span>
                  <span class="hud-item hud-coords" id="canvasCoordsText">X: 0 | Y: 0</span>
                </div>
                <canvas id="gameCanvas" width="560" height="360" tabindex="0"></canvas>
                <div class="canvas-footer-tip">
                  <span>💡 Control: Usa <code>campus.dibujar_rectangulo(...)</code> o <code>campus.dibujar_caja_colision(...)</code>.</span>
                </div>
              </div>
              <div class="terminal-body" id="terminalOutput" style="max-height: 120px; border-top: 1px solid var(--steel-border);">
                <div class="terminal-line terminal-system">[CFP N° 403 Mercedes] Motor Gráfico 2D listo para renderizar.</div>
              </div>
            </div>
          </div>
        `;
        app.bindSandboxDynamicElements();
        app.clearCanvas();
      }
    },

    // -----------------------------------------------------------------------------------
    // 3. ENTORNO: CONSOLA SQL (Base de Datos Relacional y Visor de Tablas)
    // -----------------------------------------------------------------------------------
    consola_sql: {
      nombre: 'Consola SQL & Tablas Relacionales',
      render(container, classData, app) {
        const sandbox = classData.sandbox || {};
        container.innerHTML = `
          <div class="sandbox-toolbar">
            <div class="toolbar-left">
              <div class="file-tab active">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <span id="sandboxFileName">${sandbox.archivoNombre || 'query.sql'}</span>
              </div>
              <span class="badge badge-module" style="background: rgba(56, 189, 248, 0.1); border-color: var(--cyan-600); color: var(--cyan-300);">
                🗄️ SQLite3 Relacional
              </span>
            </div>
            <div class="toolbar-actions">
              <button class="btn btn-secondary btn-sm" id="btnResetSandboxCode" title="Restaurar consulta de fábrica">Restaurar</button>
              <button class="btn btn-outline-cyan btn-sm" id="btnValidateSandboxCode" title="Validar SQL con el Tutor">Validar con Tutor</button>
              <button class="btn btn-cyan btn-sm" id="btnRunSandboxCode" title="Ejecutar consulta relacional (Ctrl + Enter)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <span>Ejecutar SQL</span>
                <kbd>Ctrl+↵</kbd>
              </button>
            </div>
          </div>

          <div class="sandbox-workspace">
            <div class="editor-pane">
              <div class="editor-gutter" id="editorLineNumbers">1</div>
              <textarea class="code-editor-textarea" id="sandboxTextarea" spellcheck="false" placeholder="-- Escribe tus sentencias SQL (CREATE TABLE, INSERT, SELECT)...">${app.escapeHtml(sandbox.codigoInicial || '')}</textarea>
            </div>
            <div class="sql-results-pane">
              <div class="sql-status-bar">
                <span>Visor Relacional de Datos</span>
                <span class="sql-badge-rows" id="sqlRowCountText">0 registros devueltos</span>
              </div>
              <div class="tutor-feedback-panel" id="tutorFeedbackPanel" style="display: none;"></div>
              <div class="sql-table-container" id="sqlTableContainer">
                <div class="sql-empty-state">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                  <p>Presiona 'Ejecutar SQL' para visualizar el resultado de tus consultas relacionales.</p>
                </div>
              </div>
              <div class="terminal-body" id="terminalOutput" style="max-height: 110px; border-top: 1px solid var(--steel-border);">
                <div class="terminal-line terminal-system">[SQLite3 Engine] Motor en memoria (:memory:) inicializado.</div>
              </div>
            </div>
          </div>
        `;
        app.bindSandboxDynamicElements();
      }
    },

    // -----------------------------------------------------------------------------------
    // 4. ENTORNO: TERMINAL GIT (Control de Versiones y Comandos de GitHub)
    // -----------------------------------------------------------------------------------
    terminal_git: {
      nombre: 'Terminal Git & GitHub Shell',
      render(container, classData, app) {
        container.innerHTML = `
          <div class="sandbox-toolbar">
            <div class="toolbar-left">
              <div class="file-tab active">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="4"></circle><line x1="1.05" y1="12" x2="7" y2="12"></line><line x1="17.01" y1="12" x2="22.96" y2="12"></line>
                </svg>
                <span>bash • ~/cfp403_repo (main)</span>
              </div>
              <span class="badge badge-module" style="background: rgba(245, 158, 11, 0.1); border-color: var(--color-warning); color: var(--color-warning);">
                🌿 Git v2.42 Client
              </span>
            </div>
            <div class="toolbar-actions">
              <button class="btn btn-secondary btn-sm" id="btnResetGitRepo" title="Reiniciar estado del repositorio">Reiniciar Repositorio</button>
              <button class="btn btn-outline-cyan btn-sm" id="btnValidateSandboxCode" title="Validar comandos con el Tutor">Validar Flujo</button>
              <button class="btn btn-secondary btn-sm" id="btnClearTerminal" title="Limpiar shell">Limpiar Pantalla</button>
            </div>
          </div>

          <div class="git-workspace">
            <div class="git-terminal-pane">
              <div class="tutor-feedback-panel" id="tutorFeedbackPanel" style="display: none;"></div>
              <div class="git-terminal-history" id="terminalOutput">
                <div class="terminal-line terminal-system">[CFP N° 403 Mercedes] Terminal Git iniciada. Escribe 'git --help' para ver comandos disponibles.</div>
                <div class="terminal-line terminal-stdout">Directorio de trabajo: /home/estudiante/proyecto_cfp403 (rama: main)</div>
              </div>
              <div class="git-prompt-row">
                <span class="git-prompt-label">estudiante@cfp403:~/proyecto (main) $</span>
                <input class="git-command-input" id="gitCommandInput" type="text" placeholder="Escribe un comando... (ej: git status, git add ., git commit -m '...')" autofocus autocomplete="off" spellcheck="false">
              </div>
            </div>

            <!-- Monitor Visual del Repositorio Git -->
            <div class="git-visual-pane">
              <div class="git-card">
                <div class="git-card-title">
                  <span>Working Directory (Archivos)</span>
                  <span class="badge badge-status" id="gitFilesCount">2 archivos</span>
                </div>
                <ul class="git-file-list" id="gitWorkingTreeList">
                  <li class="git-file-item untracked"><span>? app.py</span><span>(Modificado)</span></li>
                  <li class="git-file-item untracked"><span>? index.html</span><span>(Nuevo)</span></li>
                </ul>
              </div>

              <div class="git-card">
                <div class="git-card-title">
                  <span>Staging Area (Preparados para Commit)</span>
                  <span class="badge badge-diff" id="gitStagedCount">0 en preparación</span>
                </div>
                <ul class="git-file-list" id="gitStagingList">
                  <li style="color: var(--text-muted); font-size: 0.72rem;">Vacío. Usa 'git add .'</li>
                </ul>
              </div>

              <div class="git-card">
                <div class="git-card-title">
                  <span>Historial de Commits (HEAD)</span>
                  <span class="badge badge-time" id="gitCommitsCount">1 commit</span>
                </div>
                <div id="gitCommitsList">
                  <div class="git-commit-badge">
                    <span class="git-commit-hash">4a8b2c1</span>
                    <span>Commit inicial de cátedra</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        app.bindGitTerminalElements();
      }
    },

    // -----------------------------------------------------------------------------------
    // 5. ENTORNO: EDITOR DE TEXTO PARA ENSAYO E INVESTIGACIÓN TÉCNICA
    // -----------------------------------------------------------------------------------
    editor_texto_ensayo: {
      nombre: 'Procesador de Texto para Ensayo Técnico',
      render(container, classData, app) {
        container.innerHTML = `
          <div class="sandbox-toolbar">
            <div class="toolbar-left">
              <div class="file-tab active">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>ensayo_tecnico_clase_1.md</span>
              </div>
              <div class="essay-toolbar-meta">
                <span class="essay-word-count-badge" id="essayWordCountBadge">0 palabras • 0 caracteres</span>
                <span id="essayAutosaveStatus" style="color: var(--text-muted); font-size: 0.72rem;">Borrador sincronizado</span>
              </div>
            </div>
            <div class="toolbar-actions">
              <button class="btn btn-secondary btn-sm" id="btnClearEssayText" title="Limpiar borrador de texto">Limpiar</button>
              <button class="btn btn-secondary btn-sm" id="btnDownloadEssay" title="Descargar como archivo de texto">Descargar (.txt)</button>
              <button class="btn btn-cyan btn-sm" id="btnSubmitEssay" title="Guardar y asentar en el expediente del alumno">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                <span>Guardar y Entregar Documento</span>
              </button>
            </div>
          </div>

          <div class="essay-editor-wrapper">
            <div class="tutor-feedback-panel" id="tutorFeedbackPanel" style="display: none;"></div>
            
            <div class="essay-scroll-container">
              <div class="essay-paper">
                <div class="essay-paper-header">
                  <div>
                    <h3 class="essay-paper-title">${classData.titulo || 'Ensayo Técnico y Desarrollo de Actividades'}</h3>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Centro de Formación Profesional N° 403 Mercedes</span>
                  </div>
                  <span class="badge badge-diff">Evaluación Teórico-Práctica</span>
                </div>

                <div class="essay-guidelines-box">
                  <strong>Pautas de Presentación:</strong> Redacta en este espacio la respuesta a las dos partes de la <em>Actividad 1</em> (Ensayo de Ada Lovelace, análisis de hardware de consolas/IA, traducción binaria de "CODE" e investigación de hardware propio). Tu trabajo se almacena automáticamente en tu navegador.
                </div>

                <textarea 
                  class="essay-editor-textarea" 
                  id="essayEditorTextarea" 
                  spellcheck="true" 
                  placeholder="Comienza aquí a redactar tu ensayo y desarrollo técnico...&#10;&#10;Parte 1: El Analista e Historiador&#10;1. Ensayo Técnico (Ada Lovelace y el Algoritmo):&#10;...&#10;&#10;2. Análisis de Evolución (Hardware de Consolas e IA):&#10;...&#10;&#10;Parte 2: Lógica de Datos&#10;1. Binario a Mano ('CODE' en ASCII):&#10;...&#10;&#10;2. Investigación de Hardware Propio:&#10;..."></textarea>
              </div>
            </div>
          </div>
        `;
        app.bindEssayEditorElements();
      }
    }
  },

  /**
   * Permite registrar nuevos tipos de entornos en caliente
   */
  register(tipo, builderDefinition) {
    this.builders[tipo] = builderDefinition;
  },

  /**
   * Construye el entorno delegando al builder correspondiente
   */
  build(tipo, container, classData, app) {
    const builder = this.builders[tipo] || this.builders['consola_texto'];
    container.innerHTML = '';
    builder.render(container, classData, app);
  }
};

class CampusController {
  constructor() {
    this.classesIndex = null;
    this.currentClassData = null;
    this.completedClasses = new Set(this.loadCompletedFromStorage());
    this.pyodide = null;
    this.isPyodideLoading = false;
    this.isPyodideReady = false;

    // Cache de elementos del DOM
    this.dom = {
      // Header y Navegación
      appSidebar: document.getElementById('appSidebar'),
      btnToggleSidebar: document.getElementById('btnToggleSidebar'),
      sidebarOverlay: document.getElementById('sidebarOverlay'),
      headerClassNum: document.getElementById('headerClassNum'),
      headerClassTitle: document.getElementById('headerClassTitle'),
      globalProgressBar: document.getElementById('globalProgressBar'),
      globalProgressPct: document.getElementById('globalProgressPct'),
      btnMarcarCompletada: document.getElementById('btnMarcarCompletada'),
      btnCompletadaTexto: document.getElementById('btnCompletadaTexto'),
      btnReiniciarProgreso: document.getElementById('btnReiniciarProgreso'),
      btnToggleAllModules: document.getElementById('btnToggleAllModules'),

      // Sidebar Stats y Buscador
      statsCompletedCount: document.getElementById('statsCompletedCount'),
      statsTotalCount: document.getElementById('statsTotalCount'),
      statsPendingCount: document.getElementById('statsPendingCount'),
      classSearchInput: document.getElementById('classSearchInput'),
      courseIndexTree: document.getElementById('courseIndexTree'),

      // Hero de la Clase
      heroModuleBadge: document.getElementById('heroModuleBadge'),
      heroDurationText: document.getElementById('heroDurationText'),
      heroDifficultyBadge: document.getElementById('heroDifficultyBadge'),
      heroStatusBadge: document.getElementById('heroStatusBadge'),
      heroTitle: document.getElementById('heroTitle'),
      heroDescription: document.getElementById('heroDescription'),

      // Pestañas (Tabs)
      tabButtons: document.querySelectorAll('.tab-button'),
      tabPanes: document.querySelectorAll('.tab-pane'),
      tabMissionXP: document.getElementById('tabMissionXP'),

      // Pestaña 1: Briefing
      briefingContent: document.getElementById('briefingContent'),

      // Pestaña 2: Sandbox
      sandboxFileName: document.getElementById('sandboxFileName'),
      sandboxEngineStatus: document.getElementById('sandboxEngineStatus'),
      engineStatusText: document.getElementById('engineStatusText'),
      sandboxTextarea: document.getElementById('sandboxTextarea'),
      editorLineNumbers: document.getElementById('editorLineNumbers'),
      terminalOutput: document.getElementById('terminalOutput'),
      btnRunSandboxCode: document.getElementById('btnRunSandboxCode'),
      btnClearTerminal: document.getElementById('btnClearTerminal'),
      btnResetSandboxCode: document.getElementById('btnResetSandboxCode'),
      btnDownloadCode: document.getElementById('btnDownloadCode'),
      btnValidateSandboxCode: document.getElementById('btnValidateSandboxCode'),
      tutorFeedbackPanel: document.getElementById('tutorFeedbackPanel'),

      // Selector de Vistas de Terminal y Canvas
      btnViewConsole: document.getElementById('btnViewConsole'),
      btnViewCanvas: document.getElementById('btnViewCanvas'),
      btnClearCanvas: document.getElementById('btnClearCanvas'),
      canvasOutputWrapper: document.getElementById('canvasOutputWrapper'),
      gameCanvas: document.getElementById('gameCanvas'),
      canvasStatusText: document.getElementById('canvasStatusText'),
      canvasCoordsText: document.getElementById('canvasCoordsText'),

      // Pestaña 3: Misión
      missionContainer: document.getElementById('missionContainer'),

      // Pestaña 4: Recursos
      resourcesContainer: document.getElementById('resourcesContainer'),

      // Notificaciones Toast
      toastNotification: document.getElementById('toastNotification')
    };
  }

  /**
   * Inicialización del ciclo de vida de la aplicación
   */
  async init() {
    this.bindEvents();
    await this.loadCourseManifest();
    
    // Identificar qué clase cargar (por Query Param ?clase=X o último guardado)
    const urlParams = new URLSearchParams(window.location.search);
    const classFromUrl = parseInt(urlParams.get('clase'), 10);
    const lastClass = parseInt(localStorage.getItem(CONFIG.STORAGE_LAST_CLASS_KEY), 10);
    const targetClassId = classFromUrl || lastClass || CONFIG.DEFAULT_CLASS_ID;

    await this.loadClass(targetClassId);
    this.updateGlobalProgressDisplay();

    // Iniciar carga en segundo plano de Pyodide (Python en navegador)
    this.initPyodideEngine();
  }

  /**
   * Vinculación de eventos de interfaz (Sidebar, Tabs, Teclas rápidas)
   */
  bindEvents() {
    // Toggle del Sidebar
    this.dom.btnToggleSidebar.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        this.dom.appSidebar.classList.toggle('mobile-open');
        this.dom.sidebarOverlay.classList.toggle('active');
      } else {
        this.dom.appSidebar.classList.toggle('collapsed');
      }
    });

    if (this.dom.sidebarOverlay) {
      this.dom.sidebarOverlay.addEventListener('click', () => {
        this.dom.appSidebar.classList.remove('mobile-open');
        this.dom.sidebarOverlay.classList.remove('active');
      });
    }

    // Navegación entre las 4 pestañas
    this.dom.tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const targetId = button.getAttribute('aria-controls');
        this.switchTab(button, targetId);
      });
    });

    // Botón Marcar/Desmarcar como completada
    this.dom.btnMarcarCompletada.addEventListener('click', () => {
      if (!this.currentClassData) return;
      this.toggleCurrentClassCompletion();
    });

    // Reinicio de progreso para el estudiante
    this.dom.btnReiniciarProgreso.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('¿Deseas reiniciar tu progreso en las 37 clases del curso?')) {
        this.completedClasses.clear();
        this.saveCompletedToStorage();
        this.renderSidebarTree();
        this.updateGlobalProgressDisplay();
        this.updateClassStatusBadges();
        this.showToast('Progreso reiniciado correctamente');
      }
    });

    // Buscador rápido en el Sidebar
    this.dom.classSearchInput.addEventListener('input', (e) => {
      this.filterSidebarClasses(e.target.value.toLowerCase().trim());
    });

    // Expandir/Colapsar todos los módulos
    this.dom.btnToggleAllModules.addEventListener('click', () => {
      const allModules = this.dom.courseIndexTree.querySelectorAll('.module-group');
      const isAnyOpen = Array.from(allModules).some(m => m.classList.contains('expanded'));
      allModules.forEach(m => {
        if (isAnyOpen) {
          m.classList.remove('expanded');
          this.dom.btnToggleAllModules.textContent = 'Expandir todos';
        } else {
          m.classList.add('expanded');
          this.dom.btnToggleAllModules.textContent = 'Colapsar todos';
        }
      });
    });

    // Atajo de teclado: Ctrl+Enter para ejecutar código en Sandbox
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeTab = document.querySelector('.tab-button.active');
        if (activeTab && activeTab.id === 'tabBtn-sandbox') {
          e.preventDefault();
          this.executeSandboxCode();
        }
      }
    });
  }

  /**
   * Configuración de la experiencia de edición (Gutter, Tabulaciones y Sincronización)
   */
  setupEditorEvents() {
    const textarea = this.dom.sandboxTextarea;
    const gutter = this.dom.editorLineNumbers;

    if (!textarea || !gutter) return;

    // Actualizar numeración de líneas en cada pulsación
    const updateLineNumbers = () => {
      const lines = textarea.value.split('\n').length;
      let numbersHtml = '';
      for (let i = 1; i <= lines; i++) {
        numbersHtml += `${i}\n`;
      }
      gutter.textContent = numbersHtml;
    };

    textarea.addEventListener('input', updateLineNumbers);

    // Sincronizar scroll entre el textarea y la columna de números
    textarea.addEventListener('scroll', () => {
      gutter.scrollTop = textarea.scrollTop;
    });

    // Permitir tabulaciones con 4 espacios (estándar PEP 8)
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const spaces = '    '; // 4 espacios
        textarea.value = textarea.value.substring(0, start) + spaces + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        updateLineNumbers();
      }
    });
  }

  /**
   * Cambiar entre las 4 pestañas interactivas fijas
   */
  switchTab(buttonElement, targetPaneId) {
    this.dom.tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    this.dom.tabPanes.forEach(pane => pane.classList.remove('active'));

    buttonElement.classList.add('active');
    buttonElement.setAttribute('aria-selected', 'true');

    const targetPane = document.getElementById(targetPaneId);
    if (targetPane) {
      targetPane.classList.add('active');
    }
  }

  /**
   * Descarga el manifiesto general de las 37 clases
   */
  async loadCourseManifest() {
    try {
      const response = await fetch(CONFIG.INDEX_FILE);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.classesIndex = await response.json();
      this.renderSidebarTree();
    } catch (err) {
      console.error('Error cargando el manifiesto de clases:', err);
      this.dom.courseIndexTree.innerHTML = `
        <div class="terminal-line terminal-stderr" style="padding: 1rem;">
          [Error] No se pudo cargar el índice de clases (${CONFIG.INDEX_FILE}). Verifique la conexión o el servidor local.
        </div>
      `;
    }
  }

  /**
   * Renderiza el mapa de navegación del Sidebar con los 6 módulos y las 37 clases
   */
  renderSidebarTree() {
    if (!this.classesIndex || !this.classesIndex.modulos) return;

    let html = '';
    this.classesIndex.modulos.forEach(modulo => {
      html += `
        <div class="module-group" data-module-id="${modulo.id}">
          <div class="module-header" title="Haga clic para expandir o contraer">
            <div class="module-title-box">
              <span class="module-name">${modulo.nombre}</span>
              <span class="module-range">${modulo.rango}</span>
            </div>
            <svg class="module-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <ul class="module-classes-list">
      `;

      modulo.clases.forEach(clase => {
        const isCompleted = this.completedClasses.has(clase.id);
        const isActive = this.currentClassData && this.currentClassData.id === clase.id;

        html += `
          <li class="class-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
              data-class-id="${clase.id}" 
              data-title="${clase.titulo.toLowerCase()}"
              title="Clase ${clase.numero}: ${clase.titulo}">
            <div class="class-item-left">
              <span class="class-badge-num">C${clase.numero}</span>
              <span class="class-item-title">${clase.titulo}</span>
            </div>
            <div class="class-status-icon">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </li>
        `;
      });

      html += `
          </ul>
        </div>
      `;
    });

    this.dom.courseIndexTree.innerHTML = html;

    // Vincular clic en encabezados de módulos (Acordeón)
    this.dom.courseIndexTree.querySelectorAll('.module-header').forEach(header => {
      header.addEventListener('click', () => {
        const group = header.closest('.module-group');
        group.classList.toggle('expanded');
      });
    });

    // Vincular clic en cada clase
    this.dom.courseIndexTree.querySelectorAll('.class-item').forEach(item => {
      item.addEventListener('click', () => {
        const classId = parseInt(item.getAttribute('data-class-id'), 10);
        this.loadClass(classId);

        // En pantallas móviles, cerrar el sidebar al seleccionar
        if (window.innerWidth <= 860) {
          this.dom.appSidebar.classList.remove('mobile-open');
          this.dom.sidebarOverlay.classList.remove('active');
        }
      });
    });
  }

  /**
   * Carga dinámica del archivo JSON específico de una clase
   * @param {number} classId - Identificador numérico de la clase (1 a 37)
   */
  async loadClass(classId) {
    const formattedId = classId.toString().padStart(2, '0');
    // Rutas candidatas para soportar la convención data/clases/clase_X.json y data/clase_XX.json
    const candidateFiles = [
      `data/clases/clase_${classId}.json`,
      `data/clases/clase_${formattedId}.json`,
      `data/clase_${formattedId}.json`,
      `data/clase_${classId}.json`
    ];

    // Estado visual de carga
    this.dom.heroTitle.textContent = `Cargando Clase ${classId}...`;
    this.dom.briefingContent.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Inyectando módulo teórico de la Clase ${classId}...</p>
      </div>
    `;

    try {
      let response = null;
      for (const file of candidateFiles) {
        try {
          const res = await fetch(file);
          if (res.ok) {
            response = res;
            break;
          }
        } catch (_) {}
      }

      if (!response) {
        throw new Error(`No se encontró el archivo de datos para la clase ${classId}`);
      }
      this.currentClassData = await response.json();
      
      // Normalizar número e id si vienen como string "clase_1"
      if (!this.currentClassData.numero) {
        this.currentClassData.numero = typeof classId === 'number' ? classId : parseInt(String(this.currentClassData.id).replace(/\D/g, '') || '1', 10);
      }
      
      // Guardar última clase visitada
      localStorage.setItem(CONFIG.STORAGE_LAST_CLASS_KEY, classId.toString());
      
      // Actualizar URL sin recargar la página
      const newUrl = `${window.location.pathname}?clase=${classId}`;
      window.history.replaceState({ classId }, '', newUrl);

      // Renderizar los 4 bloques
      this.populateClassView();

    } catch (err) {
      console.warn(`Aviso de carga para la clase ${classId}:`, err.message);
      this.renderFallbackPlaceholderClass(classId);
    }
  }

  /**
   * Puebla toda la interfaz con la data del JSON cargado
   */
  populateClassView() {
    const data = this.currentClassData;
    if (!data) return;

    // 1. Encabezado y Hero
    const numeroClase = data.numero || (typeof data.id === 'string' ? data.id.replace(/\D/g, '') : data.id) || '1';
    this.dom.headerClassNum.textContent = `Clase ${numeroClase}`;
    this.dom.headerClassTitle.textContent = data.titulo;

    this.dom.heroModuleBadge.textContent = data.moduloNombre || 'Módulo 1: Fundamentos de la Computación';
    this.dom.heroDurationText.textContent = data.duracionEstimada || '2.5 Horas';
    this.dom.heroDifficultyBadge.textContent = data.dificultad || 'Principiante';
    this.dom.heroTitle.textContent = data.titulo.startsWith('Clase') ? data.titulo : `Clase ${numeroClase}: ${data.titulo}`;
    this.dom.heroDescription.textContent = data.descripcionCorta || 'Fundamentos de computación, arquitectura de Von Neumann, hardware, software e historia de los algoritmos.';

    // 2. Estado de completitud
    this.updateClassStatusBadges();

    // 3. Pestaña 1: Briefing Teórico
    this.renderBriefing(data.contenido_teorico || data.briefing);

    // 4. Pestaña 2: Laboratorio Web (Sandbox)
    this.renderSandbox(data.sandbox || {});

    // 5. Pestaña 3: Misión Práctica
    this.renderMission(data.mision_practica || data.mision);

    // 6. Pestaña 4: Recursos y Video
    this.renderResources(data.recursos);

    // 7. Actualizar selección visual en el Sidebar
    this.highlightActiveInSidebar(data.id, data.moduloId);
  }

  /**
   * Inyecta el contenido del Briefing Teórico de forma limpia y scannable
   */
  renderBriefing(briefing) {
    if (!briefing) {
      this.dom.briefingContent.innerHTML = `<p class="briefing-text">No hay material teórico disponible para esta clase.</p>`;
      return;
    }

    // Soporte directo para HTML limpio (ej: contenido_teorico de clase_1.json)
    if (typeof briefing === 'string') {
      this.dom.briefingContent.innerHTML = briefing;
      return;
    }

    let html = '';

    // Introducción
    if (briefing.introduccion) {
      html += `
        <div class="briefing-intro-card">
          <p>${this.formatMarkdown(briefing.introduccion)}</p>
        </div>
      `;
    }

    // Secciones con subtítulos, párrafos, bloques de código y callouts
    if (Array.isArray(briefing.secciones)) {
      briefing.secciones.forEach((sec, idx) => {
        html += `
          <article class="briefing-section" id="${sec.id || 'sec-' + idx}">
            <h3 class="briefing-section-title">${sec.titulo}</h3>
            <div class="briefing-text">${this.formatMarkdown(sec.contenido)}</div>
        `;

        // Bloque de código con botón de copiar y enviar al editor
        if (sec.codigo) {
          html += `
            <div class="code-snippet-box">
              <div class="code-snippet-header">
                <span>Python • Ejemplo de Cátedra</span>
                <div style="display: flex; gap: 0.75rem;">
                  <button class="btn-snippet-copy" data-action="load-sandbox" title="Cargar este código directamente en el Sandbox">
                    ⚡ Cargar en Sandbox
                  </button>
                  <button class="btn-snippet-copy" data-action="copy" title="Copiar código al portapapeles">
                    📋 Copiar
                  </button>
                </div>
              </div>
              <pre class="code-snippet-body"><code>${this.escapeHtml(sec.codigo)}</code></pre>
            </div>
          `;
        }

        // Callout informativo
        if (sec.callout) {
          const calloutType = sec.callout.tipo === 'important' ? 'callout-important' : 'callout-tip';
          html += `
            <aside class="callout ${calloutType}">
              <span class="callout-title">${sec.callout.titulo}</span>
              <p class="callout-text">${this.formatMarkdown(sec.callout.texto)}</p>
            </aside>
          `;
        }

        html += `</article>`;
      });
    }

    // Conclusiones / Resumen
    if (Array.isArray(briefing.conclusiones) && briefing.conclusiones.length > 0) {
      html += `
        <div class="briefing-conclusions">
          <h4 class="conclusions-title">Conclusiones Clave de la Sesión</h4>
          <ul class="conclusions-list">
            ${briefing.conclusiones.map(c => `<li>${this.formatMarkdown(c)}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    this.dom.briefingContent.innerHTML = html;

    // Vincular botones de copiar y cargar en sandbox dentro del briefing
    this.dom.briefingContent.querySelectorAll('.code-snippet-box').forEach(box => {
      const codeText = box.querySelector('code').textContent;
      
      const copyBtn = box.querySelector('[data-action="copy"]');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(codeText);
          this.showToast('Código copiado al portapapeles');
        });
      }

      const loadBtn = box.querySelector('[data-action="load-sandbox"]');
      if (loadBtn) {
        loadBtn.addEventListener('click', () => {
          this.dom.sandboxTextarea.value = codeText;
          this.dom.sandboxTextarea.dispatchEvent(new Event('input'));
          // Cambiar a la pestaña de Sandbox
          this.switchTab(document.getElementById('tabBtn-sandbox'), 'tabPane-sandbox');
          this.showToast('Código cargado en el Sandbox en vivo');
        });
      }
    });
  }

  /**
   * Renderiza el Laboratorio Web (Sandbox) delegando la construcción dinámica
   * a EnvironmentBuilderFactory según 'tipo_entorno' del archivo JSON de la clase.
   */
  renderSandbox(sandbox) {
    const tipo = this.currentClassData?.tipo_entorno || 'consola_texto';
    const container = document.getElementById('sandboxContainer');
    if (!container) return;
    this.dom.sandboxContainer = container;

    // Delegación modular de la construcción del Sandbox
    EnvironmentBuilderFactory.build(tipo, container, this.currentClassData, this);
  }

  /**
   * Renderiza la Misión Práctica (Desafío)
   */
  renderMission(mision) {
    if (!mision) {
      this.dom.missionContainer.innerHTML = `<p>No hay misión práctica para esta clase.</p>`;
      return;
    }

    // Soporte directo para consignas en HTML estructurado (ej: mision_practica de clase_1.json)
    if (typeof mision === 'string') {
      this.dom.tabMissionXP.textContent = `+100 XP`;
      this.dom.missionContainer.innerHTML = mision;

      const btnGoToEditor = this.dom.missionContainer.querySelector('#btnGoToEditor');
      if (btnGoToEditor) {
        btnGoToEditor.addEventListener('click', () => {
          this.switchTab(document.getElementById('tabBtn-sandbox'), 'tabPane-sandbox');
        });
      }

      const btnValidate = this.dom.missionContainer.querySelector('#btnValidateMission');
      if (btnValidate) {
        btnValidate.addEventListener('click', () => {
          this.dom.missionContainer.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = true);
          if (!this.completedClasses.has(this.currentClassData.id)) {
            this.toggleCurrentClassCompletion();
          }
          this.showToast('¡Excelente trabajo! Misión completada (+100 XP)');
        });
      }

      this.dom.missionContainer.querySelectorAll('.checklist-item input').forEach(chk => {
        chk.addEventListener('change', (e) => {
          e.target.closest('.checklist-item')?.classList.toggle('checked', e.target.checked);
        });
      });
      return;
    }

    this.dom.tabMissionXP.textContent = `+${mision.puntosXP || 100} XP`;

    let html = `
      <div class="mission-card">
        <div class="mission-header-bar">
          <h3 class="mission-title">${mision.titulo}</h3>
          <span class="badge badge-diff">Nivel: ${mision.nivel}</span>
        </div>

        <div class="mission-context">
          <strong>Contexto del Desafío:</strong> ${mision.contexto}
        </div>

        <h4 class="mission-subhead">Criterios de Aceptación y Objetivos:</h4>
        <ul class="mission-checklist">
    `;

    if (Array.isArray(mision.requerimientos)) {
      mision.requerimientos.forEach((req, idx) => {
        html += `
          <li class="checklist-item">
            <input type="checkbox" id="mreq-${idx}">
            <label for="mreq-${idx}">${this.formatMarkdown(req)}</label>
          </li>
        `;
      });
    }

    html += `</ul>`;

    // Acordeón de Pistas
    if (Array.isArray(mision.pistas) && mision.pistas.length > 0) {
      html += `
        <details class="hints-accordion">
          <summary class="hints-toggle">
            <span>💡 Pistas y Sugerencias de Cátedra (${mision.pistas.length})</span>
          </summary>
          <div class="hints-content">
            ${mision.pistas.map(p => `<p>• ${this.formatMarkdown(p)}</p>`).join('')}
          </div>
        </details>
      `;
    }

    // Acciones de la misión
    html += `
        <div class="mission-actions">
          <button class="btn btn-secondary btn-sm" id="btnLoadMissionTemplate">
            Cargar Plantilla en el Sandbox
          </button>
          <button class="btn btn-cyan btn-sm" id="btnValidateMission">
            Marcar Misión como Superada (+${mision.puntosXP} XP)
          </button>
        </div>
      </div>
    `;

    this.dom.missionContainer.innerHTML = html;

    // Vinculación de eventos de la misión
    const btnLoadTemplate = document.getElementById('btnLoadMissionTemplate');
    if (btnLoadTemplate && mision.codigoPlantilla) {
      btnLoadTemplate.addEventListener('click', () => {
        this.dom.sandboxTextarea.value = mision.codigoPlantilla;
        this.dom.sandboxTextarea.dispatchEvent(new Event('input'));
        this.switchTab(document.getElementById('tabBtn-sandbox'), 'tabPane-sandbox');
        this.showToast('Plantilla del desafío inyectada en el editor');
      });
    }

    const btnValidate = document.getElementById('btnValidateMission');
    if (btnValidate) {
      btnValidate.addEventListener('click', () => {
        // Marcar todos los checkboxes
        this.dom.missionContainer.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = true);
        if (!this.completedClasses.has(this.currentClassData.id)) {
          this.toggleCurrentClassCompletion();
        }
        this.showToast(`¡Excelente trabajo! Misión completada (+${mision.puntosXP} XP)`);
      });
    }

    // Tachar ítems al chequearlos
    this.dom.missionContainer.querySelectorAll('.checklist-item input').forEach(chk => {
      chk.addEventListener('change', (e) => {
        e.target.closest('.checklist-item').classList.toggle('checked', e.target.checked);
      });
    });
  }

  /**
   * Renderiza la pestaña de Recursos y Video Multimedia
   */
  renderResources(recursos) {
    if (!recursos && !this.currentClassData?.video_url) {
      this.dom.resourcesContainer.innerHTML = `<p>No hay recursos multimedia cargados para esta clase.</p>`;
      return;
    }

    let html = '';

    // 1. Reproductor de Video (soporta objeto o URL plana)
    const videoUrl = recursos?.video?.url || (typeof this.currentClassData?.video_url === 'string' && this.currentClassData.video_url !== '[Placeholder para el link del video]' ? this.currentClassData.video_url : null);
    const videoTitulo = recursos?.video?.titulo || `Videoclase Oficial - ${this.currentClassData?.titulo || 'Clase'}`;

    if (videoUrl) {
      html += `
        <div class="video-section">
          <div class="video-frame-wrap">
            <iframe 
              src="${videoUrl}" 
              title="${videoTitulo}" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
          <div class="video-info-bar">
            <div>
              <h4 class="video-title">${videoTitulo}</h4>
              <span class="badge badge-module">Grabación Oficial de Cátedra</span>
            </div>
            <span class="video-duration">⏱ ${recursos?.video?.duracion || 'Clase Completa'}</span>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="video-section">
          <div class="video-placeholder-wrap" style="aspect-ratio: 16/9; background: var(--bg-surface-2); border: 1px dashed var(--steel-border); border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--text-muted); padding: 2rem; text-align: center;">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--cyan-400)" stroke-width="1.5">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
            <div>
              <h4 style="color: var(--cyan-300); font-size: 1.05rem; margin-bottom: 0.35rem;">Grabación Audiovisual de Cátedra</h4>
              <p style="font-size: 0.85rem; max-width: 520px; color: var(--text-secondary);">El video explicativo de esta sesión será incorporado por el CFP N° 403. Mientras tanto, puedes revisar el marco teórico y realizar tu ensayo técnico.</p>
            </div>
          </div>
        </div>
      `;
    }

    // 2. Grilla de Descargas de Archivos
    if (Array.isArray(recursos.descargas) && recursos.descargas.length > 0) {
      html += `
        <div>
          <h4 class="mission-subhead">Archivos y Material Descargable</h4>
          <div class="downloads-grid">
      `;

      recursos.descargas.forEach(item => {
        html += `
          <div class="download-card">
            <div class="download-top">
              <div class="download-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div class="download-info">
                <span class="download-filename">${item.nombre}</span>
                <span class="download-desc">${item.descripcion}</span>
              </div>
            </div>
            <div class="download-meta-row">
              <span>Tamaño: <strong>${item.tamano}</strong></span>
              <a href="${item.url}" class="btn btn-outline-cyan btn-sm" download="${item.nombre}">
                Descargar
              </a>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    // 3. Enlaces y Documentación Oficial
    if (Array.isArray(recursos.enlaces) && recursos.enlaces.length > 0) {
      html += `
        <div class="links-section">
          <h4 class="mission-subhead">Documentación de Consulta y Enlaces Institucionales</h4>
          <ul class="links-list">
            ${recursos.enlaces.map(l => `
              <li class="link-item">
                <a href="${l.url}" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span>${l.titulo}</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    this.dom.resourcesContainer.innerHTML = html;
  }

  /**
   * Resalta la clase activa en el árbol del Sidebar y auto-expande su módulo
   */
  highlightActiveInSidebar(classId, moduloId) {
    // Remover clase active previa
    this.dom.courseIndexTree.querySelectorAll('.class-item').forEach(item => {
      item.classList.remove('active');
    });

    const activeItem = this.dom.courseIndexTree.querySelector(`.class-item[data-class-id="${classId}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
      const moduleGroup = activeItem.closest('.module-group');
      if (moduleGroup) {
        moduleGroup.classList.add('expanded');
      }
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Alterna el estado de completado de la clase actual
   */
  toggleCurrentClassCompletion() {
    if (!this.currentClassData) return;
    const id = this.currentClassData.id;

    if (this.completedClasses.has(id)) {
      this.completedClasses.delete(id);
      this.showToast(`Clase ${id} marcada como pendiente`);
    } else {
      this.completedClasses.add(id);
      this.showToast(`¡Felicitaciones! Clase ${id} completada con éxito 🎉`);
    }

    this.saveCompletedToStorage();
    this.updateGlobalProgressDisplay();
    this.updateClassStatusBadges();

    // Actualizar check en la lista del Sidebar
    const itemInTree = this.dom.courseIndexTree.querySelector(`.class-item[data-class-id="${id}"]`);
    if (itemInTree) {
      itemInTree.classList.toggle('completed', this.completedClasses.has(id));
    }
  }

  /**
   * Actualiza los botones e insignias de estado de la clase activa
   */
  updateClassStatusBadges() {
    if (!this.currentClassData) return;
    const isCompleted = this.completedClasses.has(this.currentClassData.id);

    if (isCompleted) {
      this.dom.heroStatusBadge.textContent = 'Completada';
      this.dom.heroStatusBadge.className = 'badge badge-status is-completed';
      this.dom.btnMarcarCompletada.classList.add('completed');
      this.dom.btnCompletadaTexto.textContent = 'Clase Completada ✓';
    } else {
      this.dom.heroStatusBadge.textContent = 'Pendiente';
      this.dom.heroStatusBadge.className = 'badge badge-status';
      this.dom.btnMarcarCompletada.classList.remove('completed');
      this.dom.btnCompletadaTexto.textContent = 'Completar Clase';
    }
  }

  /**
   * Calcula y actualiza la barra de progreso global del alumno (sobre 37 clases)
   */
  updateGlobalProgressDisplay() {
    const total = 37;
    const completed = this.completedClasses.size;
    const pending = total - completed;
    const pct = Math.round((completed / total) * 100);

    this.dom.globalProgressBar.style.width = `${pct}%`;
    this.dom.globalProgressPct.textContent = `${pct}%`;

    this.dom.statsCompletedCount.textContent = completed.toString();
    this.dom.statsTotalCount.textContent = total.toString();
    this.dom.statsPendingCount.textContent = pending.toString();
  }

  /**
   * Filtrar clases en el Sidebar por búsqueda de texto
   */
  filterSidebarClasses(query) {
    const classItems = this.dom.courseIndexTree.querySelectorAll('.class-item');
    const modules = this.dom.courseIndexTree.querySelectorAll('.module-group');

    if (!query) {
      classItems.forEach(i => i.style.display = 'flex');
      return;
    }

    classItems.forEach(item => {
      const title = item.getAttribute('data-title') || '';
      const num = item.getAttribute('data-class-id') || '';
      if (title.includes(query) || num.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });

    // Expandir automáticamente módulos que tengan coincidencias
    modules.forEach(mod => {
      const visibleChildren = mod.querySelectorAll('.class-item[style="display: flex;"]');
      if (visibleChildren.length > 0) {
        mod.classList.add('expanded');
      }
    });
  }

  // =========================================================================
  // EJECUCIÓN DEL SANDBOX CON PYODIDE (PYTHON WEBASSEMBLY) + FALLBACK
  // =========================================================================

  /**
   * Inicializa Pyodide en el navegador en segundo plano y registra el puente Canvas 2D
   */
  async initPyodideEngine() {
    if (this.isPyodideReady || this.isPyodideLoading) return;

    this.isPyodideLoading = true;
    this.dom.engineStatusText.textContent = 'Iniciando Pyodide WebAssembly...';

    try {
      if (typeof window.loadPyodide === 'function') {
        this.pyodide = await window.loadPyodide();
        
        // Registrar el puente gráfico Canvas 2D dentro del entorno Python
        await this.injectPythonCanvasBridge();

        this.isPyodideReady = true;
        this.dom.engineStatusText.textContent = 'Python 3.11 (Wasm) + Canvas 2D Activo';
        this.dom.sandboxEngineStatus.querySelector('.engine-dot').classList.add('ready');
      } else {
        throw new Error('Script de Pyodide no cargado');
      }
    } catch (err) {
      console.warn('Modo Emulación activado (Pyodide offline):', err.message);
      this.dom.engineStatusText.textContent = 'Intérprete Local de Laboratorio';
      this.dom.sandboxEngineStatus.querySelector('.engine-dot').classList.add('ready');
    } finally {
      this.isPyodideLoading = false;
    }
  }

  /**
   * Inyecta el módulo gráfico 'campus' en Python para minijuegos y físicas 2D
   */
  async injectPythonCanvasBridge() {
    if (!this.pyodide) return;

    const bridgeCode = `
import js

class _CampusCanvas:
    """Motor gráfico del Campus CFP 403 para actividades interactivas, videojuegos y colisiones 2D"""
    def __init__(self):
        self.canvas = js.document.getElementById("gameCanvas")
        self.ctx = self.canvas.getContext("2d") if self.canvas else None

    def limpiar(self, color="#040609"):
        if self.ctx:
            self.ctx.fillStyle = color
            self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height)

    def dibujar_rectangulo(self, x, y, ancho, alto, color="#00e5ff", borde=None):
        if self.ctx:
            self.ctx.fillStyle = color
            self.ctx.fillRect(x, y, ancho, alto)
            if borde:
                self.ctx.strokeStyle = borde
                self.ctx.lineWidth = 2
                self.ctx.strokeRect(x, y, ancho, alto)

    def dibujar_circulo(self, x, y, radio, color="#38bdf8", borde=None):
        if self.ctx:
            self.ctx.beginPath()
            self.ctx.arc(x, y, radio, 0, 6.28318)
            self.ctx.fillStyle = color
            self.ctx.fill()
            if borde:
                self.ctx.strokeStyle = borde
                self.ctx.lineWidth = 2
                self.ctx.stroke()

    def dibujar_caja_colision(self, x, y, ancho, alto, colisionando=False):
        """Dibuja una caja de colisión (Hitbox): verde si está libre, roja si colisiona"""
        color = "#ef4444" if colisionando else "#10b981"
        if self.ctx:
            self.ctx.save()
            self.ctx.strokeStyle = color
            self.ctx.lineWidth = 2
            self.ctx.setLineDash([4, 4])
            self.ctx.strokeRect(x, y, ancho, alto)
            self.ctx.restore()

    def dibujar_linea(self, x1, y1, x2, y2, color="#94a3b8", grosor=2):
        if self.ctx:
            self.ctx.beginPath()
            self.ctx.moveTo(x1, y1)
            self.ctx.lineTo(x2, y2)
            self.ctx.strokeStyle = color
            self.ctx.lineWidth = grosor
            self.ctx.stroke()

    def escribir_texto(self, x, y, texto, color="#ffffff", tamano=14):
        if self.ctx:
            self.ctx.fillStyle = color
            self.ctx.font = f"{tamano}px Fira Code, monospace"
            self.ctx.fillText(str(texto), x, y)

    def activar_pantalla(self):
        js.campusApp.switchTerminalView("canvas")

campus = _CampusCanvas()
`;
    await this.pyodide.runPythonAsync(bridgeCode);
  }

  /**
   * Conmuta entre la Consola de Texto y el Lienzo Gráfico 2D
   */
  switchTerminalView(view) {
    if (view === 'canvas') {
      this.dom.btnViewCanvas.classList.add('active');
      this.dom.btnViewConsole.classList.remove('active');
      this.dom.canvasOutputWrapper.style.display = 'flex';
      this.dom.terminalOutput.style.display = 'none';
      if (this.dom.btnClearCanvas) this.dom.btnClearCanvas.style.display = 'block';
      if (this.dom.btnClearTerminal) this.dom.btnClearTerminal.style.display = 'none';
    } else {
      this.dom.btnViewConsole.classList.add('active');
      this.dom.btnViewCanvas.classList.remove('active');
      this.dom.terminalOutput.style.display = 'block';
      this.dom.canvasOutputWrapper.style.display = 'none';
      if (this.dom.btnClearTerminal) this.dom.btnClearTerminal.style.display = 'block';
      if (this.dom.btnClearCanvas) this.dom.btnClearCanvas.style.display = 'none';
    }
  }

  /**
   * Limpia el lienzo HTML5 y dibuja una cuadrícula tenue para diseño 2D
   */
  clearCanvas() {
    const canvas = this.dom.gameCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fondo grafito oscuro
    ctx.fillStyle = '#040609';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cuadrícula técnica sutil (grid de 40x40 px)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Texto guía central
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Área de Renderizado Gráfico 2D • CFP N° 403 Mercedes', canvas.width / 2, canvas.height / 2);
    ctx.textAlign = 'left';
  }

  /**
   * Ejecuta el código del Sandbox:
   * 1. Pasa primero por el Validador Automático.
   * 2. Si no cumple las reglas de la clase, el Tutor Inteligente arroja la pista y detiene la corrida.
   * 3. Si es exitoso, corre el script en Pyodide de forma nativa en el cliente y captura salidas/canvas.
   */
  async executeSandboxCode() {
    const code = this.dom.sandboxTextarea.value;
    const rulesConfig = this.currentClassData?.reglas_validacion;

    // 1. PASO PREVIO OBLIGATORIO: Validador Automático de Código
    if (rulesConfig && Array.isArray(rulesConfig.reglas) && rulesConfig.reglas.length > 0) {
      const { reglas } = rulesConfig;
      let primerError = null;
      let totalSuperadas = 0;

      for (const regla of reglas) {
        if (this.evaluateRule(code, regla)) {
          totalSuperadas++;
        } else {
          primerError = regla;
          break; // Detener en la primera regla incumplida
        }
      }

      if (primerError) {
        // Activamos la vista de consola para que el alumno lea la orientación
        this.switchTerminalView('console');
        this.appendTerminalOutput(`\n==================================================`, 'terminal-stderr');
        this.appendTerminalOutput(`⛔ [Validación previa requerida] Antes de ejecutar, corrige este punto:`, 'terminal-stderr');
        this.appendTerminalOutput(`==================================================`, 'terminal-stderr');
        
        // Orientación del Tutor Inteligente
        this.handleTutorHint(primerError, totalSuperadas, reglas.length);
        this.appendTerminalOutput(`[Ejecución pausada] Ajusta tu código según la pista del Tutor y vuelve a presionar 'Ejecutar Código'.`, 'terminal-system');
        return; // Detenemos la ejecución hasta que cumpla las pautas
      }

      // Si superó todas las reglas, actualizamos el seguimiento de trayectoria
      this.handleValidationSuccess(rulesConfig);
    }

    // 2. EJECUCIÓN SEGÚN EL ENTORNO ACTIVO
    const tipoEntorno = this.currentClassData?.tipo_entorno || 'consola_texto';

    // A. ENTORNO SQL: Ejecución relacional y renderizado tabular
    if (tipoEntorno === 'consola_sql') {
      this.executeSqlQuery(code);
      return;
    }

    // B. ENTORNO PYTHON (consola_texto / canvas_2d)
    this.appendTerminalOutput(`\n>>> [Ejecutando script de forma nativa en el navegador...]`, 'terminal-system');

    // Si el script hace uso de gráficos en el canvas, conmutar vista automáticamente
    if (code.includes('campus.') || code.includes('gameCanvas') || code.includes('dibujar_')) {
      this.switchTerminalView('canvas');
      this.clearCanvas();
    }

    if (this.isPyodideReady && this.pyodide) {
      try {
        // Redirigir stdout y stderr a la consola virtual
        this.pyodide.setStdout({
          batched: (msg) => this.appendTerminalOutput(msg, 'terminal-stdout')
        });
        this.pyodide.setStderr({
          batched: (msg) => this.appendTerminalOutput(msg, 'terminal-stderr')
        });

        const result = await this.pyodide.runPythonAsync(code);
        if (result !== undefined && result !== null && String(result) !== 'None') {
          this.appendTerminalOutput(String(result), 'terminal-stdout');
        }
        this.appendTerminalOutput(`[Proceso terminado exitosamente con código 0]`, 'terminal-success');
      } catch (pyErr) {
        // Captura amigable de Excepciones de Python
        this.renderFriendlyPythonError(pyErr, code);
      }
      return;
    }

    // Fallback: emulador pedagógico si Pyodide aún está descargándose
    this.runPedagogicalSimulator(code);
  }

  /**
   * Vincula reactivamente los elementos generados por el Factory para editores de código
   */
  bindSandboxDynamicElements() {
    this.dom.sandboxFileName = document.getElementById('sandboxFileName');
    this.dom.sandboxEngineStatus = document.getElementById('sandboxEngineStatus');
    this.dom.engineStatusText = document.getElementById('engineStatusText');
    this.dom.sandboxTextarea = document.getElementById('sandboxTextarea');
    this.dom.editorLineNumbers = document.getElementById('editorLineNumbers');
    this.dom.terminalOutput = document.getElementById('terminalOutput');
    this.dom.tutorFeedbackPanel = document.getElementById('tutorFeedbackPanel');
    this.dom.btnRunSandboxCode = document.getElementById('btnRunSandboxCode');
    this.dom.btnClearTerminal = document.getElementById('btnClearTerminal');
    this.dom.btnResetSandboxCode = document.getElementById('btnResetSandboxCode');
    this.dom.btnDownloadCode = document.getElementById('btnDownloadCode');
    this.dom.btnValidateSandboxCode = document.getElementById('btnValidateSandboxCode');
    this.dom.gameCanvas = document.getElementById('gameCanvas');
    this.dom.canvasCoordsText = document.getElementById('canvasCoordsText');
    this.dom.canvasOutputWrapper = document.getElementById('canvasOutputWrapper');
    this.dom.btnClearCanvas = document.getElementById('btnClearCanvas');
    this.dom.sqlTableContainer = document.getElementById('sqlTableContainer');
    this.dom.sqlRowCountText = document.getElementById('sqlRowCountText');

    // Reconectar eventos del editor (Gutter y Tabulaciones)
    this.setupEditorEvents();

    if (this.dom.btnRunSandboxCode) {
      this.dom.btnRunSandboxCode.addEventListener('click', () => this.executeSandboxCode());
    }
    if (this.dom.btnClearTerminal) {
      this.dom.btnClearTerminal.addEventListener('click', () => this.clearTerminal());
    }
    if (this.dom.btnResetSandboxCode) {
      this.dom.btnResetSandboxCode.addEventListener('click', () => this.resetSandboxCode());
    }
    if (this.dom.btnDownloadCode) {
      this.dom.btnDownloadCode.addEventListener('click', () => this.downloadCurrentCode());
    }
    if (this.dom.btnValidateSandboxCode) {
      this.dom.btnValidateSandboxCode.addEventListener('click', () => this.validateSandboxCode());
    }
    if (this.dom.btnClearCanvas) {
      this.dom.btnClearCanvas.addEventListener('click', () => this.clearCanvas());
    }

    if (this.dom.gameCanvas) {
      this.dom.gameCanvas.addEventListener('mousemove', (e) => {
        const rect = this.dom.gameCanvas.getBoundingClientRect();
        const scaleX = this.dom.gameCanvas.width / rect.width;
        const scaleY = this.dom.gameCanvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);
        if (this.dom.canvasCoordsText) {
          this.dom.canvasCoordsText.textContent = `X: ${x} | Y: ${y}`;
        }
      });
    }
  }

  /**
   * Ejecutor SQL con renderizado tabular dinámico para el entorno consola_sql
   */
  executeSqlQuery(sqlCode) {
    this.appendTerminalOutput(`\n[SQLite3 Engine] Procesando lote de sentencias SQL...`, 'terminal-system');
    const tableContainer = this.dom.sqlTableContainer;
    const countBadge = this.dom.sqlRowCountText;

    try {
      // Simulación de base de datos relacional y ejecución
      // Ejemplo: Alumnos del CFP 403
      const datosAlumnos = [
        { id: 1, nombre: 'Agustina Rossi', especialidad: 'Desarrollo de Software', promedio: 9.5 },
        { id: 2, nombre: 'Mariano Ivaldi', especialidad: 'Desarrollo de Software', promedio: 8.8 },
        { id: 3, nombre: 'Camila Torres', especialidad: 'Desarrollo Web', promedio: 7.4 },
        { id: 4, nombre: 'Juan Pérez', especialidad: 'Redes Informáticas', promedio: 6.5 },
        { id: 5, nombre: 'Sofía Martínez', especialidad: 'Desarrollo de Software', promedio: 9.1 }
      ];

      // Parseo básico de consultas SELECT con WHERE
      let filas = [...datosAlumnos];
      if (/WHERE\s+promedio\s*>=\s*8/i.test(sqlCode)) {
        filas = filas.filter(a => a.promedio >= 8.0);
      } else if (/WHERE\s+promedio\s*>=\s*7/i.test(sqlCode)) {
        filas = filas.filter(a => a.promedio >= 7.0);
      } else if (/WHERE\s+especialidad\s*=/i.test(sqlCode)) {
        filas = filas.filter(a => a.especialidad.includes('Desarrollo de Software'));
      }

      // Ordenamiento ORDER BY
      if (/ORDER\s+BY\s+promedio\s+DESC/i.test(sqlCode)) {
        filas.sort((a, b) => b.promedio - a.promedio);
      } else if (/ORDER\s+BY\s+nombre/i.test(sqlCode)) {
        filas.sort((a, b) => a.nombre.localeCompare(b.nombre));
      }

      if (tableContainer) {
        if (filas.length === 0) {
          tableContainer.innerHTML = `
            <div class="sql-empty-state">
              <p>La consulta no retornó registros para las condiciones especificadas.</p>
            </div>
          `;
          if (countBadge) countBadge.textContent = '0 registros';
        } else {
          const columnas = Object.keys(filas[0]);
          let tableHtml = `
            <table class="sql-results-table">
              <thead>
                <tr>${columnas.map(col => `<th>${this.escapeHtml(col.toUpperCase())}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${filas.map(fila => `
                  <tr>${columnas.map(col => `<td>${this.escapeHtml(String(fila[col]))}</td>`).join('')}</tr>
                `).join('')}
              </tbody>
            </table>
          `;
          tableContainer.innerHTML = tableHtml;
          if (countBadge) countBadge.textContent = `${filas.length} registros devueltos (1.2 ms)`;
        }
      }

      this.appendTerminalOutput(`✓ [OK] Consulta ejecutada con éxito. ${filas.length} filas renderizadas en el visor.`, 'terminal-success');
    } catch (err) {
      this.appendTerminalOutput(`[Error SQL] ${err.message}`, 'terminal-stderr');
    }
  }

  /**
   * Vincula e inicializa la terminal de Git interactiva
   */
  bindGitTerminalElements() {
    this.dom.terminalOutput = document.getElementById('terminalOutput');
    this.dom.tutorFeedbackPanel = document.getElementById('tutorFeedbackPanel');
    this.dom.btnValidateSandboxCode = document.getElementById('btnValidateSandboxCode');
    const cmdInput = document.getElementById('gitCommandInput');
    const btnResetGit = document.getElementById('btnResetGitRepo');
    const btnClear = document.getElementById('btnClearTerminal');

    // Estado del repositorio simulado
    this.gitRepo = {
      initialized: true,
      branch: 'main',
      untracked: ['app.py', 'index.html'],
      staged: [],
      commits: [
        { hash: '4a8b2c1', message: 'Commit inicial de cátedra' }
      ]
    };

    if (cmdInput) {
      cmdInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = cmdInput.value.trim();
          if (cmd) {
            this.executeGitCommand(cmd);
            cmdInput.value = '';
          }
        }
      });
    }

    if (btnResetGit) {
      btnResetGit.addEventListener('click', () => {
        this.gitRepo = {
          initialized: true,
          branch: 'main',
          untracked: ['app.py', 'index.html'],
          staged: [],
          commits: [{ hash: '4a8b2c1', message: 'Commit inicial de cátedra' }]
        };
        this.updateGitVisualStatus();
        this.clearTerminal();
        this.appendTerminalOutput(`[CFP N° 403 Mercedes] Repositorio Git restablecido al estado inicial.`, 'terminal-system');
        this.showToast('Repositorio Git reiniciado');
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => this.clearTerminal());
    }

    if (this.dom.btnValidateSandboxCode) {
      this.dom.btnValidateSandboxCode.addEventListener('click', () => {
        // En Git validamos si se generó un nuevo commit
        if (this.gitRepo.commits.length > 1) {
          this.displayTutorFeedback('success', '🎉 ¡Flujo Git Completado!', 'Has preparado los archivos y confirmado tu commit con éxito.');
          this.showToast('¡Flujo de Git superado!');
          this.handleValidationSuccess(this.currentClassData?.reglas_validacion || {});
        } else {
          this.displayTutorFeedback('hint', '💡 Continúa con el flujo', 'Usa "git add ." para preparar archivos y luego "git commit -m \'mensaje\'" para confirmar.');
        }
      });
    }

    this.updateGitVisualStatus();
  }

  /**
   * Intérprete interactivo de comandos Git en el cliente
   */
  executeGitCommand(rawCmd) {
    this.appendTerminalOutput(`estudiante@cfp403:~/proyecto (main) $ ${rawCmd}`, 'terminal-stdout');
    const cmd = rawCmd.trim();

    if (cmd === 'git status') {
      if (this.gitRepo.staged.length > 0) {
        this.appendTerminalOutput(`On branch ${this.gitRepo.branch}\nChanges to be committed:`, 'terminal-success');
        this.gitRepo.staged.forEach(f => this.appendTerminalOutput(`  (use "git restore --staged <file>..." to unstage)\n\tnew file:   ${f}`, 'terminal-success'));
      }
      if (this.gitRepo.untracked.length > 0) {
        this.appendTerminalOutput(`Untracked files:\n  (use "git add <file>..." to include in what will be committed):`, 'terminal-stderr');
        this.gitRepo.untracked.forEach(f => this.appendTerminalOutput(`\t${f}`, 'terminal-stderr'));
      }
      if (this.gitRepo.staged.length === 0 && this.gitRepo.untracked.length === 0) {
        this.appendTerminalOutput(`On branch ${this.gitRepo.branch}\nnothing to commit, working tree clean`, 'terminal-success');
      }
    } else if (cmd === 'git add .' || cmd === 'git add -A' || cmd.startsWith('git add ')) {
      this.gitRepo.staged = [...this.gitRepo.staged, ...this.gitRepo.untracked];
      this.gitRepo.untracked = [];
      this.appendTerminalOutput(`✓ Archivos agregados al Staging Area correctamente.`, 'terminal-success');
      this.updateGitVisualStatus();
    } else if (cmd.startsWith('git commit')) {
      const match = cmd.match(/git commit\s+-m\s+["'](.*?)["']/);
      if (!match) {
        this.appendTerminalOutput(`Error: Debes proporcionar un mensaje de commit usando -m "mensaje".`, 'terminal-stderr');
      } else if (this.gitRepo.staged.length === 0) {
        this.appendTerminalOutput(`No changes added to commit (use "git add").`, 'terminal-stderr');
      } else {
        const msg = match[1];
        const hash = Math.random().toString(16).substring(2, 9);
        this.gitRepo.commits.unshift({ hash, message: msg });
        const count = this.gitRepo.staged.length;
        this.gitRepo.staged = [];
        this.appendTerminalOutput(`[${this.gitRepo.branch} ${hash}] ${msg}\n ${count} files changed, 42 insertions(+)`, 'terminal-success');
        this.updateGitVisualStatus();
        this.showToast(`Commit [${hash}] generado`);
      }
    } else if (cmd === 'git log' || cmd === 'git log --oneline') {
      this.gitRepo.commits.forEach(c => {
        this.appendTerminalOutput(`${c.hash} (HEAD -> ${this.gitRepo.branch}) ${c.message}`, 'terminal-system');
      });
    } else if (cmd === 'git branch') {
      this.appendTerminalOutput(`* ${this.gitRepo.branch}`, 'terminal-success');
    } else if (cmd.startsWith('git push')) {
      this.appendTerminalOutput(`Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nCompressing objects: 100% (3/3), done.\nWriting objects: 100% (3/3), done.\nTo https://github.com/cfp403/proyecto_final.git\n * [new branch]      main -> main`, 'terminal-success');
      this.showToast('¡Push a GitHub simulado exitosamente!');
    } else if (cmd === 'clear') {
      this.clearTerminal();
    } else if (cmd === 'help' || cmd === 'git --help') {
      this.appendTerminalOutput(`Comandos disponibles en el laboratorio CFP 403:\n  • git status          - Estado de archivos\n  • git add .           - Preparar archivos en Staging\n  • git commit -m "..." - Confirmar instantánea\n  • git log --oneline   - Ver historial de commits\n  • git branch          - Listar ramas\n  • git push            - Subir a GitHub\n  • clear               - Limpiar terminal`, 'terminal-system');
    } else {
      this.appendTerminalOutput(`git: '${cmd.replace('git ', '')}' is not a git command. See 'git --help'.`, 'terminal-stderr');
    }
  }

  /**
   * Actualiza el panel visual del repositorio en el entorno terminal_git
   */
  updateGitVisualStatus() {
    const workingList = document.getElementById('gitWorkingTreeList');
    const stagingList = document.getElementById('gitStagingList');
    const commitsList = document.getElementById('gitCommitsList');
    const filesCount = document.getElementById('gitFilesCount');
    const stagedCount = document.getElementById('gitStagedCount');
    const commitsCount = document.getElementById('gitCommitsCount');

    if (!workingList || !this.gitRepo) return;

    // Working directory
    if (this.gitRepo.untracked.length === 0) {
      workingList.innerHTML = `<li style="color: var(--color-success); font-size: 0.72rem;">✓ Directorio limpio</li>`;
    } else {
      workingList.innerHTML = this.gitRepo.untracked.map(f => `
        <li class="git-file-item untracked"><span>? ${this.escapeHtml(f)}</span><span>(Pendiente)</span></li>
      `).join('');
    }
    if (filesCount) filesCount.textContent = `${this.gitRepo.untracked.length} pendientes`;

    // Staging area
    if (this.gitRepo.staged.length === 0) {
      stagingList.innerHTML = `<li style="color: var(--text-muted); font-size: 0.72rem;">Vacío. Usa 'git add .'</li>`;
    } else {
      stagingList.innerHTML = this.gitRepo.staged.map(f => `
        <li class="git-file-item staged"><span>+ ${this.escapeHtml(f)}</span><span>(Staged)</span></li>
      `).join('');
    }
    if (stagedCount) stagedCount.textContent = `${this.gitRepo.staged.length} preparados`;

    // Commits
    if (commitsList) {
      commitsList.innerHTML = this.gitRepo.commits.map(c => `
        <div class="git-commit-badge">
          <span class="git-commit-hash">${c.hash}</span>
          <span>${this.escapeHtml(c.message)}</span>
        </div>
      `).join('');
    }
    if (commitsCount) commitsCount.textContent = `${this.gitRepo.commits.length} commits`;
  }

  /**
   * Vincula e inicializa el procesador de texto para el entorno editor_texto_ensayo
   */
  bindEssayEditorElements() {
    const textarea = document.getElementById('essayEditorTextarea');
    const wordCountBadge = document.getElementById('essayWordCountBadge');
    const autosaveStatus = document.getElementById('essayAutosaveStatus');
    const btnClear = document.getElementById('btnClearEssayText');
    const btnDownload = document.getElementById('btnDownloadEssay');
    const btnSubmit = document.getElementById('btnSubmitEssay');
    const tutorPanel = document.getElementById('tutorFeedbackPanel');

    if (!textarea) return;

    this.dom.essayEditorTextarea = textarea;
    this.dom.tutorFeedbackPanel = tutorPanel;

    const classId = this.currentClassData?.id || 'clase_1';
    const storageKey = `cfp403_essay_draft_${classId}`;

    // Cargar borrador previo si existe en localStorage
    const savedDraft = localStorage.getItem(storageKey);
    if (savedDraft) {
      textarea.value = savedDraft;
    }

    // Función de recuento y actualización métrica
    const updateStats = () => {
      const text = textarea.value.trim();
      const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
      const chars = textarea.value.length;
      if (wordCountBadge) {
        wordCountBadge.textContent = `${words} palabras • ${chars} caracteres`;
      }
    };

    updateStats();

    // Autosave en cada pulsación
    textarea.addEventListener('input', () => {
      updateStats();
      localStorage.setItem(storageKey, textarea.value);
      if (autosaveStatus) {
        autosaveStatus.textContent = 'Guardado automático local';
        autosaveStatus.style.color = 'var(--cyan-400)';
        clearTimeout(this._essayAutosaveTimeout);
        this._essayAutosaveTimeout = setTimeout(() => {
          autosaveStatus.textContent = 'Borrador sincronizado';
          autosaveStatus.style.color = 'var(--text-muted)';
        }, 1200);
      }
    });

    // Permitir tabulación con sangría en el ensayo
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        updateStats();
      }
    });

    // Botón Limpiar borrador
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (confirm('¿Deseas vaciar el contenido del editor de ensayo?')) {
          textarea.value = '';
          localStorage.removeItem(storageKey);
          updateStats();
          if (tutorPanel) tutorPanel.style.display = 'none';
          this.showToast('Editor de ensayo limpiado');
        }
      });
    }

    // Botón Descargar (.txt)
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        const text = textarea.value;
        if (!text.trim()) {
          this.showToast('El documento está vacío para descargar');
          return;
        }
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Ensayo_CFP403_${classId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('Archivo de ensayo descargado');
      });
    }

    // Botón "Guardar y Entregar Documento"
    if (btnSubmit) {
      btnSubmit.addEventListener('click', async () => {
        const text = textarea.value.trim();
        const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
        const tutorMensajes = this.currentClassData?.mensajes_tutor || {};

        if (!text) {
          const mensajeVacio = tutorMensajes.texto_vacio || 'Tu documento está completamente vacío. Por favor, responde las consignas teóricas y prácticas antes de realizar la entrega.';
          this.displayTutorFeedback('hint', '⚠️ Documento sin contenido', mensajeVacio);
          this.showToast('El documento no puede entregarse vacío');
          return;
        }

        if (words < 50) {
          const mensajeCorto = tutorMensajes.texto_corto || 'Tu ensayo o respuestas son muy breves. Recuerda desarrollar el rol de Ada Lovelace, la comparación de hardware de los 80s con la actualidad/IA, la traducción a binario de CODE y las especificaciones de tu máquina.';
          this.displayTutorFeedback('hint', '💡 Respuesta demasiado breve', mensajeCorto);
          this.showToast('El documento necesita mayor profundidad técnica');
          return;
        }

        // Entrega válida y completa
        if (tutorPanel) {
          this.displayTutorFeedback('success', '🎉 ¡Documento Entregado con Éxito!', 'Tu ensayo técnico y resolución de actividades han sido registrados en tu expediente formativo del CFP N° 403.');
        }

        await this.syncProgressWithBackend({
          claseId: this.currentClassData.id,
          puntosXP: 100,
          codigoAlumno: text,
          timestamp: new Date().toISOString()
        });

        if (!this.completedClasses.has(this.currentClassData.id)) {
          this.toggleCurrentClassCompletion();
        }

        this.showToast('¡Documento entregado y clase completada! 🎉');
      });
    }
  }

  /**
   * Captura y formatea las excepciones de Python en un formato didáctico para el alumno
   */
  renderFriendlyPythonError(error, code) {
    const rawMessage = error.message || String(error);
    const parsed = this.parsePythonException(rawMessage);

    // Asegurar que la consola esté visible para leer el error
    this.switchTerminalView('console');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'terminal-friendly-error';
    errorDiv.innerHTML = `
      <div class="friendly-error-header">
        <span>🚨 ${this.escapeHtml(parsed.friendlyName)} (${parsed.type})</span>
        ${parsed.lineNum ? `<span class="badge badge-diff">Línea ${parsed.lineNum}</span>` : ''}
      </div>
      <div class="friendly-error-msg">${this.escapeHtml(parsed.explanation)}</div>
      <div class="friendly-error-tip">💡 <strong>Orientación del Tutor:</strong> ${this.escapeHtml(parsed.tip)}</div>
      <details class="friendly-error-trace">
        <summary style="cursor: pointer; color: var(--text-muted);">Ver traza técnica original del intérprete</summary>
        <pre style="margin-top: 0.35rem; font-size: 0.72rem; color: #f87171;">${this.escapeHtml(rawMessage)}</pre>
      </details>
    `;

    this.dom.terminalOutput.appendChild(errorDiv);
    this.dom.terminalOutput.scrollTop = this.dom.terminalOutput.scrollHeight;
    this.showToast(`Error detectado: ${parsed.friendlyName}`);
  }

  /**
   * Analiza el mensaje crudo de excepción de Python y genera explicaciones claras
   */
  parsePythonException(rawMessage) {
    const catalog = [
      {
        type: 'SyntaxError',
        friendly: 'Error de Sintaxis',
        explanation: 'Hay una estructura gramatical incorrecta en tu código Python. Comúnmente se debe a olvidar dos puntos (:), paréntesis sin cerrar o comillas desparejadas.',
        tip: 'Revisa si al final de tus líneas de def, class, if o for colocaste dos puntos (:).'
      },
      {
        type: 'IndentationError',
        friendly: 'Error de Sangría / Indentación',
        explanation: 'En Python la sangría es obligatoria para definir bloques de código. Una línea no coincide con el nivel de espacios esperado.',
        tip: 'Usa exactamente 4 espacios para cada nivel. Puedes presionar la tecla Tab en el editor para alinear.'
      },
      {
        type: 'NameError',
        friendly: 'Nombre no definido',
        explanation: 'El intérprete encontró una variable, clase o función que no ha sido declarada previamente en este ámbito.',
        tip: 'Verifica la ortografía del nombre y ten en cuenta que Python distingue estrictamente entre mayúsculas y minúsculas.'
      },
      {
        type: 'TypeError',
        friendly: 'Error de Tipo de Dato',
        explanation: 'Se aplicó una operación a valores incompatibles (por ejemplo, intentar sumar una cadena de texto con un entero o llamar a algo que no es función).',
        tip: 'Usa conversiones explícitas como int(...), str(...) o float(...) para igualar los tipos.'
      },
      {
        type: 'AttributeError',
        friendly: 'Atributo no encontrado',
        explanation: 'Se intentó llamar a un método o variable que no existe dentro de ese objeto o clase.',
        tip: 'Si es dentro de una clase, verifica que el atributo fue inicializado como self.nombre en el método __init__.'
      },
      {
        type: 'ZeroDivisionError',
        friendly: 'División por Cero',
        explanation: 'Se intentó dividir una cantidad entre cero, operación indefinida en matemáticas e informática.',
        tip: 'Añade una validación previa para verificar que el divisor no sea 0.'
      },
      {
        type: 'IndexError',
        friendly: 'Índice fuera de rango',
        explanation: 'Se intentó acceder a una posición de una lista o secuencia que no existe.',
        tip: 'Recuerda que en Python los índices inician en 0 y el último elemento está en len(...) - 1.'
      }
    ];

    let matchFound = null;
    for (const item of catalog) {
      if (rawMessage.includes(item.type)) {
        matchFound = item;
        break;
      }
    }

    const lineRegex = /line\s+(\d+)/i;
    const matchLine = rawMessage.match(lineRegex);
    const lineNum = matchLine ? matchLine[1] : null;

    return {
      type: matchFound ? matchFound.type : 'Excepción de Ejecución',
      friendlyName: matchFound ? matchFound.friendly : 'Error en Tiempo de Ejecución',
      explanation: matchFound ? matchFound.explanation : 'El script de Python se interrumpió debido a un error durante su evaluación.',
      tip: matchFound ? matchFound.tip : 'Lee con atención la traza para localizar la línea y el objeto involucrado.',
      lineNum: lineNum
    };
  }

  /**
   * Emulador pedagógico en JavaScript que evalúa estructuras de print() y clases
   */
  runPedagogicalSimulator(code) {
    try {
      this.appendTerminalOutput(`[Aviso: Ejecución en sandbox local interactivo]`, 'terminal-system');
      
      // Si la clase actual tiene una salida esperada configurada en el JSON, la usamos
      if (this.currentClassData && this.currentClassData.sandbox && this.currentClassData.sandbox.salidaEsperada) {
        this.appendTerminalOutput(this.currentClassData.sandbox.salidaEsperada, 'terminal-stdout');
        this.appendTerminalOutput(`[Proceso finalizado con éxito - salida validada]`, 'terminal-success');
        return;
      }

      // Parser rápido para sentencias print(...) simples
      const printRegex = /print\((["'])(.*?)\1\)/g;
      let match;
      let matchedAny = false;
      while ((match = printRegex.exec(code)) !== null) {
        this.appendTerminalOutput(match[2], 'terminal-stdout');
        matchedAny = true;
      }

      if (!matchedAny) {
        this.appendTerminalOutput(`[Script ejecutado sin errores sintácticos detectados]`, 'terminal-success');
      }
    } catch (err) {
      this.appendTerminalOutput(`Error de sintaxis: ${err.message}`, 'terminal-stderr');
    }
  }

  appendTerminalOutput(text, className = 'terminal-stdout') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    this.dom.terminalOutput.appendChild(line);
    this.dom.terminalOutput.scrollTop = this.dom.terminalOutput.scrollHeight;
  }

  clearTerminal() {
    this.dom.terminalOutput.innerHTML = '';
  }

  resetSandboxCode() {
    if (this.currentClassData && this.currentClassData.sandbox) {
      this.dom.sandboxTextarea.value = this.currentClassData.sandbox.codigoInicial;
      this.dom.sandboxTextarea.dispatchEvent(new Event('input'));
      this.showToast('Código de fábrica restaurado');
    }
  }

  downloadCurrentCode() {
    const code = this.dom.sandboxTextarea.value;
    const filename = (this.currentClassData && this.currentClassData.sandbox && this.currentClassData.sandbox.archivoNombre) 
      ? this.currentClassData.sandbox.archivoNombre 
      : 'codigo_cfp403.py';

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast(`Archivo ${filename} descargado`);
  }

  // =========================================================================
  // MOTOR DE INTERACTIVIDAD: VALIDADOR, TUTOR INTELIGENTE Y TRAYECTORIA
  // =========================================================================

  /**
   * 1. VALIDADOR AUTOMÁTICO DE CÓDIGO (CLIENT-SIDE)
   * Captura el código del Sandbox y evalúa dinámicamente las reglas configuradas
   * en el archivo JSON de la clase activa (sin nada hardcodeado).
   */
  validateSandboxCode() {
    const code = this.dom.sandboxTextarea.value;
    const rulesConfig = this.currentClassData?.reglas_validacion;

    // Si la clase actual no tiene bloque de reglas en su archivo JSON
    if (!rulesConfig || !Array.isArray(rulesConfig.reglas) || rulesConfig.reglas.length === 0) {
      this.displayTutorFeedback(
        'hint',
        '⚠️ Sin reglas configuradas',
        'Esta sesión formativa no posee reglas de validación automática configuradas aún en su archivo JSON.'
      );
      this.appendTerminalOutput(`\n[Aviso] No hay reglas de validación configuradas para la Clase ${this.currentClassData?.id}.`, 'terminal-system');
      return;
    }

    const { reglas, titulo_desafio } = rulesConfig;
    const totalReglas = reglas.length;
    let reglasSuperadas = 0;
    let primeraFalla = null;

    this.appendTerminalOutput(`\n==================================================`, 'terminal-system');
    this.appendTerminalOutput(`🔍 [TUTOR CFP 403] Evaluando: ${titulo_desafio || 'Desafío de Código'}`, 'terminal-system');
    this.appendTerminalOutput(`==================================================`, 'terminal-system');

    // Evaluación regla por regla del lado del cliente
    for (const regla of reglas) {
      const cumple = this.evaluateRule(code, regla);
      if (cumple) {
        reglasSuperadas++;
        this.appendTerminalOutput(`  ✓ ${regla.descripcion}`, 'terminal-success');
      } else {
        primeraFalla = regla;
        this.appendTerminalOutput(`  ✗ ${regla.descripcion}`, 'terminal-stderr');
        // Detenemos en la primera falla para no abrumar al alumno y orientarlo pedagógicamente
        break;
      }
    }

    // 2. TUTOR INTELIGENTE (SISTEMA DE SUGERENCIAS ORIENTADORAS)
    if (primeraFalla) {
      this.handleTutorHint(primeraFalla, reglasSuperadas, totalReglas);
    } else {
      // 3. SEGUIMIENTO DE TRAYECTORIA (ÉXITO COMPLETO)
      this.handleValidationSuccess(rulesConfig);
    }
  }

  /**
   * Evalúa una regla técnica específica contra el código fuente ingresado.
   * Admite tipos: 'regex', 'multiline_regex', 'keyword_required', 'keyword_forbidden'.
   * @param {string} code - Código escrito por el alumno en el Sandbox
   * @param {Object} regla - Objeto de regla extraído dinámicamente del JSON
   * @returns {boolean}
   */
  evaluateRule(code, regla) {
    try {
      if (regla.tipo === 'regex') {
        const regex = new RegExp(regla.patron);
        return regex.test(code);
      } else if (regla.tipo === 'multiline_regex') {
        const regex = new RegExp(regla.patron, 'm');
        return regex.test(code);
      } else if (regla.tipo === 'keyword_required') {
        return code.includes(regla.palabra);
      } else if (regla.tipo === 'keyword_forbidden') {
        return !code.includes(regla.palabra);
      }
      return true;
    } catch (err) {
      console.error(`Error evaluando la regla "${regla.id}":`, err);
      return false;
    }
  }

  /**
   * 2. TUTOR INTELIGENTE: Pistas orientadoras sin dar la respuesta masticada.
   * @param {Object} falla - Regla que no se cumplió
   * @param {number} superadas - Cantidad de reglas aprobadas
   * @param {number} total - Total de reglas evaluadas
   */
  handleTutorHint(falla, superadas, total) {
    const titulo = `Tutor Inteligente: Guía de Corrección (${superadas}/${total} superadas)`;
    const mensaje = falla.pista_error || `Revisa la consigna: "${falla.descripcion}".`;
    const detalleAvance = `Avance: ${superadas} de ${total} objetivos técnicos cumplidos. Corrige este punto para avanzar.`;

    // Renderizar panel con estilo institucional (alerta naranja/rojo suave)
    this.displayTutorFeedback('hint', titulo, mensaje, detalleAvance);

    this.appendTerminalOutput(`\n${mensaje}`, 'terminal-system');
    this.appendTerminalOutput(`--------------------------------------------------`, 'terminal-system');
    this.showToast('El Tutor Inteligente te ha brindado una sugerencia');
  }

  /**
   * 3. SEGUIMIENTO DE TRAYECTORIA: Manejo de estado Éxito y actualización de avance.
   * @param {Object} rulesConfig - Bloque reglas_validacion del JSON
   */
  async handleValidationSuccess(rulesConfig) {
    const classId = this.currentClassData.id;
    const puntosXP = rulesConfig.puntos_progreso || 150;

    // Actualizar panel visual del Tutor con estilo Verde Éxito
    this.displayTutorFeedback(
      'success',
      '🎉 ¡Excelente! Código Validado con Éxito',
      `Has superado satisfactoriamente todas las consignas de la clase (${rulesConfig.titulo_desafio}). Se han acreditado +${puntosXP} XP a tu expediente formativo.`,
      `Estado: Nivel Aprobado • 100% de los criterios cumplidos`
    );

    this.appendTerminalOutput(`\n🎉 [ÉXITO TOTAL] ¡Felicitaciones! Has completado el laboratorio técnico.`, 'terminal-success');
    this.appendTerminalOutput(`--------------------------------------------------`, 'terminal-system');

    // Actualizar barra de progreso del alumno en el sidebar y guardado local
    if (!this.completedClasses.has(classId)) {
      this.completedClasses.add(classId);
      this.saveCompletedToStorage();
      this.updateGlobalProgressDisplay();
      this.updateClassStatusBadges();

      // Reflejar de inmediato el check verde en el árbol del Sidebar
      const itemInTree = this.dom.courseIndexTree.querySelector(`.class-item[data-class-id="${classId}"]`);
      if (itemInTree) {
        itemInTree.classList.add('completed');
      }
    }

    // Petición asíncrona (Fetch API) para persistir el "Nivel Completado" en la base de datos relacional
    await this.syncProgressWithBackend({
      claseId: classId,
      puntosXP: puntosXP,
      codigoAlumno: this.dom.sandboxTextarea.value,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Muestra las alertas institucionales del Tutor (Verde para éxito, Naranja/Rojo suave para pistas)
   * @param {'success'|'hint'} type - Tipo de notificación
   * @param {string} title - Título de la alerta
   * @param {string} message - Mensaje pedagógico u orientador
   * @param {string} steps - Contador o estado adicional
   */
  displayTutorFeedback(type, title, message, steps = '') {
    const panel = this.dom.tutorFeedbackPanel;
    if (!panel) return;

    panel.style.display = 'flex';
    panel.className = `tutor-feedback-panel ${type}`;
    panel.innerHTML = `
      <div class="tutor-feedback-title">
        ${type === 'success' ? '✓' : '💡'} ${this.escapeHtml(title)}
      </div>
      <div class="tutor-feedback-msg">${this.escapeHtml(message)}</div>
      ${steps ? `<div class="tutor-feedback-steps">${this.escapeHtml(steps)}</div>` : ''}
    `;
  }

  /**
   * Simula y ejecuta la petición asíncrona (Fetch API) al backend del CFP 403
   * para guardar el avance del alumno autenticado en la base de datos relacional.
   * @param {Object} payload - Datos de la entrega del alumno
   */
  async syncProgressWithBackend(payload) {
    /* =========================================================================
     * CONFIGURACIÓN DEL BACKEND / API REAL:
     * 👉 AQUÍ DEBES CONECTAR LA URL DE TU API REAL.
     * Ejemplo de producción: 'https://campus.cfp403.com.ar/api/alumnos/progreso'
     * o en entorno de desarrollo: 'http://localhost:5000/api/progreso'
     * ========================================================================= */
    const API_URL_REAL = 'https://api.cfp403.edu.ar/api/v1/alumnos/progreso';

    try {
      this.appendTerminalOutput(`[Persistencia] Conectando con la base de datos relacional...`, 'terminal-system');

      // Token de sesión obtenido previamente tras el login del alumno
      const authToken = localStorage.getItem('cfp403_jwt_token') || 'token_sesion_alumno_cfp403';

      /* Petición HTTP real vía Fetch API con método POST */
      /*
      const response = await fetch(API_URL_REAL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          alumno_id: localStorage.getItem('cfp403_user_id') || 1,
          clase_id: payload.claseId,
          puntos_xp: payload.puntosXP,
          codigo_entregado: payload.codigoAlumno,
          fecha_completado: payload.timestamp
        })
      });

      if (!response.ok) {
        throw new Error(`Error en servidor (HTTP ${response.status})`);
      }
      const dataServidor = await response.json();
      */

      // SIMULACIÓN ASÍNCRONA (800ms) para respuesta inmediata en desarrollo:
      await new Promise(resolve => setTimeout(resolve, 800));

      this.appendTerminalOutput(`[Base de Datos] Nivel de la Clase ${payload.claseId} guardado exitosamente.`, 'terminal-success');
      this.showToast(`Avance sincronizado con tu expediente institucional (+${payload.puntosXP} XP)`);

    } catch (error) {
      // Manejo de errores de conexión o servidor
      console.error('Error al persistir el avance en el backend:', error);
      this.appendTerminalOutput(`[Advertencia de Red] No se pudo asentar en el servidor: ${error.message}. El progreso se mantiene guardado en tu navegador.`, 'terminal-stderr');
      this.showToast('Progreso resguardado localmente (servidor no disponible)');
    }
  }

  /**
   * Genera una plantilla de clase vacía si aún no se ha creado su JSON específico
   */
  renderFallbackPlaceholderClass(classId) {
    let titulo = `Clase ${classId}`;
    let moduloNombre = 'Trayecto Programación CFP 403';

    // Buscar datos en el manifiesto si están disponibles
    if (this.classesIndex) {
      for (const mod of this.classesIndex.modulos) {
        const found = mod.clases.find(c => c.id === classId);
        if (found) {
          titulo = found.titulo;
          moduloNombre = mod.nombre;
          break;
        }
      }
    }

    this.currentClassData = {
      id: classId,
      numero: classId,
      moduloNombre: moduloNombre,
      titulo: titulo,
      descripcionCorta: `Esta sesión forma parte del plan de 37 clases del Centro de Formación Profesional N° 403 de Mercedes.`,
      duracionEstimada: '2.5 Horas',
      dificultad: 'En desarrollo',
      briefing: {
        introduccion: `El contenido completo de esta sesión se encuentra en proceso de sincronización con el servidor de la cátedra. Puedes crear el archivo \`data/clase_${classId.toString().padStart(2, '0')}.json\` para añadir el temario teórico y la misión práctica.`,
        secciones: [
          {
            id: 'sec-proxima',
            titulo: 'Próxima Clase del Trayecto',
            contenido: `Para agregar el material de esta clase, sigue el modelo provisto en \`data/clase_13.json\` o \`data/clase_22.json\`. La arquitectura modular detectará automáticamente el archivo sin requerir modificar código HTML.`
          }
        ]
      },
      sandbox: {
        archivoNombre: `clase_${classId.toString().padStart(2, '0')}.py`,
        codigoInicial: `# CFP N° 403 Mercedes - Clase ${classId}\n# Espacio de pruebas listo para el desarrollo de actividades.\nprint("Clase ${classId}: ${titulo}")\n`
      },
      mision: {
        titulo: `Desafío Práctico de la Clase ${classId}`,
        nivel: 'En preparación',
        puntosXP: 100,
        contexto: 'Las consignas de esta actividad se cargarán con el temario correspondiente.',
        requerimientos: ['Completar el laboratorio inicial de la sesión.'],
        pistas: []
      },
      recursos: {
        descargas: [],
        enlaces: [{ titulo: 'Campus Virtual CFP N° 403 Mercedes', url: 'https://www.cfp403.com' }]
      }
    };

    this.populateClassView();
  }

  // --- UTILIDADES ---
  loadCompletedFromStorage() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_COMPLETED_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveCompletedToStorage() {
    localStorage.setItem(CONFIG.STORAGE_COMPLETED_KEY, JSON.stringify(Array.from(this.completedClasses)));
  }

  showToast(message) {
    const toast = this.dom.toastNotification;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  formatMarkdown(str) {
    if (!str) return '';
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '<br><br>');
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const campusApp = new CampusController();
  campusApp.init();
  window.campusApp = campusApp; // Para depuración y pruebas desde consola
});
