export const DATA = {
    profile: {
        name: "Oriel Arteaga",
        role: "Full Stack Developer",
        location: "Montevideo, UY",
        email: "arteaga95.jimenez@gmail.com",
        phone: "097906057",
        tagline: "Ingeniería de precisión aplicada a la web moderna.",
        linkedin: null,
        github: null,
    },
    experience: [
        {
            company: "Alsacia",
            role: "Backend Developer",
            year: "2025 — Presente",
            projects: ["PeopleFlow (AI)", "Flowuy", "BioPass", "BioMatch"],
            desc: "Desarrollo de soluciones SaaS de alto impacto. PeopleFlow revoluciona la gestión de RRHH mediante IA, mientras que BioMatch asegura la autenticación de identidad biométrica en múltiples jurisdicciones."
        },
        {
            company: "Bizdirect Consulting",
            role: "Full Stack Team Lead",
            year: "2022 — 2025",
            projects: ["Odoo Automation", "QuotesDirect ERP", "Integraciones"],
            desc: "Liderazgo técnico en automatización de procesos. Reducción del 90% en tiempos de carga manual mediante módulos personalizados de Odoo y orquestación de flujos de trabajo complejos."
        },
        {
            company: "IsuCorp",
            role: "Full Stack Dev",
            year: "2024",
            projects: [".NET Ecosystem", "Performance Tuning"],
            desc: "Optimización crítica de sistemas legacy y mejora de rendimiento en arquitecturas .NET empresariales."
        }
    ],
    opensource: [
        {
            name: "Lims Software",
            tech: ".NET WinForms / DevExpress",
            desc: "Sistema de gestión para laboratorios de toxicología (Labstat) con portal web ASP.NET MVC para clientes.",
            year: "2024",
            role: "Backend & product engineering",
            repo: null,
            demo: null,
            overview: "Plataforma interna orientada a operación de laboratorio, trazabilidad de análisis y acceso remoto de clientes a reportes y estados.",
            highlights: [
                "Módulos operativos para flujos de toxicología y seguimiento de muestras.",
                "Portal ASP.NET MVC para consulta segura por parte de clientes.",
                "Interfaz de escritorio robusta para procesos intensivos del laboratorio."
            ],
            challenges: [
                {
                    title: "Domain constraints",
                    detail: "La solución debía respetar procesos de laboratorio y reducir fricción operativa en tareas repetitivas."
                },
                {
                    title: "Dual surface delivery",
                    detail: "Se combinó una experiencia desktop para operación intensiva con un portal web para visibilidad externa."
                }
            ]
        },
        {
            name: "Smart Store ERP",
            tech: "Custom App",
            desc: "Aplicación personalizada para la gestión centralizada de múltiples tiendas en línea.",
            year: "2023",
            role: "Full stack delivery",
            repo: null,
            demo: null,
            overview: "Backoffice centralizado para sincronizar operaciones, catálogos y seguimiento administrativo entre varias tiendas digitales.",
            highlights: [
                "Visión unificada de catálogos y operación multi-store.",
                "Automatización de tareas administrativas frecuentes.",
                "Diseño orientado a reducir duplicación operativa."
            ],
            challenges: [
                {
                    title: "Operational consistency",
                    detail: "Se priorizó una fuente única de verdad para evitar divergencias entre tiendas y procesos manuales."
                },
                {
                    title: "Scalable admin flows",
                    detail: "La interfaz se estructuró para crecer con nuevas tiendas y reglas sin rehacer el flujo base."
                }
            ]
        },
        {
            name: "Chat Doc Query",
            tech: "TypeScript / AI",
            desc: "Sistema de chat inteligente para consultar y extraer información de documentos PDF.",
            year: "2025",
            role: "AI application prototyping",
            repo: null,
            demo: null,
            overview: "Experimento orientado a consulta conversacional sobre documentos, priorizando extracción útil de contexto desde PDFs complejos.",
            highlights: [
                "Flujo de preguntas y respuestas sobre contenido documental.",
                "Enfoque pragmático para recuperar contexto relevante.",
                "Base para asistentes internos sobre conocimiento no estructurado."
            ],
            challenges: [
                {
                    title: "Document retrieval quality",
                    detail: "El valor dependía de recuperar fragmentos útiles antes de responder, no solo de generar texto."
                },
                {
                    title: "Usability of AI outputs",
                    detail: "Se diseñó la experiencia para que la respuesta fuera trazable al documento y accionable para la persona usuaria."
                }
            ]
        },
        {
            name: "Form Recognizer",
            tech: "C# / Azure / Blazor",
            desc: "Aplicación de reconocimiento de formularios utilizando servicios cognitivos de Azure.",
            year: "2024",
            role: "Cloud integration",
            repo: null,
            demo: null,
            overview: "Aplicación para capturar y estructurar datos de formularios mediante servicios cognitivos de Azure y una interfaz Blazor para validación humana.",
            highlights: [
                "Integración con servicios cognitivos para extracción documental.",
                "Revisión humana posterior para asegurar calidad del dato.",
                "Arquitectura útil para flujos administrativos con alto volumen."
            ],
            challenges: [
                {
                    title: "Extraction confidence",
                    detail: "La solución debía contemplar validación cuando el reconocimiento no fuera suficientemente confiable."
                },
                {
                    title: "Cloud workflow alignment",
                    detail: "Se conectó el procesamiento automático con una capa de revisión para sostener calidad operativa."
                }
            ]
        }
    ],
    education: {
        degree: "Ingeniería en Automática",
        school: "CUJAE",
        year: "2019"
    },
    skills: {
        frontend: ["React", "Vue.js", "Next.js", "Blazor", "Tailwind"],
        backend: ["ASP.NET Core", "Node.js", "Python", "REST APIs"],
        database: ["SQL Server", "PostgreSQL", "MongoDB"],
        tools: ["Azure", "Docker", "Git", "Odoo", "SCADA/PLC"]
    }
};
