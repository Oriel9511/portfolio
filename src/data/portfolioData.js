export const DATA = {
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
            role: "Automatización y desarrollo sobre Odoo",
            status: "Entregado",
            overview: "Flujo web de reservas para negocios de servicios que permite coordinar a varias personas a la vez: cada asistente elige sus servicios y la herramienta calcula qué horarios sirven a todos, ya sea en el mismo momento o en momentos distintos.",
            highlights: [
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
        },
        {
            name: "Agentes Analistas de Datos",
            world: "agents",
            tech: "Python, LLM",
            desc: "Agentes de IA que colaboran para responder preguntas de análisis sobre datos tabulares, con una persona en el ciclo.",
            year: "2023",
            role: "Prototipo de agentes con herramientas",
            status: "Experimento",
            overview: "Experimento que combina agentes de lenguaje con funciones de análisis: el agente interpreta la solicitud y decide qué herramienta usar, y los cálculos los hace una función de filtrado y estadística. Una persona puede intervenir en el ciclo para revisar antes de dar por buena la respuesta.",
            highlights: [
                "Interpretación de la tarea planteada en lenguaje natural.",
                "Llamada a una función que filtra por fechas y categorías.",
                "Cálculo de medidas descriptivas sobre el resultado.",
                "Resultado guardado en formato tabular.",
                "Intervención humana dentro del ciclo de trabajo."
            ],
            flow: [
                "Se plantea una pregunta sobre los datos.",
                "El agente decide qué herramienta usar.",
                "Se filtran los datos y se calculan las medidas.",
                "Se devuelve una respuesta con su resultado.",
                "Una persona valida antes de darla por buena."
            ],
            facts: [
                { label: "Año", value: "2023" },
                { label: "Patrón", value: "Agentes con llamada a funciones y humano en el ciclo" }
            ],
            challenges: [
                {
                    title: "Herramientas, no adivinanzas",
                    detail: "Los números salen de una función, y el agente solo decide cuándo llamarla."
                },
                {
                    title: "Confianza en el resultado",
                    detail: "La intervención humana en el ciclo permite revisar antes de aceptar lo que devuelve el agente."
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
};
