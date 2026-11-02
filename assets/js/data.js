/**
 * Case study content
 * ---------------------------------------------------------------------------
 * Consumed by the case-study drawer in assets/js/main.js.
 * Add a new key here and a matching [data-case="key"] button in index.html.
 */
window.CASE_STUDIES = {
  salesforce: {
    category: "Agentic AI / Developer Automation",
    title: "Salesforce Developer Agent",
    summary:
      "An autonomous developer agent that turns conversational intent into deployable Salesforce metadata, Apex triggers and Lightning Web Components.",
    meta: ["Role: AI Engineer", "Runtime: LangGraph", "Transport: MCP"],
    problem:
      "Salesforce developers spend a large share of their time translating business specifications into Apex triggers and Lightning Web Components while staying inside strict multi-tenant org limits. The loop is slow: inspect metadata, write code, test, deploy, and repeat.",
    solution:
      "I orchestrated a cyclic LangGraph agent equipped with Salesforce MCP Server tools. The agent inspects org metadata as a dependency graph, drafts Apex and LWC source, validates it against schema constraints, and streams each step into a CopilotKit interface so the developer can steer the run while it is happening.",
    contributions:
      "I owned the tool-execution pipeline, the safe sandbox deployment and rollback path, and the CopilotKit context providers that keep the UI in sync with the agent state.",
    highlights: [
      "Modelled the agent as a cyclic graph with explicit plan, act, observe and verify nodes.",
      "Wrapped Salesforce metadata operations as MCP tools so tool access stayed typed and auditable.",
      "Added pre-deployment AST checks and a rollback path for failed metadata deployments.",
      "Streamed intermediate reasoning and tool I/O into the UI for developer-in-the-loop control."
    ],
    stack: ["LangGraph", "Salesforce MCP Server", "CopilotKit", "Next.js", "Apex", "LWC"]
  },

  voice: {
    category: "Voice AI / Conversational AI",
    title: "Voice-Based Sales Assistant",
    summary:
      "A sub-300 ms bidirectional voice agent that qualifies inbound leads over SIP and writes structured summaries back to the CRM.",
    meta: ["Role: AI Engineer", "Latency: < 300 ms", "Channel: SIP"],
    problem:
      "Inbound lead routing creates a delay between a prospect calling and a human qualifying them. Prospects drop off, and the information captured is inconsistent across the sales team.",
    solution:
      "I built a bidirectional voice assistant on LiveKit WebRTC rooms connected to SIP trunking, backed by FastAPI services and streaming LLM responses. The agent handles interruptions, asks qualifying questions, and pushes a structured lead summary into the CRM before the call ends.",
    contributions:
      "I designed the low-latency audio path, the prompt-driven interruption handling, and the lead state synchronisation into the relational CRM schema.",
    highlights: [
      "Kept the audio round trip under 300 ms by streaming model output directly into the speech pipeline.",
      "Handled barge-in and dynamic turn-taking instead of a rigid question script.",
      "Extracted structured lead fields during the call and synced them to CRM storage automatically.",
      "Exposed session telemetry so failures could be traced by call and by turn."
    ],
    stack: ["LiveKit", "SIP Trunking", "FastAPI", "Streaming LLMs", "WebRTC", "CRM APIs"]
  },

  sql: {
    category: "LLM Application / Natural Language to SQL",
    title: "LLM-Based SQL Query Assistant",
    summary:
      "A schema-grounded query assistant that turns business questions into safe, reviewed SQL and returns an instant data preview.",
    meta: ["Role: AI Engineer", "Validation: EXPLAIN", "Latency: ~34 ms query"],
    problem:
      "Non-technical analysts need data on demand, but waiting on an engineering backlog is slow. Letting a model write arbitrary SQL against a production database is worse: it risks unsafe, expensive or simply wrong queries.",
    solution:
      "I built a retrieval-assisted query synthesis engine that grounds the model in the live system catalog, injects only the relevant schema context, and parameterises the output. Every candidate query passes a read-only guard and an EXPLAIN check before it is executed, with the result rendered in a React data table.",
    contributions:
      "I created the schema grounding layer, the few-shot prompt templates, and the FastAPI validation service that sits between the model and the database.",
    highlights: [
      "Injected live catalog metadata so generated SQL matched real tables, types and relationships.",
      "Restricted execution to read-only statements and validated plans before running anything.",
      "Returned the generated SQL alongside a preview so analysts could verify the logic.",
      "Kept prompts versioned and testable with a small evaluation set of representative questions."
    ],
    stack: ["LLMs", "SQL", "FastAPI", "React", "RAG", "PostgreSQL"]
  },

  datasync: {
    category: "Cloud Automation / AWS",
    title: "S3 Image Sync using AWS DataSync",
    summary:
      "A scheduled cross-region image pipeline that moves terabyte-scale datasets over private VPC endpoints with checksum verification.",
    meta: ["Role: AI/ML Engineer", "Scale: 1.5 TB", "Network: Private VPC"],
    problem:
      "Fragmented image stores across regions caused inconsistencies and latency bottlenecks for inference workloads. Failures were silent, so nobody knew a sync had broken until a model pipeline ran against stale data.",
    solution:
      "I configured scheduled AWS DataSync agents inside private VPC networks with TLS in transit and automated SNS alerts on failure. Each run verifies object checksum parity before the inference lake is promoted, and health telemetry is surfaced for monitoring.",
    contributions:
      "I wrote the infrastructure automation, set up continuous health checks, and verified object parity at scale.",
    highlights: [
      "Automated recurring transfers instead of manual copy jobs.",
      "Kept traffic on private VPC endpoints rather than the public internet.",
      "Added checksum parity checks before promoting new objects.",
      "Wired failure notifications so broken syncs surface immediately."
    ],
    stack: ["Amazon S3", "AWS DataSync", "AWS VPC", "SNS", "Python", "CloudWatch"]
  },

  recommender: {
    category: "Recommender Systems",
    title: "AI-Powered Product Recommendation System",
    summary:
      "A hybrid recommendation service that combines collaborative filtering with embeddings for personalised product ranking.",
    meta: ["Role: ML Engineer", "Approach: Hybrid", "Surface: Product feed"],
    problem:
      "A single popularity-ranked catalogue treats every shopper the same, so long-tail products never surface and repeat customers see little relevance.",
    solution:
      "I combined collaborative filtering signals with learned product embeddings, then blended the two scores into a ranked feed. The service exposes a small ranking API so the storefront can request recommendations per user and per context.",
    contributions:
      "Built the feature preparation, the hybrid ranking logic, and the serving API used by the product surface.",
    highlights: [
      "Combined behavioural similarity with content embeddings to handle sparse users.",
      "Kept the ranking service stateless so it could scale horizontally.",
      "Added offline evaluation against a held-out interaction set before rollout."
    ],
    stack: ["Python", "Scikit-learn", "Embeddings", "Collaborative Filtering", "FastAPI"]
  },

  planogram: {
    category: "Computer Vision",
    title: "Planogram Analysis for Share of Shelf",
    summary:
      "A vision pipeline that measures shelf compliance and brand share of shelf from retail photographs.",
    meta: ["Role: CV Engineer", "Input: Shelf photos", "Output: Compliance report"],
    problem:
      "Retail audits are manual and inconsistent. Brand teams need to know whether a shelf matches the agreed planogram and how much physical space each brand actually owns.",
    solution:
      "I built a detection pipeline that localises shelf rows and product facings, classifies SKUs, and computes share of shelf against the expected planogram. Results are aggregated into a per-store compliance report.",
    contributions:
      "Owned the detection and classification pipeline, the shelf-row geometry, and the compliance scoring logic.",
    highlights: [
      "Detected shelf rows and product facings under varied lighting and perspective.",
      "Mapped detected SKUs back to the planogram to flag missing or misplaced products.",
      "Calculated share of shelf per brand from detected facing widths."
    ],
    stack: ["Python", "OpenCV", "YOLO", "Computer Vision", "Pandas"]
  },

  chatbot: {
    category: "Internal AI Agents",
    title: "AI Chatbot for Internal Product Support",
    summary:
      "A retrieval-augmented assistant that answers product and process questions from internal documentation.",
    meta: ["Role: AI Engineer", "Approach: RAG", "Users: Internal teams"],
    problem:
      "Product knowledge was spread across documents, FAQs and old tickets. Team members kept asking the same questions, and answers depended on who happened to be online.",
    solution:
      "I built a retrieval-augmented chatbot over the internal knowledge base. Documents are chunked and indexed, relevant passages are retrieved per question, and the model answers with citations back to the source material.",
    contributions:
      "Implemented the ingestion and chunking pipeline, the retrieval layer, and the citation-first answer format.",
    highlights: [
      "Chunked and indexed heterogeneous internal documentation.",
      "Returned source references so answers could be verified.",
      "Fell back to a clear no-answer response when retrieval confidence was low."
    ],
    stack: ["Python", "RAG", "LLMs", "Vector Search", "FastAPI"]
  },

  meter: {
    category: "Object Detection",
    title: "Meter Reading Extraction using YOLO",
    summary:
      "A computer vision system that localises utility meter displays and extracts digits with OCR.",
    meta: ["Role: CV Engineer", "Model: YOLO", "Output: Meter reading"],
    problem:
      "Manual meter reading is slow and error-prone, especially at fleet scale. The displays vary in angle, lighting and digit layout.",
    solution:
      "I trained object detection models to locate the meter face and individual digit regions, then passed the cropped digits through OCR and a post-processing rules layer to reconstruct the reading.",
    contributions:
      "Built the dataset preparation, digit localisation, OCR post-processing, and confidence handling for review.",
    highlights: [
      "Two-stage detection: meter face first, then digit bounding boxes.",
      "Post-processed OCR output against expected meter formats.",
      "Flagged low-confidence readings for human review instead of silently accepting them."
    ],
    stack: ["Python", "YOLO", "OpenCV", "OCR", "Computer Vision"]
  },

  scheduler: {
    category: "Workflow Automation",
    title: "Google Meet Automated Scheduling",
    summary:
      "An end-to-end scheduling workflow that reserves slots, dispatches calendar invites and manages meeting link lifecycle.",
    meta: ["Role: Automation Engineer", "API: Google Calendar", "Output: Meet link"],
    problem:
      "Coordinating meeting slots manually creates back-and-forth, duplicate bookings and orphaned meeting links when plans change.",
    solution:
      "I automated the workflow end to end: check availability, reserve a slot, create the calendar event with a Meet link, notify participants, and clean up the link when a meeting is cancelled or rescheduled.",
    contributions:
      "Built the scheduling logic, the calendar integration and the lifecycle cleanup handlers.",
    highlights: [
      "Conflict-aware slot reservation against real calendar availability.",
      "Automatic invite dispatch with a generated Meet link.",
      "Cleanup path for cancelled and rescheduled meetings."
    ],
    stack: ["Python", "Google Calendar API", "Google Meet", "Automation"]
  }
};
