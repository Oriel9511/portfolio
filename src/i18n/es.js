// Base language. English (./en/*) only overrides the translatable text and inherits everything else.
const es = {
  ui: {
    nav: {
      skip: 'Saltar al contenido',
      primary: 'Principal',
      goHome: 'Ir al inicio',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      menu: 'Navegación',
      sections: 'Secciones',
      home: 'Inicio',
      work: 'Experiencia',
      opensource: 'Labs',
      about: 'Perfil',
      contact: 'Contacto',
    },
    rail: {
      hero: 'Inicio',
      quote1: 'Visión',
      work: 'Experiencia',
      quote2: 'Filosofía',
      opensource: 'Labs',
      about: 'Perfil',
      contact: 'Contacto',
    },
    language: { label: 'Idioma', es: 'Español', en: 'English' },
    splash: { preparing: 'Preparando el recorrido' },
    hero: {
      location: 'Ubicación',
      focus: 'Enfoque',
      focusValue: 'IA agéntica · Sistemas distribuidos',
      role: 'Rol',
      subtitleLead: 'De la programación de hardware al desarrollo Full Stack.',
      subtitleTail: 'Una visión sistémica para arquitecturas web complejas.',
      scroll: 'Scroll',
    },
    quotes: {
      vision: 'No es solo escribir código. Se trata de diseñar sistemas que escalen y transformen negocios. Tu gran proyecto se encuentra a una decisión de distancia.',
      philosophy: 'La excelencia no es un acto, es un hábito forjado en la resiliencia, la autoexigencia y la perseverancia.',
      philosophyAuthor: 'Filosofía de Trabajo',
      contact: 'Para materializar tu visión, transformaremos los conceptos complejos en objetivos concretos, moldeando los límites técnicos para que des tu próximo gran salto.',
    },
    work: { title: 'Trayectoria.' },
    labs: {
      title: 'Labs & Open Source.',
      subtitle: 'Proyectos paralelos, herramientas experimentales y contribuciones que mantienen mis habilidades afiladas.',
      open: 'Abrir proyecto',
      enter: 'Entrar',
    },
    about: {
      headline: 'Ingeniería, software y criterio de producto.',
      subheadline: 'Soluciones técnicas mantenibles enfocadas en la experiencia de uso.',
      paragraphs: [
        'Mi formación en Ingeniería Automática en la CUJAE me dio una forma de pensar basada en sistemas, procesos, control y optimización. Hoy aplico esa base al desarrollo de software: aplicaciones empresariales, sistemas distribuidos de alta concurrencia e integraciones complejas.',
        'Con más de 4 años en desarrollo y 4 previos en automatización industrial, me enfoco en sistemas agénticos de IA y aplicaciones basadas en LLM para clasificar información y enrutar microservicios de forma inteligente.',
      ],
      education: 'Formación',
      languages: 'Idiomas',
      arsenal: 'Arsenal Tecnológico',
      groups: { languages: 'Lenguajes', platforms: 'Plataformas', systems: 'IA & Sistemas' },
    },
    contact: { start: 'Inicia la conversación' },
    detail: {
      dialog: 'Detalle del proyecto: {name}',
      back: 'Volver a Labs',
      backLabel: 'Labs & Open Source',
      close: 'Cerrar',
      description: 'Descripción',
      howItWorks: 'Cómo funciona',
      role: 'Rol',
      stack: 'Stack',
      keyPoints: 'Aspectos clave',
      inNumbers: 'En datos',
      challenges: 'Desafíos & Soluciones',
      defaultRole: 'Entrega de proyecto',
      repo: 'Ver Repositorio',
      demo: 'Demo en Vivo',
    },
  },
  seo: {
    title: 'Oriel Arteaga — Full Stack Developer',
    description:
      'Portfolio de Oriel Arteaga, Full Stack Developer en Montevideo. Ingeniero en Automática especializado en arquitecturas web escalables con React, .NET, Node.js y Azure.',
    ogDescription:
      'De la ingeniería de hardware al desarrollo Full Stack. Una visión sistémica para arquitecturas web complejas.',
    imageAlt: 'Vista previa del portfolio de Oriel Arteaga',
    locale: 'es_UY',
  },
  data: {
      profile: {
          name: "Oriel Arteaga",
          role: "Full Stack Developer",
          location: "Montevideo, UY",
          email: "arteaga95.jimenez@gmail.com",
          phone: "097906057",
          tagline: "Ingeniería de precisión aplicada a la web moderna.",
          linkedin: "https://www.linkedin.com/in/oriel-arteaga-jim%C3%A9nez-2b5768180",
          github: "https://github.com/oriel9511",
      },
      experience: [
          {
              company: "Chattigo",
              role: "Desarrollador de software",
              year: "Sep 2025 — Presente",
              projects: ["IA para atención al cliente", "Omnicanal", "Mercado Libre", "WhatsApp"],
              desc: "Funciones de IA para atención al cliente: respuestas basadas en conocimiento, resúmenes y sugerencias. Componentes reutilizables sobre LLM, conversaciones vinculadas entre WhatsApp y Webchat y un asistente interno para consultar datos operativos."
          },
          {
              company: "Alsacia",
              role: "Desarrollador Backend",
              year: "Abr — Ago 2025",
              projects: ["PeopleFlow (AI)", "Flowuy", "BioPass", "BioMatch"],
              desc: "Soluciones SaaS con IA: PeopleFlow para gestión y contratación de personal, Flowuy como asistente empresarial y BioMatch para verificación de identidad y documentos de distintos países en 11 segundos."
          },
          {
              company: "Bizdirect Consulting",
              role: "Desarrollador Full Stack · Líder de equipo",
              year: "2022 — Abr 2025",
              projects: ["Odoo Automation", "QuotesDirect ERP", "Integraciones"],
              desc: "Liderazgo de un equipo de 4 desarrolladores en automatización de procesos. Reducción de hasta un 90% en el procesamiento manual con módulos de Odoo y un ERP de cotizaciones multi-sucursal."
          },
          {
              company: "IsuCorp",
              role: "Desarrollador Full Stack",
              year: "May — Sep 2024",
              projects: [".NET Ecosystem", "Performance Tuning"],
              desc: "Mantenimiento y evolución de software .NET: corrección de errores, nuevas funcionalidades y mejoras de eficiencia y rendimiento."
          }
      ],
      opensource: [
          {
              name: "Copiloto Omnicanal de IA",
              world: "copilot",
              tech: "Python, Java, Go, TypeScript",
              desc: "IA integrada en una plataforma de atención omnicanal: propone respuestas, resume conversaciones y mantiene el hilo entre canales.",
              year: "2025 — Presente",
              role: "Desarrollo de funciones de IA y componentes reutilizables",
              status: "En desarrollo continuo",
              overview: "Conjunto de capacidades de IA para equipos de atención al cliente que trabajan sobre una plataforma omnicanal. La IA acompaña al agente sin reemplazarlo: sugiere, resume y consulta, y la persona decide. Un objetivo central es que el contexto no se pierda al cambiar de canal ni al pasar una conversación a un humano.",
              highlights: [
                  "Respuestas apoyadas en una base de conocimiento de la empresa.",
                  "Resúmenes automáticos de conversaciones y sugerencias de respuesta para agentes.",
                  "Conversaciones vinculadas entre WhatsApp y Webchat, con el historial siempre a mano.",
                  "Componentes de IA reutilizables que aceleran la creación de nuevas capacidades.",
                  "Asistente interno para consultar datos operativos en lenguaje natural.",
                  "Integración con marketplaces para atender consultas de compradores."
              ],
              flow: [
                  "Llega un mensaje por cualquiera de los canales.",
                  "La IA propone una respuesta o resume el contexto.",
                  "El agente revisa, ajusta y responde, o toma el caso.",
                  "El historial conserva la continuidad entre canales.",
                  "Supervisión consulta la actividad con el asistente interno."
              ],
              facts: [
                  { label: "Desde", value: "Septiembre 2025" },
                  { label: "Canales", value: "WhatsApp · Webchat · Marketplace" },
                  { label: "Enfoque", value: "IA asistiva con humano en el ciclo" }
              ],
              challenges: [
                  {
                      title: "Continuidad entre canales",
                      detail: "Una misma persona puede escribir por distintos canales; la solución debía tratarlos como una sola conversación."
                  },
                  {
                      title: "IA útil sin perder el control humano",
                      detail: "Las sugerencias tenían que acelerar al agente sin quitarle la decisión final."
                  },
                  {
                      title: "Piezas reutilizables",
                      detail: "Las capacidades se diseñaron como componentes compartibles para no reconstruir la lógica de IA en cada producto."
                  }
              ]
          },
          {
              name: "Integración con Mercado Libre",
              world: "meli",
              tech: "Go, HTTP, mensajería por eventos",
              desc: "Canal que lleva las preguntas, pedidos y reclamos de un marketplace a la bandeja de atención omnicanal, con el contexto que el agente necesita.",
              year: "2025 — 2026",
              role: "Desarrollo del canal y reestructuración del servicio",
              status: "Entregado",
              overview: "Partí de un servicio de canal genérico que ya existía y lo extendí hasta convertirlo en una integración completa con el marketplace, reestructurando varias partes del código en el camino. Las conversaciones de compra y de posventa llegan al agente con el contexto del producto, del pedido o del reclamo, en la misma bandeja donde atiende el resto de los canales.",
              highlights: [
                  "Preguntas de compradores con el contexto del producto y un resumen de la venta.",
                  "Pedidos relacionados agrupados, incluidas las ventas por paquete.",
                  "Conversaciones de posventa ligadas a reclamos y mediaciones, con avisos de apertura y cierre.",
                  "Mensajes con adjuntos, en ambos sentidos.",
                  "Vinculación de cuentas mediante flujos de autorización, con renovación de credenciales.",
                  "Prevención de mensajes duplicados y recuperación ante errores transitorios."
              ],
              flow: [
                  "El comprador consulta por un producto.",
                  "La integración recibe el mensaje junto con el contexto disponible.",
                  "La conversación aparece en la bandeja con una tarjeta de contexto.",
                  "El agente responde desde su herramienta de atención habitual.",
                  "Si la consulta deriva en posventa, se muestra el contexto del pedido o del reclamo.",
                  "Comprador y agente intercambian mensajes y, cuando corresponde, adjuntos."
              ],
              facts: [
                  { label: "Periodo", value: "Octubre 2025 — mayo 2026" },
                  { label: "Alcance", value: "Preguntas · pedidos · reclamos · adjuntos" },
                  { label: "Punto de partida", value: "Servicio de canal existente, extendido y reestructurado" }
              ],
              challenges: [
                  {
                      title: "Un solo hilo para situaciones distintas",
                      detail: "Una pregunta previa a la compra, un pedido y un reclamo son cosas diferentes; el agente debía verlas como conversaciones coherentes y con su contexto."
                  },
                  {
                      title: "Que ningún mensaje se pierda ni se repita",
                      detail: "Se trabajó la deduplicación y la recuperación ante fallos transitorios, para que las conversaciones fueran confiables."
                  },
                  {
                      title: "Autorización que caduca",
                      detail: "Las cuentas vinculadas necesitan renovar su acceso sin intervención manual ni cortes en la atención."
                  },
                  {
                      title: "Reestructurar mientras se construye",
                      detail: "Sumar funcionalidad sobre un servicio existente obligó a reorganizar partes del código y a reforzarlo con pruebas."
                  }
              ]
          },
          {
              name: "BioPass / BioMatch",
              world: "biomatch",
              tech: "Backend, APIs, verificación biométrica",
              desc: "Verificación de identidad con biometría y documentos de distintos países, dentro de una plataforma de eventos e invitados.",
              year: "2025",
              role: "Desarrollo backend",
              status: "Producto SaaS",
              overview: "Familia de productos SaaS orientada a verificar identidades. BioMatch coteja a una persona con su documento y valida documentos de distintos países en unos 11 segundos; BioPass es la plataforma donde los equipos organizan eventos, invitados e invitaciones. Mi aporte fue el backend del producto; la interfaz la desarrolló otro equipo.",
              highlights: [
                  "Verificación de identidad y de documentos de distintos países.",
                  "Respuesta en alrededor de 11 segundos.",
                  "Gestión de eventos, invitados e invitaciones.",
                  "Carga masiva de invitados con validación de campos obligatorios y de duplicados.",
                  "Seguimiento del estado de las invitaciones y de la asistencia.",
                  "Panel de administración de empresas, contratos y planes."
              ],
              flow: [
                  "El equipo crea un evento y define sus fechas.",
                  "Registra invitados, de uno en uno o de forma masiva.",
                  "Envía las invitaciones y revisa su estado.",
                  "La identidad de cada persona se coteja con su documento.",
                  "Se consulta la asistencia y las métricas del evento."
              ],
              facts: [
                  { label: "Verificación", value: "≈ 11 segundos" },
                  { label: "Documentos", value: "De distintos países" },
                  { label: "Periodo", value: "Abril — agosto 2025" },
                  { label: "Mi rol", value: "Backend" }
              ],
              note: "Descripción basada en mi experiencia y en la interfaz del producto; el frontend no es trabajo mío.",
              challenges: [
                  {
                      title: "Verificar rápido",
                      detail: "La respuesta debía llegar en pocos segundos aun combinando la validación del documento y la de la persona."
                  },
                  {
                      title: "Documentos de distintas jurisdicciones",
                      detail: "Cada país trae formatos propios que el sistema tenía que aceptar y validar."
                  }
              ]
          },
          {
              name: "PeopleFlow",
              world: "people",
              tech: "C#, .NET, ASP.NET Core, gRPC",
              desc: "Plataforma SaaS de gestión y contratación de personal, con un backend modular que cubre desde la estructura organizativa hasta la selección.",
              year: "2025",
              role: "Desarrollo backend",
              status: "Producto SaaS",
              overview: "Backend modular de una plataforma para gestionar personas y procesos de selección: estructura de la organización, puestos, habilidades, vacantes, candidatos y entrevistas. Forma parte de las soluciones SaaS con IA en las que trabajé en Alsacia; mi responsabilidad fue el backend.",
              highlights: [
                  "Empleados, contratos y beneficios.",
                  "Estructura organizativa, puestos y descripciones de puesto.",
                  "Habilidades asociadas a cada puesto.",
                  "Vacantes, candidatos y etapas de selección con entrevistas.",
                  "Gestión de documentos con historial de versiones, usuarios y permisos.",
                  "Arquitectura modular con comunicación eficiente entre servicios."
              ],
              flow: [
                  "Se configura la organización y sus unidades.",
                  "Se definen los puestos y las habilidades que requieren.",
                  "Se publican vacantes y se reciben candidatos.",
                  "Se coordinan las entrevistas y las etapas de selección.",
                  "Al contratar, se registran la persona y su contrato dentro de la estructura."
              ],
              facts: [
                  { label: "Periodo", value: "Abril — agosto 2025" },
                  { label: "Enfoque", value: "Gestión de personas y selección" },
                  { label: "Mi rol", value: "Backend" }
              ],
              challenges: [
                  {
                      title: "Módulos con fronteras claras",
                      detail: "Cada área de personas y de selección se organizó como un módulo independiente para que la plataforma pudiera crecer sin enredarse."
                  },
                  {
                      title: "Servicios que se hablan bien",
                      detail: "La comunicación entre servicios se diseñó para ser eficiente y mantener los datos coherentes entre módulos."
                  }
              ]
          },
          {
              name: "EEMesh",
              world: "eemesh",
              tech: "Rust, Python",
              desc: "Simulador de eventos discretos para estudiar si una mezcla de expertos distribuida puede servir inferencia sobre redes reales.",
              year: "2026",
              role: "Diseño e investigación (proyecto personal)",
              status: "Investigación activa",
              overview: "Proyecto de investigación que responde una pregunta antes de construir nada: ¿qué pasa con la latencia, las colas y la capacidad cuando los expertos de un modelo viven en máquinas distintas? El simulador permite comparar políticas bajo condiciones controladas y repetibles, y una línea paralela mide modelos reales para no depender de supuestos.",
              highlights: [
                  "Simulación de eventos discretos: transferencias, colas, servicio de expertos y carga de trabajo.",
                  "Topología regional y recursos heterogéneos.",
                  "Ejecuciones deterministas: misma configuración y semilla, mismo resultado.",
                  "Métricas de latencia, colas y utilización.",
                  "Línea de laboratorio con modelos reales, separada a propósito del simulador."
              ],
              flow: [
                  "Se define un escenario y sus condiciones.",
                  "Se ejecuta la simulación y se recopilan métricas.",
                  "Se comparan variantes manteniendo constante todo lo demás.",
                  "En el laboratorio, se contrasta una ejecución base con una versión separada en procesos.",
                  "Se interpretan los hallazgos dentro de los límites de cada experimento."
              ],
              facts: [
                  { label: "Barrido diagnóstico", value: "1.210 ejecuciones" },
                  { label: "Cola extrema", value: "≈ 99 % atribuida a bloqueo head-of-line" },
                  { label: "P99 por token (simulado)", value: "1,93 s → 58 ms con prefill fragmentado" },
                  { label: "Prueba con modelo real", value: "Igualdad bit a bit con latencia emulada de 0–200 ms" }
              ],
              note: "Resultados de simulación y de pruebas acotadas a un modelo; no describen un servicio en producción.",
              challenges: [
                  {
                      title: "Separar simulación de medición",
                      detail: "Los números del simulador nunca se convierten en una dependencia del laboratorio de modelos, ni al revés."
                  },
                  {
                      title: "Honestidad de alcance",
                      detail: "Es investigación: no es una malla distribuida en producción ni predice la calidad de un modelo."
                  }
              ]
          },
          {
              name: "LIMS de Toxicología",
              world: "lims",
              tech: ".NET, WinForms, ASP.NET MVC",
              desc: "Sistema de gestión de laboratorio (LIMS) para Labstat, con aplicación de escritorio para la operación y portal web para clientes.",
              year: "2024",
              role: "Mantenimiento y evolución de software",
              status: "Sistema en uso",
              overview: "Sistema de gestión de información de laboratorio para un laboratorio independiente de análisis químicos y toxicológicos. Mi trabajo se centró en mantener y evolucionar el software: corregir errores, sumar funcionalidades y mejorar su eficiencia y rendimiento, cuidando que la operación diaria no se interrumpiera.",
              highlights: [
                  "Ingreso y seguimiento de muestras con cadena de custodia.",
                  "Hojas de trabajo para organizar la operación diaria del laboratorio.",
                  "Cotizaciones, facturación y reportes.",
                  "Portal web para que los clientes envíen pedidos y consulten su estado.",
                  "Aplicación de escritorio pensada para procesos intensivos."
              ],
              flow: [
                  "El cliente envía un pedido desde el portal web.",
                  "El laboratorio recibe y registra las muestras con su cadena de custodia.",
                  "El trabajo se organiza en hojas de trabajo.",
                  "Se emiten reportes y se gestiona la facturación.",
                  "El cliente consulta el estado y los resultados desde el portal."
              ],
              facts: [
                  { label: "Año", value: "2024" },
                  { label: "Superficies", value: "Escritorio + portal web" },
                  { label: "Mi rol", value: "Mantenimiento y evolución" }
              ],
              note: "Alcance funcional descrito a partir de la información pública del sistema.",
              challenges: [
                  {
                      title: "Dos superficies, un mismo dato",
                      detail: "La operación interna y el portal de clientes compartían la información del laboratorio, y ambas debían mantenerse coherentes."
                  },
                  {
                      title: "Cambios sobre un sistema en uso",
                      detail: "Mejorar rendimiento y corregir errores en un sistema operativo exige cuidar la trazabilidad y no frenar el trabajo del laboratorio."
                  }
              ]
          },
          {
              name: "Mapeo de Procesos Colaborativo",
              world: "process",
              tech: "TypeScript, React, Express",
              desc: "Lienzo colaborativo donde los diagramas de proceso llevan información asociada, en vez de quedar como dibujos aislados.",
              year: "2023 — 2024",
              role: "Desarrollo full stack",
              status: "Entregado",
              overview: "Herramienta para que los equipos mapeen sus procesos sobre un tablero colaborativo y asocien a cada forma del diagrama datos editables. La idea es que el mapa sea consultable y útil, no solo una imagen.",
              highlights: [
                  "Mapas de procesos sobre un tablero colaborativo.",
                  "Formas del diagrama vinculadas a metadatos editables.",
                  "Edición y consulta desde una interfaz propia.",
                  "Información de proceso centralizada y compartida por el equipo."
              ],
              flow: [
                  "Se dibuja el proceso en el lienzo.",
                  "Se selecciona una forma del diagrama.",
                  "Se completan o consultan sus datos asociados.",
                  "El equipo revisa el mapa en conjunto."
              ],
              facts: [
                  { label: "Periodo", value: "Agosto 2023 — septiembre 2024" },
                  { label: "Formato", value: "Aplicación web sobre tablero colaborativo" }
              ],
              challenges: [
                  {
                      title: "Diagrama y datos en sincronía",
                      detail: "Cada forma debía conservar su información aunque el mapa cambiara."
                  },
                  {
                      title: "Trabajo en conjunto",
                      detail: "Varias personas debían poder editar y consultar el mismo tablero sin pisarse."
                  }
              ]
          },
          {
              name: "Chat Doc Query",
              world: "doc",
              tech: "TypeScript, React, Next.js, LLM",
              desc: "Chat inteligente para consultar y extraer información de documentos PDF, con respuestas apoyadas en su contenido.",
              year: "2023",
              role: "Prototipo de aplicación de IA",
              status: "Prototipo",
              overview: "Prototipo que reúne en un flujo pequeño todo lo necesario para conversar con un documento: cargarlo, extraer su texto, prepararlo para búsqueda por significado y responder en un chat. Es una aplicación práctica de recuperación aumentada, pensada para encontrar información sin leer página por página.",
              highlights: [
                  "Carga de un documento desde la interfaz.",
                  "Extracción de texto de PDF y preparación para búsqueda semántica.",
                  "Recuperación de los fragmentos relevantes para fundamentar cada respuesta.",
                  "Contexto de conversación entre preguntas.",
                  "Respuestas que aparecen de forma progresiva y se pueden detener."
              ],
              flow: [
                  "Se carga un documento.",
                  "Se extrae su texto y se prepara para consulta.",
                  "La persona hace una pregunta.",
                  "Se recuperan los fragmentos relevantes y se genera la respuesta.",
                  "Se continúa la conversación o se detiene la generación."
              ],
              facts: [
                  { label: "Año", value: "2023" },
                  { label: "Enfoque", value: "Recuperación aumentada sobre PDF" }
              ],
              challenges: [
                  {
                      title: "Recuperar antes de responder",
                      detail: "El valor dependía de traer los fragmentos correctos antes de generar texto, no solo de tener un buen modelo."
                  },
                  {
                      title: "Experiencia de respuesta",
                      detail: "Mostrar la respuesta a medida que se genera, con la posibilidad de interrumpirla, hace que la espera se sienta natural."
                  }
              ]
          },
          {
              name: "Kinet",
              world: "kinet",
              tech: "Go, React",
              desc: "Plataforma para que docentes creen actividades interactivas y las ejecuten con sus estudiantes desde el móvil.",
              year: "2026",
              role: "Producto e ingeniería (proyecto personal)",
              status: "Pre-Alpha MVP",
              overview: "MVP en etapa pre-alpha: una persona docente crea y publica una actividad, los estudiantes participan desde su teléfono y el docente sigue el progreso durante la sesión. La dirección de producto apunta a ir más allá de los cuestionarios lineales, con actividades que muestren el razonamiento; hoy el MVP entrega el núcleo de creación, participación y resultados.",
              highlights: [
                  "Constructor para crear y publicar actividades tipo cuestionario.",
                  "Participación de estudiantes desde el teléfono.",
                  "Recolección de respuestas y resultados de la sesión.",
                  "Panel de resultados para el docente.",
                  "Contenido multimedia dentro de las actividades.",
                  "Identidad visual lúdica, táctil y accesible."
              ],
              flow: [
                  "El docente crea y publica una actividad.",
                  "Comparte el acceso con sus estudiantes.",
                  "Cada estudiante entra desde su teléfono y responde.",
                  "El docente sigue el progreso y revisa los resultados."
              ],
              facts: [
                  { label: "Estado", value: "Pre-Alpha MVP" },
                  { label: "Desde", value: "Abril 2026" }
              ],
              note: "Producto en desarrollo: las variantes de actividad avanzadas son dirección de producto, no funciones entregadas.",
              challenges: [
                  {
                      title: "Del cuestionario a la actividad",
                      detail: "La dirección explorada es diseñar formatos que muestren cómo razona el estudiante, no solo si acertó."
                  },
                  {
                      title: "Tiempo real en el aula",
                      detail: "Muchos dispositivos responden a la vez y el docente necesita un panel que se actualice sin fricción."
                  }
              ]
          },
          {
              name: "Reservas Grupales",
              world: "booking",
              tech: "React, TypeScript, Odoo, Python",
              desc: "Reserva de servicios en línea: elegir servicios, profesionales y horarios compatibles para grupos de personas.",
              year: "2024",
              role: "Personalización de Odoo e integración con React",
              status: "Entregado",
              overview: "Flujo web de reservas para negocios de servicios que permite coordinar a varias personas a la vez: cada asistente elige sus servicios y la herramienta calcula qué horarios sirven a todos, ya sea en el mismo momento o en momentos distintos. Mi trabajo fue amplio: personalicé Odoo para que la agenda y las reservas soportaran esa lógica, y lo integré con una interfaz en React.",
              highlights: [
                  "Personalización profunda de Odoo para agenda, servicios y disponibilidad.",
                  "Integración entre Odoo y una interfaz web en React.",
                  "Selección de la cantidad de asistentes y de sus datos.",
                  "Elección de servicios y de profesionales.",
                  "Horarios disponibles calculados a partir de la agenda real.",
                  "Modalidad de grupo: mismo horario o combinaciones distintas.",
                  "Manejo correcto de zonas horarias.",
                  "Confirmación de la reserva."
              ],
              flow: [
                  "Se indica cuántas personas reservarán.",
                  "Se ingresan sus datos y se eligen los servicios.",
                  "Se revisan los profesionales y los horarios disponibles.",
                  "Se elige la modalidad de grupo y el horario.",
                  "Se confirma la reserva."
              ],
              facts: [
                  { label: "Año", value: "2024" },
                  { label: "Modalidades", value: "Grupo en el mismo horario o en horarios distintos" }
              ],
              challenges: [
                  {
                      title: "Disponibilidad para grupos",
                      detail: "Encontrar horarios que funcionen para varias personas y varios servicios al mismo tiempo."
                  },
                  {
                      title: "Zonas horarias",
                      detail: "Las fechas debían mostrarse y guardarse correctamente sin importar desde dónde se reservara."
                  }
              ]
          }
      ],
      education: {
          degree: "Ingeniería en Automática",
          school: "Universidad Tecnológica de La Habana (CUJAE)",
          year: "2014 — 2019"
      },
      languages: ["Español", "Inglés"],
      skills: {
          languages: ["C#", "TypeScript", "Python", "Go", "Java", "SQL", "Dart"],
          platforms: ["ASP.NET", "Node.js", "React", "Vue.js", "Blazor", "Odoo", "Azure"],
          systems: ["IA agéntica", "LLM", "Machine Learning", "Alta concurrencia", "Omnicanal", "SCADA / PLC"]
      }
  },
};

export default es;
