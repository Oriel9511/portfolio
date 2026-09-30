export default [
  {
    name: "Omnichannel AI Copilot",
    desc: "AI integrated into an omnichannel customer service platform: it suggests replies, summarizes conversations, and keeps the thread connected across channels.",
    year: "2025 — Present",
    role: "Development of AI features and reusable components",
    status: "Ongoing development",
    overview: "A set of AI capabilities for customer service teams working on an omnichannel platform. AI supports the agent without replacing them: it suggests, summarizes, and answers questions, while the person decides. A central goal is to preserve context when switching channels or handing a conversation to a human.",
    highlights: [
      "Replies grounded in the company knowledge base.",
      "Automatic conversation summaries and reply suggestions for agents.",
      "Conversations linked across WhatsApp and Webchat, with history always at hand.",
      "Reusable AI components that speed up the creation of new capabilities.",
      "Internal assistant for querying operational data in natural language.",
      "Marketplace integrations for handling buyer inquiries."
    ],
    flow: [
      "A message arrives through any of the channels.",
      "AI suggests a reply or summarizes the context.",
      "The agent reviews, adjusts, and replies, or takes over the case.",
      "The history preserves continuity across channels.",
      "Supervisors query activity with the internal assistant."
    ],
    facts: [
      { label: "Since", value: "September 2025" },
      { label: "Channels", value: "WhatsApp · Webchat · Marketplace" },
      { label: "Approach", value: "Assistive AI with a human in the loop" }
    ],
    challenges: [
      {
        title: "Continuity across channels",
        detail: "The same person may write through different channels; the solution had to treat them as one conversation."
      },
      {
        title: "Useful AI without losing human control",
        detail: "Suggestions had to help agents work faster without taking away their final decision."
      },
      {
        title: "Reusable building blocks",
        detail: "Capabilities were designed as shareable components so the AI logic would not need to be rebuilt for each product."
      }
    ]
  },
  {
    name: "Mercado Libre Integration",
    tech: 'Go, HTTP, event-driven messaging',
    desc: "A channel that brings marketplace questions, orders, and claims into the omnichannel support inbox, with the context agents need.",
    year: "2025 — 2026",
    role: "Channel development and service restructuring",
    status: "Delivered",
    overview: "I started from an existing generic channel service and extended it into a complete marketplace integration, restructuring several parts of the code along the way. Pre-sale and post-sale conversations reach agents with product, order, or claim context, in the same inbox where they handle the other channels.",
    highlights: [
      "Buyer questions with product context and a sales summary.",
      "Related orders grouped together, including bundle sales.",
      "Post-sale conversations linked to claims and mediations, with opening and closing notifications.",
      "Messages with attachments in both directions.",
      "Account linking through authorization flows, with credential renewal.",
      "Duplicate message prevention and recovery from transient errors."
    ],
    flow: [
      "The buyer asks about a product.",
      "The integration receives the message along with the available context.",
      "The conversation appears in the inbox with a context card.",
      "The agent replies from their usual support tool.",
      "If the inquiry leads to post-sale support, order or claim context is shown.",
      "The buyer and agent exchange messages and, when applicable, attachments."
    ],
    facts: [
      { label: "Period", value: "October 2025 — May 2026" },
      { label: "Scope", value: "Questions · orders · claims · attachments" },
      { label: "Starting point", value: "Existing channel service, extended and restructured" }
    ],
    challenges: [
      {
        title: "One thread for different situations",
        detail: "A pre-purchase question, an order, and a claim are different things; agents needed to see them as coherent conversations with their context."
      },
      {
        title: "Ensure no message is lost or repeated",
        detail: "Deduplication and recovery from transient failures were addressed to make conversations reliable."
      },
      {
        title: "Expiring authorization",
        detail: "Linked accounts need to renew access without manual intervention or interruptions to customer support."
      },
      {
        title: "Restructuring while building",
        detail: "Adding functionality to an existing service required reorganizing parts of the code and strengthening it with tests."
      }
    ]
  },
  {
    name: "BioPass / BioMatch",
    tech: 'Backend, APIs, biometric verification',
    desc: "Identity verification with biometrics and documents from different countries, within an events and guest management platform.",
    year: "2025",
    role: "Backend development",
    status: "SaaS product",
    overview: "A family of SaaS products focused on identity verification. BioMatch matches a person with their document and validates documents from different countries in about 11 seconds; BioPass is the platform where teams organize events, guests, and invitations. My contribution was the product backend; another team developed the interface.",
    highlights: [
      "Identity and document verification across different countries.",
      "Response in about 11 seconds.",
      "Event, guest, and invitation management.",
      "Bulk guest uploads with required-field and duplicate validation.",
      "Invitation status and attendance tracking.",
      "Administration panel for companies, contracts, and plans."
    ],
    flow: [
      "The team creates an event and sets its dates.",
      "They register guests, individually or in bulk.",
      "They send invitations and check their status.",
      "Each person's identity is matched against their document.",
      "They review attendance and event metrics."
    ],
    facts: [
      { label: "Verification", value: "≈ 11 seconds" },
      { label: "Documents", value: "From different countries" },
      { label: "Period", value: "April — August 2025" },
      { label: "My role", value: "Backend" }
    ],
    note: "Description based on my experience and the product interface; the frontend is not my work.",
    challenges: [
      {
        title: "Fast verification",
        detail: "The result had to arrive within seconds while combining document and person validation."
      },
      {
        title: "Documents from different jurisdictions",
        detail: "Each country has its own formats that the system needed to accept and validate."
      }
    ]
  },
  {
    name: "PeopleFlow",
    desc: "A SaaS platform for workforce management and hiring, with a modular backend covering everything from organizational structure to recruitment.",
    year: "2025",
    role: "Backend development",
    status: "SaaS product",
    overview: "A modular backend for a platform to manage people and recruitment processes: organizational structure, positions, skills, vacancies, candidates, and interviews. It is part of the AI-powered SaaS solutions I worked on at Alsacia; my responsibility was the backend.",
    highlights: [
      "Employees, contracts, and benefits.",
      "Organizational structure, positions, and job descriptions.",
      "Skills associated with each position.",
      "Vacancies, candidates, and recruitment stages with interviews.",
      "Document management with version history, users, and permissions.",
      "Modular architecture with efficient communication between services."
    ],
    flow: [
      "The organization and its units are configured.",
      "Positions and their required skills are defined.",
      "Vacancies are published and candidates apply.",
      "Interviews and recruitment stages are coordinated.",
      "When someone is hired, their details and contract are recorded within the structure."
    ],
    facts: [
      { label: "Period", value: "April — August 2025" },
      { label: "Focus", value: "People management and recruitment" },
      { label: "My role", value: "Backend" }
    ],
    challenges: [
      {
        title: "Modules with clear boundaries",
        detail: "Each people-management and recruitment area was organized as an independent module so the platform could grow without becoming tangled."
      },
      {
        title: "Services that communicate well",
        detail: "Inter-service communication was designed to be efficient and keep data consistent across modules."
      }
    ]
  },
  {
    name: "EEMesh",
    desc: "A discrete-event simulator for studying whether a distributed mixture of experts can serve inference over real networks.",
    year: "2026",
    role: "Design and research (personal project)",
    status: "Active research",
    overview: "A research project that answers a question before anything is built: what happens to latency, queues, and capacity when a model's experts live on different machines? The simulator makes it possible to compare policies under controlled, repeatable conditions, and a parallel track measures real models to avoid relying on assumptions.",
    highlights: [
      "Discrete-event simulation: transfers, queues, expert service, and workload.",
      "Regional topology and heterogeneous resources.",
      "Deterministic runs: the same configuration and seed produce the same result.",
      "Latency, queue, and utilization metrics.",
      "A lab track with real models, deliberately kept separate from the simulator."
    ],
    flow: [
      "A scenario and its conditions are defined.",
      "The simulation runs and metrics are collected.",
      "Variants are compared while keeping everything else constant.",
      "In the lab, a baseline run is compared with a version split across processes.",
      "Findings are interpreted within the limits of each experiment."
    ],
    facts: [
      { label: "Diagnostic sweep", value: "1,210 runs" },
      { label: "Extreme queueing", value: "≈ 99% attributed to head-of-line blocking" },
      { label: "P99 per token (simulated)", value: "1.93 s → 58 ms with chunked prefill" },
      { label: "Real-model test", value: "Bit-for-bit equality with emulated latency of 0–200 ms" }
    ],
    note: "Simulation and tests limited to one model; these do not describe a production service.",
    challenges: [
      {
        title: "Separate simulation from measurement",
        detail: "Simulator results never become a dependency of the model lab, and vice versa."
      },
      {
        title: "Scope honesty",
        detail: "This is research: it is not a distributed mesh in production and does not predict a model's quality."
      }
    ]
  },
  {
    name: "Toxicology LIMS",
    desc: "A laboratory information management system (LIMS) for Labstat, with a desktop application for operations and a web portal for clients.",
    year: "2024",
    role: "Software maintenance and evolution",
    status: "In production use",
    overview: "A laboratory information management system for an independent chemical and toxicology testing laboratory. My work focused on maintaining and evolving the software: fixing bugs, adding features, and improving efficiency and performance while ensuring day-to-day operations were not interrupted.",
    highlights: [
      "Sample intake and tracking with chain of custody.",
      "Worksheets to organize the laboratory's daily operations.",
      "Quotations, invoicing, and reports.",
      "Web portal for clients to submit orders and check their status.",
      "Desktop application designed for intensive workflows."
    ],
    flow: [
      "The client submits an order through the web portal.",
      "The laboratory receives and registers samples with their chain of custody.",
      "Work is organized into worksheets.",
      "Reports are issued and invoicing is managed.",
      "The client checks status and results through the portal."
    ],
    facts: [
      { label: "Year", value: "2024" },
      { label: "Interfaces", value: "Desktop + web portal" },
      { label: "My role", value: "Maintenance and evolution" }
    ],
    note: "Functional scope described based on publicly available information about the system.",
    challenges: [
      {
        title: "Two interfaces, one set of data",
        detail: "Internal operations and the client portal shared laboratory information, and both had to remain consistent."
      },
      {
        title: "Changes to a system in use",
        detail: "Improving performance and fixing bugs in a live system requires preserving traceability without slowing down the laboratory's work."
      }
    ]
  },
  {
    name: "Collaborative Process Mapping",
    desc: "A collaborative canvas where process diagrams carry associated information instead of remaining isolated drawings.",
    year: "2023 — 2024",
    role: "Full-stack development",
    status: "Delivered",
    overview: "A tool for teams to map their processes on a collaborative board and associate editable data with each diagram shape. The idea is for the map to be searchable and useful, not just an image.",
    highlights: [
      "Process maps on a collaborative board.",
      "Diagram shapes linked to editable metadata.",
      "Editing and viewing through a dedicated interface.",
      "Centralized process information shared with the team."
    ],
    flow: [
      "The process is drawn on the canvas.",
      "A diagram shape is selected.",
      "Its associated data is filled in or viewed.",
      "The team reviews the map together."
    ],
    facts: [
      { label: "Period", value: "August 2023 — September 2024" },
      { label: "Format", value: "Web application on a collaborative board" }
    ],
    challenges: [
      {
        title: "Keeping diagrams and data in sync",
        detail: "Each shape had to retain its information even as the map changed."
      },
      {
        title: "Working together",
        detail: "Multiple people needed to edit and view the same board without overwriting each other's work."
      }
    ]
  },
  {
    name: "Chat Doc Query",
    desc: "An intelligent chat for querying and extracting information from PDF documents, with answers grounded in their content.",
    year: "2023",
    role: "AI application prototype",
    status: "Prototype",
    overview: "A prototype that brings together, in a small workflow, everything needed to chat with a document: upload it, extract its text, prepare it for semantic search, and answer questions in a chat. It is a practical application of retrieval-augmented generation, designed to find information without reading page by page.",
    highlights: [
      "Upload a document through the interface.",
      "Extract text from PDFs and prepare it for semantic search.",
      "Retrieve relevant passages to ground each answer.",
      "Conversation context across questions.",
      "Answers appear progressively and can be stopped."
    ],
    flow: [
      "A document is uploaded.",
      "Its text is extracted and prepared for querying.",
      "The person asks a question.",
      "Relevant passages are retrieved and an answer is generated.",
      "The conversation continues or generation is stopped."
    ],
    facts: [
      { label: "Year", value: "2023" },
      { label: "Focus", value: "Retrieval-augmented generation over PDFs" }
    ],
    challenges: [
      {
        title: "Retrieve before answering",
        detail: "Its value depended on finding the right passages before generating text, not just having a good model."
      },
      {
        title: "The response experience",
        detail: "Showing the answer as it is generated, with the option to interrupt it, makes the wait feel natural."
      }
    ]
  },
  {
    name: "Kinet",
    desc: "A platform for teachers to create interactive activities and run them with their students on mobile devices.",
    year: "2026",
    role: "Product and engineering (personal project)",
    status: "Pre-Alpha MVP",
    overview: "An MVP in the pre-alpha stage: a teacher creates and publishes an activity, students participate from their phones, and the teacher follows progress during the session. The product direction aims to go beyond linear quizzes, with activities that show students' reasoning; today, the MVP delivers the core creation, participation, and results workflow.",
    highlights: [
      "A builder for creating and publishing quiz-style activities.",
      "Student participation from a phone.",
      "Collection of answers and session results.",
      "A results dashboard for the teacher.",
      "Multimedia content within activities.",
      "A playful, tactile, and accessible visual identity."
    ],
    flow: [
      "The teacher creates and publishes an activity.",
      "They share access with their students.",
      "Each student joins from their phone and answers.",
      "The teacher follows progress and reviews the results."
    ],
    facts: [
      { label: "Status", value: "Pre-Alpha MVP" },
      { label: "Since", value: "April 2026" }
    ],
    note: "Product in development: advanced activity variants are product direction, not delivered features.",
    challenges: [
      {
        title: "From quiz to activity",
        detail: "The direction being explored is to design formats that show how a student reasons, not just whether they got the answer right."
      },
      {
        title: "Real time in the classroom",
        detail: "Many devices respond at once, and the teacher needs a dashboard that updates without friction."
      }
    ]
  },
  {
    name: "Group Bookings",
    desc: "Online service booking: selecting services, professionals, and compatible time slots for groups of people.",
    year: "2024",
    role: "Odoo customization and React integration",
    status: "Delivered",
    overview: "A web booking flow for service businesses that coordinates multiple people at once: each attendee chooses their services, and the tool calculates which time slots work for everyone, either at the same time or at different times. My work was extensive: I customized Odoo so scheduling and bookings supported this logic, and integrated it with a React interface.",
    highlights: [
      "Extensive Odoo customization for scheduling, services, and availability.",
      "Integration between Odoo and a React web interface.",
      "Selection of the number of attendees and their details.",
      "Choice of services and professionals.",
      "Available time slots calculated from the actual schedule.",
      "Group options: the same time or different combinations.",
      "Correct handling of time zones.",
      "Booking confirmation."
    ],
    flow: [
      "The number of people booking is specified.",
      "Their details are entered and services are selected.",
      "Available professionals and time slots are reviewed.",
      "The group option and time are selected.",
      "The booking is confirmed."
    ],
    facts: [
      { label: "Year", value: "2024" },
      { label: "Options", value: "Group bookings at the same time or at different times" }
    ],
    challenges: [
      {
        title: "Availability for groups",
        detail: "Finding time slots that work for multiple people and multiple services at once."
      },
      {
        title: "Time zones",
        detail: "Dates had to display and save correctly regardless of where the booking was made."
      }
    ]
  }
];
