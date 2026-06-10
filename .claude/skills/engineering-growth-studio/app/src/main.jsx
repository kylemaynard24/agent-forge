import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import JSZip from 'jszip';
import './styles.css';

const supportedTypes = ['epub', 'pdf', 'txt', 'md', 'markdown', 'html', 'htm'];
const unsupportedProtectedTypes = ['azw', 'azw3', 'kfx', 'mobi'];
const legacyUserLibraryStorageKey = 'kindle-reader-app:technical-paper-library';
const legacyDiscoveredPapersStorageKey = 'kindle-reader-app:discovered-technical-papers';
const legacyPaperProgressStorageKey = 'white-paper-reader:paper-progress';
const legacyDemoProjectProgressStorageKey = 'kindle-reader-app:demo-project-progress';
const userLibraryStorageKey = 'engineering-growth-studio:technical-reading-library';
const discoveredPapersStorageKey = 'engineering-growth-studio:discovered-technical-readings';
const paperProgressStorageKey = 'engineering-growth-studio:reading-progress';
const demoProjectProgressStorageKey = 'engineering-growth-studio:demo-project-progress';
const appStorageKeys = [
  legacyUserLibraryStorageKey,
  legacyDiscoveredPapersStorageKey,
  legacyPaperProgressStorageKey,
  legacyDemoProjectProgressStorageKey,
  userLibraryStorageKey,
  discoveredPapersStorageKey,
  paperProgressStorageKey,
  demoProjectProgressStorageKey,
];
const researchSearchResultLimit = 8;
const technicalPapers = [
  {
    id: 'llama-3-herd',
    title: 'The Llama 3 Herd of Models',
    year: 2024,
    topic: 'AI and machine learning',
    source: 'Meta AI',
    summary: 'Technical report for the Llama 3 model family, training recipe, evaluations, and safety work.',
    url: 'https://arxiv.org/pdf/2407.21783',
  },
  {
    id: 'mamba',
    title: 'Mamba: Linear-Time Sequence Modeling with Selective State Spaces',
    year: 2023,
    topic: 'AI and systems',
    source: 'arXiv',
    summary: 'Introduces selective state-space models as an efficient alternative for long sequence modeling.',
    url: 'https://arxiv.org/pdf/2312.00752',
  },
  {
    id: 'gpt-4-technical-report',
    title: 'GPT-4 Technical Report',
    year: 2023,
    topic: 'AI and machine learning',
    source: 'arXiv',
    summary: 'Technical report describing GPT-4 capabilities, limitations, safety work, and evaluations.',
    url: 'https://arxiv.org/pdf/2303.08774',
  },
  {
    id: 'flashattention',
    title: 'FlashAttention: Fast and Memory-Efficient Exact Attention',
    year: 2022,
    topic: 'AI and performance',
    source: 'arXiv',
    summary: 'An IO-aware attention algorithm that improves Transformer training and inference efficiency.',
    url: 'https://arxiv.org/pdf/2205.14135',
  },
  {
    id: 'quic-rfc-9000',
    title: 'RFC 9000: QUIC',
    year: 2021,
    topic: 'Networking',
    source: 'IETF',
    summary: 'The standard specification for QUIC, a UDP-based multiplexed and secure transport.',
    url: 'https://www.rfc-editor.org/rfc/rfc9000.html',
  },
  {
    id: 'tls-13-rfc-8446',
    title: 'RFC 8446: TLS 1.3',
    year: 2018,
    topic: 'Security and networking',
    source: 'IETF',
    summary: 'The Transport Layer Security 1.3 protocol standard.',
    url: 'https://www.rfc-editor.org/rfc/rfc8446.html',
  },
  {
    id: 'foundationdb-record-layer',
    title: 'FoundationDB Record Layer',
    year: 2019,
    topic: 'Databases',
    source: 'Apple',
    summary: 'Describes a record-oriented datastore built on FoundationDB for structured application data.',
    url: 'https://www.foundationdb.org/files/record-layer-paper.pdf',
  },
  {
    id: 'spanner',
    title: "Spanner: Google's Globally-Distributed Database",
    year: 2012,
    topic: 'Databases',
    source: 'Google Research',
    summary: 'Global transactions, TrueTime, and distributed SQL at scale.',
    url: 'https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf',
  },
  {
    id: 'raft',
    title: 'In Search of an Understandable Consensus Algorithm',
    year: 2014,
    topic: 'Distributed systems',
    source: 'Raft project',
    summary: 'The Raft consensus algorithm, designed for understandability and practical implementation.',
    url: 'https://raft.github.io/raft.pdf',
  },
  {
    id: 'dynamo',
    title: "Dynamo: Amazon's Highly Available Key-value Store",
    year: 2007,
    topic: 'Distributed systems',
    source: 'Amazon',
    summary: 'Core ideas behind eventually consistent, highly available key-value storage.',
    url: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf',
  },
  {
    id: 'bigtable',
    title: 'Bigtable: A Distributed Storage System for Structured Data',
    year: 2006,
    topic: 'Databases',
    source: 'Google Research',
    summary: 'Wide-column distributed storage design that influenced many NoSQL systems.',
    url: 'https://static.googleusercontent.com/media/research.google.com/en//archive/bigtable-osdi06.pdf',
  },
  {
    id: 'mapreduce',
    title: 'MapReduce: Simplified Data Processing on Large Clusters',
    year: 2004,
    topic: 'Data systems',
    source: 'Google Research',
    summary: 'The classic programming model for cluster-scale batch processing.',
    url: 'https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf',
  },
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    year: 2017,
    topic: 'AI and machine learning',
    source: 'arXiv',
    summary: 'The Transformer architecture paper.',
    url: 'https://arxiv.org/pdf/1706.03762',
  },
  {
    id: 'bert',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    year: 2018,
    topic: 'AI and machine learning',
    source: 'arXiv',
    summary: 'Bidirectional Transformer pretraining for language representation.',
    url: 'https://arxiv.org/pdf/1810.04805',
  },
  {
    id: 'bitcoin',
    title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
    year: 2008,
    topic: 'Security and cryptography',
    source: 'Bitcoin.org',
    summary: 'The original Bitcoin white paper.',
    url: 'https://bitcoin.org/bitcoin.pdf',
  },
  {
    id: 'end-to-end-arguments',
    title: 'End-to-End Arguments in System Design',
    year: 1984,
    topic: 'Networking',
    source: 'MIT',
    summary: 'Foundational argument for where communication-system functionality should live.',
    url: 'https://web.mit.edu/Saltzer/www/publications/endtoend/endtoend.pdf',
  },
  {
    id: 'nber-ai-finance',
    title: 'Artificial Intelligence in Finance',
    year: 2024,
    topic: 'Finance',
    source: 'NBER',
    summary: 'A survey of AI applications, risks, and market implications across financial services.',
    url: 'https://www.nber.org/system/files/working_papers/w32746/w32746.pdf',
  },
  {
    id: 'bis-tokenisation',
    title: 'Tokenisation in the Context of Money and Other Assets',
    year: 2023,
    topic: 'Finance and market infrastructure',
    source: 'Bank for International Settlements',
    summary: 'Explores tokenisation, settlement, and implications for financial market infrastructure.',
    url: 'https://www.bis.org/cpmi/publ/d225.pdf',
  },
  {
    id: 'sec-market-structure',
    title: 'Staff Report on Equity and Options Market Structure Conditions in Early 2021',
    year: 2021,
    topic: 'Finance and markets',
    source: 'U.S. SEC',
    summary: 'A market-structure analysis of the January 2021 equity and options trading events.',
    url: 'https://www.sec.gov/files/staff-report-equity-options-market-struction-conditions-early-2021.pdf',
  },
  {
    id: 'bis-bigtech-finance',
    title: 'Big Tech in Finance: Opportunities and Risks',
    year: 2019,
    topic: 'Finance and technology',
    source: 'Bank for International Settlements',
    summary: 'Analyzes how large technology platforms affect financial services, competition, and regulation.',
    url: 'https://www.bis.org/publ/arpdf/ar2019e3.pdf',
  },
  {
    id: 'nist-csf-2',
    title: 'The NIST Cybersecurity Framework 2.0',
    year: 2024,
    topic: 'Cybersecurity',
    source: 'NIST',
    summary: 'A practical framework for managing, reducing, and communicating cybersecurity risk.',
    url: 'https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf',
  },
  {
    id: 'nist-zero-trust',
    title: 'Zero Trust Architecture',
    year: 2020,
    topic: 'Cybersecurity architecture',
    source: 'NIST',
    summary: 'Defines zero-trust principles, deployment models, and migration considerations.',
    url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf',
  },
  {
    id: 'cisa-secure-by-design',
    title: 'Shifting the Balance of Cybersecurity Risk: Principles and Approaches for Secure by Design Software',
    year: 2023,
    topic: 'Cybersecurity and software engineering',
    source: 'CISA',
    summary: 'Guidance for building software products that reduce systemic cybersecurity risk.',
    url: 'https://www.cisa.gov/sites/default/files/2023-10/SecureByDesign_1025_508c.pdf',
  },
  {
    id: 'mitre-attack',
    title: 'MITRE ATT&CK: Design and Philosophy',
    year: 2020,
    topic: 'Cybersecurity threat modeling',
    source: 'MITRE',
    summary: 'Explains the design philosophy behind ATT&CK adversary tactics and techniques.',
    url: 'https://attack.mitre.org/docs/ATTACK_Design_and_Philosophy_March_2020.pdf',
  },
  {
    id: 'bis-defi',
    title: 'DeFi Lending: Intermediation Without Information?',
    year: 2023,
    topic: 'Finance and decentralized markets',
    source: 'Bank for International Settlements',
    summary: 'Analyzes decentralized finance lending, information problems, and financial stability implications.',
    url: 'https://www.bis.org/publ/work1075.pdf',
  },
  {
    id: 'imf-digital-money',
    title: 'The Rise of Digital Money',
    year: 2019,
    topic: 'Finance and digital payments',
    source: 'International Monetary Fund',
    summary: 'Explores digital money, stablecoins, and implications for banks, central banks, and payments.',
    url: 'https://www.imf.org/-/media/Files/Publications/fintech-notes/2019/English/FTNEA2019001.ashx',
  },
  {
    id: 'owasp-top-10-2021',
    title: 'OWASP Top 10: 2021',
    year: 2021,
    topic: 'Cybersecurity and application security',
    source: 'OWASP',
    summary: 'A widely used reference for the most critical web application security risks.',
    url: 'https://owasp.org/Top10/assets/OWASP_Top_10-2021_%28en%29.pdf',
  },
  {
    id: 'aurora',
    title: 'Amazon Aurora: Design Considerations for High Throughput Cloud-Native Relational Databases',
    year: 2017,
    topic: 'Databases and cloud systems',
    source: 'Amazon Science',
    summary: 'Describes Aurora storage, replication, recovery, and cloud-native relational database design.',
    url: 'https://assets.amazon.science/dc/2b/4ef2b89649f9a63bc3e6221c03f2/amazon-aurora-design-considerations-for-high-throughput-cloud-native-relational-databases.pdf',
  },
  {
    id: 'cockroachdb',
    title: 'CockroachDB: The Resilient Geo-Distributed SQL Database',
    year: 2020,
    topic: 'Databases and distributed systems',
    source: 'Cockroach Labs',
    summary: 'Explains distributed SQL design, transactions, replication, and geo-distribution in CockroachDB.',
    url: 'https://www.cockroachlabs.com/docs/stable/media/cockroachdb-sigmod2020.pdf',
  },
  {
    id: 'http3-rfc-9114',
    title: 'RFC 9114: HTTP/3',
    year: 2022,
    topic: 'Networking',
    source: 'IETF',
    summary: 'The HTTP/3 standard, mapping HTTP semantics onto QUIC transport.',
    url: 'https://www.rfc-editor.org/rfc/rfc9114.html',
  },
  {
    id: 'bbr',
    title: 'BBR: Congestion-Based Congestion Control',
    year: 2016,
    topic: 'Networking and congestion control',
    source: 'ACM Queue',
    summary: 'Introduces BBR, a congestion-control algorithm based on bottleneck bandwidth and round-trip propagation time.',
    url: 'https://queue.acm.org/detail.cfm?id=3022184',
  },
  {
    id: 'dctcp',
    title: 'Data Center TCP (DCTCP)',
    year: 2010,
    topic: 'Networking and datacenter systems',
    source: 'SIGCOMM',
    summary: 'A TCP variant for low latency and high throughput in datacenter networks.',
    url: 'https://people.csail.mit.edu/alizadeh/papers/dctcp-sigcomm10.pdf',
  },
  {
    id: 'gfs',
    title: 'The Google File System',
    year: 2003,
    topic: 'Distributed systems and storage',
    source: 'Google Research',
    summary: 'Design tradeoffs for large-scale distributed file storage.',
    url: 'https://static.googleusercontent.com/media/research.google.com/en//archive/gfs-sosp2003.pdf',
  },
  {
    id: 'chubby',
    title: 'The Chubby Lock Service for Loosely-Coupled Distributed Systems',
    year: 2006,
    topic: 'Distributed systems and coordination',
    source: 'Google Research',
    summary: 'A distributed lock service used for coordination in large-scale distributed systems.',
    url: 'https://static.googleusercontent.com/media/research.google.com/en//archive/chubby-osdi06.pdf',
  },
  {
    id: 'borg',
    title: 'Large-Scale Cluster Management at Google with Borg',
    year: 2015,
    topic: 'Distributed systems and cluster management',
    source: 'Google Research',
    summary: 'Describes Borg, Google’s cluster manager for large-scale workload scheduling and orchestration.',
    url: 'https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43438.pdf',
  },
];
const subjectTabs = [
  { id: 'all', label: 'All subjects' },
  { id: 'computer-science', label: 'Computer science' },
  { id: 'ai', label: 'AI' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'finance', label: 'Finance' },
  { id: 'databases', label: 'Databases' },
  { id: 'networking', label: 'Networking' },
  { id: 'distributed-systems', label: 'Distributed systems' },
];
const technicalPaperById = new Map(technicalPapers.map((paper) => [paper.id, paper]));
const learningPathStages = [
  {
    id: 'systems-foundations',
    title: 'Stage 1: Think in systems, not tickets',
    cadence: 'Read these in the first 2 to 3 days.',
    outcome:
      'You should be able to explain why architecture decisions belong at the right boundary and how dataflow shapes system design.',
    paperIds: ['end-to-end-arguments', 'mapreduce', 'raft'],
  },
  {
    id: 'data-at-scale',
    title: 'Stage 2: Learn the data tradeoffs senior engineers reach for',
    cadence: 'Take 1 to 2 days here and compare consistency, schema, and operational cost.',
    outcome:
      'You should be able to discuss replication, partitioning, latency, and transactional guarantees without hand-waving.',
    paperIds: ['bigtable', 'dynamo', 'spanner'],
  },
  {
    id: 'platform-control-planes',
    title: 'Stage 3: Understand platform primitives and control planes',
    cadence: 'Spend 1 to 3 days on these and focus on coordination, storage, and scheduling together.',
    outcome:
      'You should be able to talk about platform ownership, failure domains, and why orchestration changes product velocity.',
    paperIds: ['gfs', 'chubby', 'borg'],
  },
  {
    id: 'network-performance',
    title: 'Stage 4: Build a performance and transport instinct',
    cadence: 'Read 1 per day, then summarize the latency and throughput tradeoffs aloud.',
    outcome:
      'You should be able to connect protocol design to customer-visible performance and reliability.',
    paperIds: ['quic-rfc-9000', 'http3-rfc-9114', 'bbr'],
  },
  {
    id: 'security-and-resilience',
    title: 'Stage 5: Speak in risk, resilience, and secure defaults',
    cadence: 'Use 2 to 3 days here; this is where principal-level conversations usually get sharper.',
    outcome:
      'You should be able to frame engineering choices in terms of blast radius, trust boundaries, governance, and safe rollout posture.',
    paperIds: ['nist-csf-2', 'nist-zero-trust', 'cisa-secure-by-design'],
  },
  {
    id: 'frontier-and-strategy',
    title: 'Stage 6: Connect frontier technology to business and platform strategy',
    cadence: 'Finish with 1 to 3 per day and write short notes on what changes system design, economics, or roadmaps.',
    outcome:
      'You should be able to discuss when an emerging capability is strategically relevant versus just technically interesting.',
    paperIds: ['attention-is-all-you-need', 'gpt-4-technical-report', 'llama-3-herd'],
  },
].map((stage) => ({
  ...stage,
  papers: stage.paperIds.map((paperId) => technicalPaperById.get(paperId)).filter(Boolean),
}));
const demoProjectDifficulties = [
  { id: 'all', label: 'All levels' },
  { id: 'analyst', label: 'Software analyst' },
  { id: 'software-engineer', label: 'Software engineer' },
  { id: 'senior-engineer', label: 'Senior engineer' },
  { id: 'principal-engineer', label: 'Principal engineer' },
];
const demoProjectTopics = [
  { id: 'all', label: 'All topics' },
  { id: 'ui-react', label: 'React UI' },
  { id: 'full-stack', label: 'Full stack' },
  { id: 'web-api', label: 'Web APIs' },
  { id: 'data', label: 'Data' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'security', label: 'Security' },
  { id: 'ai', label: 'AI' },
  { id: 'architecture', label: 'Architecture' },
];
const demoProjectStatuses = [
  { id: 'not-started', label: 'Not started' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'complete', label: 'Complete' },
];
const demoProjectMilestones = [
  { id: 'scope', label: 'Define the business problem, users, constraints, and success criteria.' },
  { id: 'requirements', label: 'Write user stories, acceptance criteria, edge cases, and non-functional requirements.' },
  { id: 'design', label: 'Draft the data model, API or interaction contract, architecture notes, and tradeoffs.' },
  { id: 'implementation', label: 'Build the smallest useful vertical slice, then expand the feature set.' },
  { id: 'quality', label: 'Add tests, validation, error handling, logging, and realistic sample data.' },
  { id: 'delivery', label: 'Write a README, demo script, decision log, and next-step backlog.' },
  { id: 'reflection', label: 'Capture what changed when you approached it like a senior or principal engineer.' },
];
const demoProjectSeedPath = [
  {
    id: 'api-requirements-to-contract',
    sequence: 1,
    title: 'API 1: Requirements-to-contract lab',
    difficulty: 'analyst',
    topic: 'web-api',
    timeframe: '1 weekend',
    build:
      'Turn a business process into user stories, acceptance criteria, an OpenAPI contract, and a tiny mock service with happy-path and error examples.',
    analystAngle:
      'Practice translating ambiguous stakeholder asks into testable API behavior before writing production code.',
    stretch:
      'Add versioning rules, backward-compatible changes, and a consumer impact note as if this API were owned by multiple teams.',
    resources: [
      { label: 'OpenAPI Specification', url: 'https://spec.openapis.org/oas/latest.html' },
      { label: 'Microsoft REST API Guidelines', url: 'https://github.com/microsoft/api-guidelines' },
      { label: 'JSON Schema', url: 'https://json-schema.org/learn/getting-started-step-by-step' },
    ],
  },
  {
    id: 'api-crud-service',
    sequence: 2,
    title: 'API 2: CRUD service with validation',
    difficulty: 'software-engineer',
    topic: 'web-api',
    timeframe: '1 week',
    build:
      'Build a REST API for a simple domain with create, read, update, delete, validation, filtering, pagination, and consistent error responses.',
    analystAngle:
      'Define entity rules, required fields, invalid states, and acceptance criteria before implementing endpoints.',
    stretch:
      'Add OpenAPI documentation, integration tests, and a compatibility note explaining how clients should handle errors and paging.',
    resources: [
      { label: 'ASP.NET Core Web APIs', url: 'https://learn.microsoft.com/aspnet/core/web-api/' },
      { label: 'HTTP Semantics', url: 'https://www.rfc-editor.org/rfc/rfc9110' },
      { label: 'Problem Details for HTTP APIs', url: 'https://www.rfc-editor.org/rfc/rfc9457.html' },
    ],
  },
  {
    id: 'api-full-stack-workflow',
    sequence: 3,
    title: 'API 3: Full-stack workflow with audit history',
    difficulty: 'software-engineer',
    topic: 'web-api',
    timeframe: '1 to 2 weeks',
    build:
      'Create a React front end and REST API for tasks, statuses, comments, and immutable audit events. Include validation, pagination, and tests.',
    analystAngle:
      'Start with workflow states, edge cases, and acceptance criteria so the UI and API agree on the business process.',
    stretch:
      'Add optimistic concurrency, role-based actions, and contract tests between the UI and API.',
    resources: [
      { label: 'React Docs', url: 'https://react.dev/learn' },
      { label: 'ASP.NET Core Web APIs', url: 'https://learn.microsoft.com/aspnet/core/web-api/' },
      { label: 'Testing Library', url: 'https://testing-library.com/docs/' },
    ],
  },
  {
    id: 'api-versioned-public-contract',
    sequence: 4,
    title: 'API 4: Versioned public API',
    difficulty: 'senior-engineer',
    topic: 'web-api',
    timeframe: '2 to 3 weeks',
    build:
      'Design and build a versioned API with authentication, idempotency keys, rate-limit responses, deprecation headers, and contract tests.',
    analystAngle:
      'Write client personas, breaking-change examples, migration needs, and service-level expectations before coding.',
    stretch:
      'Create an API governance checklist, rollout plan, and backward-compatibility test suite that protects existing consumers.',
    resources: [
      { label: 'Microsoft REST API Guidelines', url: 'https://github.com/microsoft/api-guidelines' },
      { label: 'IETF Idempotency-Key Header', url: 'https://www.ietf.org/archive/id/draft-ietf-httpapi-idempotency-key-header-07.html' },
      { label: 'Pact Contract Testing', url: 'https://docs.pact.io/' },
    ],
  },
  {
    id: 'api-platform-governance',
    sequence: 5,
    title: 'API 5: API platform governance blueprint',
    difficulty: 'principal-engineer',
    topic: 'web-api',
    timeframe: '3 to 5 weeks',
    build:
      'Create a reference API platform with standards, reusable middleware, observability, identity patterns, documentation templates, and paved-road examples.',
    analystAngle:
      'Interview imagined stakeholder groups and capture where API inconsistency slows delivery, increases risk, or confuses consumers.',
    stretch:
      'Write a multi-team adoption roadmap, exception process, maturity model, and executive narrative for why governance improves product velocity.',
    resources: [
      { label: 'OpenAPI Specification', url: 'https://spec.openapis.org/oas/latest.html' },
      { label: 'Azure API Management', url: 'https://learn.microsoft.com/azure/api-management/' },
      { label: 'Google API Improvement Proposals', url: 'https://google.aip.dev/' },
    ],
  },
  {
    id: 'data-quality-dashboard',
    sequence: 1,
    title: 'Data 1: Data quality and reconciliation dashboard',
    difficulty: 'analyst',
    topic: 'data',
    timeframe: '1 week',
    build:
      'Import two CSV feeds, detect mismatches, classify data-quality issues, and show reconciliation metrics in a dashboard.',
    analystAngle:
      'Model the exception categories, triage workflow, and reporting questions before choosing storage or UI details.',
    stretch:
      'Add incremental imports, idempotency keys, and a review queue that preserves who changed each resolution.',
    resources: [
      { label: 'SQLite Documentation', url: 'https://www.sqlite.org/docs.html' },
      { label: 'DuckDB Guides', url: 'https://duckdb.org/docs/guides/' },
      { label: 'Pandas User Guide', url: 'https://pandas.pydata.org/docs/user_guide/' },
    ],
  },
  {
    id: 'data-analytics-model',
    sequence: 2,
    title: 'Data 2: Analytics model and KPI explorer',
    difficulty: 'software-engineer',
    topic: 'data',
    timeframe: '1 to 2 weeks',
    build:
      'Build a small analytics application with normalized source tables, a reporting model, KPI cards, drilldowns, and seeded sample data.',
    analystAngle:
      'Define business terms, metric formulas, grain, filters, and stakeholder questions so reports are trustworthy.',
    stretch:
      'Add metric definitions, data lineage notes, and tests that detect broken assumptions in the reporting model.',
    resources: [
      { label: 'SQLite Documentation', url: 'https://www.sqlite.org/docs.html' },
      { label: 'DuckDB Guides', url: 'https://duckdb.org/docs/guides/' },
      { label: 'dbt Semantic Layer', url: 'https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl' },
    ],
  },
  {
    id: 'data-pipeline-observability',
    sequence: 3,
    title: 'Data 3: Reliable batch pipeline',
    difficulty: 'software-engineer',
    topic: 'data',
    timeframe: '2 weeks',
    build:
      'Create a scheduled ingest-transform-export pipeline with checkpoints, retries, validation failures, and operational run history.',
    analystAngle:
      'Write source-system assumptions, freshness expectations, failure categories, and reconciliation rules before building the pipeline.',
    stretch:
      'Add backfills, schema drift detection, data contracts, and a runbook for failed loads.',
    resources: [
      { label: 'Apache Airflow Concepts', url: 'https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html' },
      { label: 'Great Expectations', url: 'https://docs.greatexpectations.io/docs/' },
      { label: 'Data Contracts', url: 'https://datacontract.com/' },
    ],
  },
  {
    id: 'data-event-sourcing-read-models',
    sequence: 4,
    title: 'Data 4: Event-sourced reporting model',
    difficulty: 'senior-engineer',
    topic: 'data',
    timeframe: '2 to 4 weeks',
    build:
      'Model domain events, store immutable history, project read models, replay events, and compare reporting outcomes across versions.',
    analystAngle:
      'Capture event definitions in business language and define how corrections, reversals, and late-arriving facts should behave.',
    stretch:
      'Document consistency tradeoffs, replay risks, auditability, and how downstream teams can safely consume event-derived data.',
    resources: [
      { label: 'Event Sourcing Pattern', url: 'https://learn.microsoft.com/azure/architecture/patterns/event-sourcing' },
      { label: 'CQRS Pattern', url: 'https://learn.microsoft.com/azure/architecture/patterns/cqrs' },
      { label: 'Martin Fowler: Event Sourcing', url: 'https://martinfowler.com/eaaDev/EventSourcing.html' },
    ],
  },
  {
    id: 'data-platform-strategy',
    sequence: 5,
    title: 'Data 5: Data platform strategy',
    difficulty: 'principal-engineer',
    topic: 'data',
    timeframe: '3 to 6 weeks',
    build:
      'Design a platform strategy for ingestion, data quality, governance, cataloging, lineage, access control, and analytics enablement.',
    analystAngle:
      'Map data producers, consumers, ownership pain points, compliance constraints, and decision rights before proposing platform capabilities.',
    stretch:
      'Write a target architecture, operating model, phased roadmap, funding narrative, and platform success metrics.',
    resources: [
      { label: 'Data Mesh Principles', url: 'https://martinfowler.com/articles/data-mesh-principles.html' },
      { label: 'Microsoft Cloud Adoption Framework Data', url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/scenarios/cloud-scale-analytics/' },
      { label: 'OpenLineage', url: 'https://openlineage.io/docs/' },
    ],
  },
  {
    id: 'secure-auth-service',
    sequence: 1,
    title: 'Security 1: Authentication requirements workbook',
    difficulty: 'analyst',
    topic: 'security',
    timeframe: '1 week',
    build:
      'Create a requirements and test workbook for login, password reset, lockout, session timeout, audit logging, and security edge cases.',
    analystAngle:
      'Write misuse cases and policy decisions first: lockout rules, reset expiry, session lifetime, and audit requirements.',
    stretch:
      'Turn the workbook into traceable security acceptance criteria and a review checklist that an implementation must satisfy.',
    resources: [
      { label: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
      { label: 'OWASP ASVS', url: 'https://owasp.org/www-project-application-security-verification-standard/' },
      { label: 'NIST Digital Identity Guidelines', url: 'https://pages.nist.gov/800-63-3/' },
    ],
  },
  {
    id: 'secure-auth-implementation',
    sequence: 2,
    title: 'Security 2: Secure authentication service',
    difficulty: 'software-engineer',
    topic: 'security',
    timeframe: '2 weeks',
    build:
      'Build login, refresh tokens, password reset, account lockout, audit logging, and security-focused tests.',
    analystAngle:
      'Keep policy decisions visible in stories and tests so the security behavior is explainable to non-developers.',
    stretch:
      'Add rate limiting, secure secret handling, audit event review, and a migration plan for changing auth rules safely.',
    resources: [
      { label: 'OWASP Session Management Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html' },
      { label: 'OAuth 2.0 Security Best Current Practice', url: 'https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics' },
      { label: 'ASP.NET Core Security', url: 'https://learn.microsoft.com/aspnet/core/security/' },
    ],
  },
  {
    id: 'security-threat-modeling-lab',
    sequence: 3,
    title: 'Security 3: Threat modeling lab',
    difficulty: 'software-engineer',
    topic: 'security',
    timeframe: '1 to 2 weeks',
    build:
      'Threat model an existing demo app, identify trust boundaries, rank risks, and implement two high-value mitigations with tests.',
    analystAngle:
      'Frame assets, actors, abuse cases, and business impact before jumping to technical controls.',
    stretch:
      'Create a lightweight threat-model review template and show how it fits into normal feature delivery.',
    resources: [
      { label: 'OWASP Threat Modeling', url: 'https://owasp.org/www-community/Threat_Modeling' },
      { label: 'Microsoft Threat Modeling Tool', url: 'https://learn.microsoft.com/azure/security/develop/threat-modeling-tool' },
      { label: 'MITRE ATT&CK', url: 'https://attack.mitre.org/' },
    ],
  },
  {
    id: 'security-zero-trust-service',
    sequence: 4,
    title: 'Security 4: Zero-trust service hardening',
    difficulty: 'senior-engineer',
    topic: 'security',
    timeframe: '2 to 4 weeks',
    build:
      'Harden a service with least-privilege access, token validation, policy checks, secure configuration, dependency scanning, and audit dashboards.',
    analystAngle:
      'Define trust assumptions, data sensitivity, access personas, and compliance-relevant evidence before selecting controls.',
    stretch:
      'Add a control matrix, exception process, rollout sequencing, and measurable risk reduction narrative.',
    resources: [
      { label: 'NIST Zero Trust Architecture', url: 'https://csrc.nist.gov/publications/detail/sp/800-207/final' },
      { label: 'CISA Secure by Design', url: 'https://www.cisa.gov/securebydesign' },
      { label: 'OWASP SAMM', url: 'https://owaspsamm.org/' },
    ],
  },
  {
    id: 'security-program-blueprint',
    sequence: 5,
    title: 'Security 5: Secure delivery program blueprint',
    difficulty: 'principal-engineer',
    topic: 'security',
    timeframe: '3 to 6 weeks',
    build:
      'Design a secure delivery program covering standards, training, automated gates, incident feedback loops, risk acceptance, and executive reporting.',
    analystAngle:
      'Map how security decisions flow across product, engineering, operations, risk, and compliance stakeholders.',
    stretch:
      'Create a maturity model, investment roadmap, policy exception process, and metrics that connect security work to delivery outcomes.',
    resources: [
      { label: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework' },
      { label: 'SLSA Framework', url: 'https://slsa.dev/' },
      { label: 'OWASP Software Assurance Maturity Model', url: 'https://owaspsamm.org/model/' },
    ],
  },
  {
    id: 'cloud-static-site-deploy',
    sequence: 1,
    title: 'Cloud 1: Static site deployment',
    difficulty: 'analyst',
    topic: 'cloud',
    timeframe: '1 weekend',
    build:
      'Deploy a static documentation site with environment configuration, custom domain notes, cost estimate, and a release checklist.',
    analystAngle:
      'Capture hosting requirements, ownership, content workflow, availability expectations, and support boundaries first.',
    stretch:
      'Add infrastructure-as-code notes, rollback steps, monitoring expectations, and a runbook for content publishing issues.',
    resources: [
      { label: 'Azure Static Web Apps', url: 'https://learn.microsoft.com/azure/static-web-apps/' },
      { label: 'GitHub Pages', url: 'https://docs.github.com/pages' },
      { label: 'Azure Pricing Calculator', url: 'https://azure.microsoft.com/pricing/calculator/' },
    ],
  },
  {
    id: 'cloud-api-deployment',
    sequence: 2,
    title: 'Cloud 2: API deployment pipeline',
    difficulty: 'software-engineer',
    topic: 'cloud',
    timeframe: '1 to 2 weeks',
    build:
      'Deploy a small API with environment-specific configuration, CI/CD, health checks, secrets, and smoke tests.',
    analystAngle:
      'Define deployment environments, release approval needs, rollback criteria, and the operational definition of healthy.',
    stretch:
      'Add blue-green or slot-based deployment, release notes, and a production-readiness checklist.',
    resources: [
      { label: 'GitHub Actions', url: 'https://docs.github.com/actions' },
      { label: 'Azure App Service', url: 'https://learn.microsoft.com/azure/app-service/' },
      { label: 'Twelve-Factor App', url: 'https://12factor.net/' },
    ],
  },
  {
    id: 'cloud-observability-lab',
    sequence: 3,
    title: 'Cloud 3: Observability and SLO lab',
    difficulty: 'senior-engineer',
    topic: 'cloud',
    timeframe: '2 to 3 weeks',
    build:
      'Deploy a small service, add structured logs, metrics, traces, dashboards, alerts, and an error-budget-style SLO.',
    analystAngle:
      'Define the user journeys and business-impact signals before deciding which metrics matter.',
    stretch:
      'Add load testing, incident runbooks, and a post-incident review template with concrete reliability improvements.',
    resources: [
      { label: 'OpenTelemetry Docs', url: 'https://opentelemetry.io/docs/' },
      { label: 'Google SRE Workbook', url: 'https://sre.google/workbook/table-of-contents/' },
      { label: 'Azure Monitor Docs', url: 'https://learn.microsoft.com/azure/azure-monitor/' },
    ],
  },
  {
    id: 'cloud-resilient-worker',
    sequence: 4,
    title: 'Cloud 4: Resilient background worker',
    difficulty: 'senior-engineer',
    topic: 'cloud',
    timeframe: '2 to 4 weeks',
    build:
      'Build a queue-driven worker with retries, poison-message handling, idempotency, autoscaling notes, and operational dashboards.',
    analystAngle:
      'Model failure scenarios, business deadlines, duplicate processing risks, and support workflows before designing the worker.',
    stretch:
      'Compare cost, scale, latency, and operational complexity across at least two cloud service choices.',
    resources: [
      { label: 'Competing Consumers Pattern', url: 'https://learn.microsoft.com/azure/architecture/patterns/competing-consumers' },
      { label: 'Retry Pattern', url: 'https://learn.microsoft.com/azure/architecture/patterns/retry' },
      { label: 'Azure Queue Storage', url: 'https://learn.microsoft.com/azure/storage/queues/' },
    ],
  },
  {
    id: 'cloud-platform-landing-zone',
    sequence: 5,
    title: 'Cloud 5: Platform landing zone strategy',
    difficulty: 'principal-engineer',
    topic: 'cloud',
    timeframe: '3 to 6 weeks',
    build:
      'Design a landing zone strategy with networking, identity, policy, deployment standards, observability, cost controls, and team onboarding.',
    analystAngle:
      'Map team needs, governance constraints, risk ownership, support model, and migration priorities before drawing the architecture.',
    stretch:
      'Write a phased adoption roadmap, exception process, funding model, and operating metrics for a shared cloud platform.',
    resources: [
      { label: 'Azure Landing Zones', url: 'https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/' },
      { label: 'Azure Well-Architected Framework', url: 'https://learn.microsoft.com/azure/well-architected/' },
      { label: 'FinOps Framework', url: 'https://www.finops.org/framework/' },
    ],
  },
  {
    id: 'ai-prompt-evaluation-workbook',
    sequence: 1,
    title: 'AI 1: Prompt evaluation workbook',
    difficulty: 'analyst',
    topic: 'ai',
    timeframe: '1 week',
    build:
      'Create a prompt workbook for a business task with test cases, expected outputs, failure examples, scoring rubric, and usage boundaries.',
    analystAngle:
      'Define the business decision being supported, source of truth, risky outputs, and what a good answer must include or refuse.',
    stretch:
      'Add a lightweight evaluation harness and compare prompt versions against the same test set.',
    resources: [
      { label: 'OpenAI Prompt Engineering Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
      { label: 'Microsoft Responsible AI', url: 'https://www.microsoft.com/ai/responsible-ai' },
      { label: 'OpenAI Evals', url: 'https://github.com/openai/evals' },
    ],
  },
  {
    id: 'rag-knowledge-assistant',
    sequence: 2,
    title: 'AI 2: RAG knowledge assistant',
    difficulty: 'software-engineer',
    topic: 'ai',
    timeframe: '2 to 4 weeks',
    build:
      'Build a retrieval-augmented assistant over local documents with chunking, embeddings, citations, answer evaluation, and refusal behavior.',
    analystAngle:
      'Clarify the knowledge boundaries, source authority, and acceptance criteria for useful versus risky answers.',
    stretch:
      'Add evaluation datasets, prompt/version tracking, privacy notes, and a cost-latency-quality tradeoff memo.',
    resources: [
      { label: 'Microsoft RAG Guidance', url: 'https://learn.microsoft.com/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide' },
      { label: 'OpenAI Cookbook', url: 'https://cookbook.openai.com/' },
      { label: 'LangChain RAG Concepts', url: 'https://python.langchain.com/docs/concepts/rag/' },
    ],
  },
  {
    id: 'ai-agent-workflow',
    sequence: 3,
    title: 'AI 3: Tool-using workflow assistant',
    difficulty: 'software-engineer',
    topic: 'ai',
    timeframe: '2 to 3 weeks',
    build:
      'Build an assistant that can inspect structured data, call a small set of tools, summarize findings, and ask for clarification when required.',
    analystAngle:
      'Define which decisions the assistant can make, which require human approval, and what evidence must be shown.',
    stretch:
      'Add tool-call audit logs, guardrails, regression tests, and a failure-analysis report for wrong or incomplete answers.',
    resources: [
      { label: 'OpenAI Function Calling', url: 'https://platform.openai.com/docs/guides/function-calling' },
      { label: 'Model Context Protocol', url: 'https://modelcontextprotocol.io/docs' },
      { label: 'LangGraph Concepts', url: 'https://langchain-ai.github.io/langgraph/concepts/' },
    ],
  },
  {
    id: 'ai-production-evaluation',
    sequence: 4,
    title: 'AI 4: Production evaluation and monitoring',
    difficulty: 'senior-engineer',
    topic: 'ai',
    timeframe: '2 to 4 weeks',
    build:
      'Create an evaluation and monitoring suite for an AI feature with golden datasets, quality metrics, safety checks, cost tracking, and drift review.',
    analystAngle:
      'Define measurable user value, unacceptable failure modes, review workflows, and escalation paths before selecting metrics.',
    stretch:
      'Write a launch readiness review, rollback plan, experiment design, and ongoing governance checklist.',
    resources: [
      { label: 'Microsoft RAG Evaluation', url: 'https://learn.microsoft.com/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide' },
      { label: 'OpenTelemetry Semantic Conventions for GenAI', url: 'https://opentelemetry.io/docs/specs/semconv/gen-ai/' },
      { label: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
    ],
  },
  {
    id: 'ai-platform-strategy',
    sequence: 5,
    title: 'AI 5: Enterprise AI platform strategy',
    difficulty: 'principal-engineer',
    topic: 'ai',
    timeframe: '3 to 6 weeks',
    build:
      'Design an AI enablement platform with model access, data controls, evaluation standards, guardrails, cost management, and adoption patterns.',
    analystAngle:
      'Map candidate use cases, risk tiers, data sensitivity, business owners, and governance needs before recommending platform capabilities.',
    stretch:
      'Create a platform roadmap, operating model, reusable reference architectures, and executive risk-benefit narrative.',
    resources: [
      { label: 'Azure AI Architecture Center', url: 'https://learn.microsoft.com/azure/architecture/ai-ml/' },
      { label: 'NIST AI RMF Playbook', url: 'https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook' },
      { label: 'OpenAI Safety Best Practices', url: 'https://platform.openai.com/docs/guides/safety-best-practices' },
    ],
  },
  {
    id: 'architecture-context-diagram',
    sequence: 1,
    title: 'Architecture 1: System context and requirements map',
    difficulty: 'analyst',
    topic: 'architecture',
    timeframe: '1 week',
    build:
      'Choose a familiar business workflow and create stakeholder maps, context diagrams, quality attributes, constraints, and decision questions.',
    analystAngle:
      'Focus on who uses the system, what decisions it supports, where handoffs occur, and what outcomes matter.',
    stretch:
      'Turn the analysis into architecture decision records and a risk register that a senior engineer could act on.',
    resources: [
      { label: 'C4 Model', url: 'https://c4model.com/' },
      { label: 'Architecture Decision Records', url: 'https://adr.github.io/' },
      { label: 'arc42 Template', url: 'https://arc42.org/' },
    ],
  },
  {
    id: 'architecture-modular-monolith',
    sequence: 2,
    title: 'Architecture 2: Modular monolith',
    difficulty: 'software-engineer',
    topic: 'architecture',
    timeframe: '2 weeks',
    build:
      'Build a small modular monolith with clear module boundaries, internal contracts, shared database rules, and tests around cross-module behavior.',
    analystAngle:
      'Define business capabilities and ownership boundaries before creating project folders or classes.',
    stretch:
      'Document why a modular monolith is preferable to microservices at this stage and what signals would justify splitting later.',
    resources: [
      { label: 'Domain-Driven Design Reference', url: 'https://www.domainlanguage.com/ddd/reference/' },
      { label: 'Microsoft Architecture Styles', url: 'https://learn.microsoft.com/azure/architecture/guide/architecture-styles/' },
      { label: 'Modular Monoliths', url: 'https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer' },
    ],
  },
  {
    id: 'event-driven-ordering',
    sequence: 3,
    title: 'Architecture 3: Event-driven order workflow',
    difficulty: 'senior-engineer',
    topic: 'architecture',
    timeframe: '2 to 4 weeks',
    build:
      'Model an order lifecycle with commands, events, retries, dead-letter handling, and read models for operational status.',
    analystAngle:
      'Start from the business lifecycle and exception paths, then decide where async messaging improves or hurts clarity.',
    stretch:
      'Document consistency tradeoffs, replay behavior, operational dashboards, and failure-mode recovery steps.',
    resources: [
      { label: 'Azure Architecture Center: Event-driven architecture', url: 'https://learn.microsoft.com/azure/architecture/guide/architecture-styles/event-driven' },
      { label: 'CloudEvents Spec', url: 'https://cloudevents.io/' },
      { label: 'Enterprise Integration Patterns', url: 'https://www.enterpriseintegrationpatterns.com/patterns/messaging/' },
    ],
  },
  {
    id: 'architecture-migration-plan',
    sequence: 4,
    title: 'Architecture 4: Legacy modernization plan',
    difficulty: 'senior-engineer',
    topic: 'architecture',
    timeframe: '2 to 4 weeks',
    build:
      'Create a modernization plan for a legacy application with current-state mapping, strangler migration slices, risks, data movement, and rollout sequencing.',
    analystAngle:
      'Capture business-critical workflows, operational pain, compliance constraints, user disruption, and migration acceptance criteria.',
    stretch:
      'Compare migration options, define architecture fitness functions, and write a decision memo for leadership.',
    resources: [
      { label: 'Strangler Fig Pattern', url: 'https://learn.microsoft.com/azure/architecture/patterns/strangler-fig' },
      { label: 'AWS Migration Strategy', url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-strategy/welcome.html' },
      { label: 'Architecture Tradeoff Analysis Method', url: 'https://insights.sei.cmu.edu/library/the-architecture-tradeoff-analysis-method/' },
    ],
  },
  {
    id: 'platform-reference-architecture',
    sequence: 5,
    title: 'Architecture 5: Platform reference architecture review',
    difficulty: 'principal-engineer',
    topic: 'architecture',
    timeframe: '3 to 6 weeks',
    build:
      'Design a reference architecture for a multi-team product platform: API standards, identity, observability, data boundaries, deployment, and governance.',
    analystAngle:
      'Map stakeholders, constraints, risks, and decision records so the architecture explains tradeoffs, not just components.',
    stretch:
      'Write an adoption roadmap, maturity model, paved-road exceptions process, and executive-level risk narrative.',
    resources: [
      { label: 'Azure Well-Architected Framework', url: 'https://learn.microsoft.com/azure/well-architected/' },
      { label: 'Architecture Decision Records', url: 'https://adr.github.io/' },
      { label: 'C4 Model', url: 'https://c4model.com/' },
    ],
  },
];

const demoProjects = buildDemoProjectCurriculum();

function buildDemoProjectCurriculum() {
  const topicProfiles = {
    'ui-react': {
      shortName: 'React',
      domain: 'React product experience',
      system: 'component, state, accessibility, and design-system workflow',
      artifact: 'React component contract and interaction map',
      resourceLabels: ['React Docs', 'Testing Library', 'WAI-ARIA Authoring Practices'],
      resourceUrls: ['https://react.dev/learn', 'https://testing-library.com/docs/', 'https://www.w3.org/WAI/ARIA/apg/'],
    },
    'full-stack': {
      shortName: 'Full stack',
      domain: 'full-stack product slice',
      system: 'React UI, API, data, security, cloud, and observability workflow',
      artifact: 'full-stack architecture brief',
      resourceLabels: ['React Docs', 'ASP.NET Core Web APIs', 'Azure Well-Architected Framework'],
      resourceUrls: ['https://react.dev/learn', 'https://learn.microsoft.com/aspnet/core/web-api/', 'https://learn.microsoft.com/azure/well-architected/'],
    },
    'web-api': {
      shortName: 'API',
      domain: 'API product',
      system: 'service and consumer workflow',
      artifact: 'OpenAPI contract',
      resourceLabels: ['OpenAPI Specification', 'Microsoft REST API Guidelines', 'Problem Details for HTTP APIs'],
      resourceUrls: ['https://spec.openapis.org/oas/latest.html', 'https://github.com/microsoft/api-guidelines', 'https://www.rfc-editor.org/rfc/rfc9457.html'],
    },
    data: {
      shortName: 'Data',
      domain: 'data product',
      system: 'pipeline, model, and dashboard workflow',
      artifact: 'data contract and metric definitions',
      resourceLabels: ['DuckDB Guides', 'Great Expectations', 'Data Mesh Principles'],
      resourceUrls: ['https://duckdb.org/docs/guides/', 'https://docs.greatexpectations.io/docs/', 'https://martinfowler.com/articles/data-mesh-principles.html'],
    },
    security: {
      shortName: 'Security',
      domain: 'secure application capability',
      system: 'identity, threat, and control workflow',
      artifact: 'threat model and control checklist',
      resourceLabels: ['OWASP ASVS', 'NIST Cybersecurity Framework', 'CISA Secure by Design'],
      resourceUrls: ['https://owasp.org/www-project-application-security-verification-standard/', 'https://www.nist.gov/cyberframework', 'https://www.cisa.gov/securebydesign'],
    },
    cloud: {
      shortName: 'Cloud',
      domain: 'cloud-hosted service',
      system: 'deployment, operations, and reliability workflow',
      artifact: 'cloud deployment runbook',
      resourceLabels: ['Azure Well-Architected Framework', 'OpenTelemetry Docs', 'FinOps Framework'],
      resourceUrls: ['https://learn.microsoft.com/azure/well-architected/', 'https://opentelemetry.io/docs/', 'https://www.finops.org/framework/'],
    },
    ai: {
      shortName: 'AI',
      domain: 'AI-assisted product feature',
      system: 'prompt, retrieval, evaluation, and governance workflow',
      artifact: 'AI evaluation rubric',
      resourceLabels: ['Microsoft RAG Guidance', 'NIST AI Risk Management Framework', 'OpenAI Cookbook'],
      resourceUrls: ['https://learn.microsoft.com/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide', 'https://www.nist.gov/itl/ai-risk-management-framework', 'https://cookbook.openai.com/'],
    },
    architecture: {
      shortName: 'Architecture',
      domain: 'architecture decision space',
      system: 'system design, modernization, and platform workflow',
      artifact: 'architecture decision record set',
      resourceLabels: ['C4 Model', 'Architecture Decision Records', 'Azure Architecture Center'],
      resourceUrls: ['https://c4model.com/', 'https://adr.github.io/', 'https://learn.microsoft.com/azure/architecture/'],
    },
  };
  const levelProjectTemplates = {
    analyst: [
      {
        name: 'Discovery map',
        build: ({ domain, system }) => `Map the ${domain}: stakeholders, user journeys, business events, system boundaries, assumptions, and unanswered questions for the ${system}.`,
        analystAngle: ({ artifact }) => `Produce interview notes, a glossary, and a first-pass ${artifact} outline that an engineer could challenge.`,
        stretch: 'Define what evidence would prove the problem is worth solving and what would make the project unsafe or low-value.',
      },
      {
        name: 'Requirements workbook',
        build: ({ domain }) => `Write user stories, acceptance criteria, edge cases, and non-functional requirements for the ${domain}.`,
        analystAngle: ({ artifact }) => `Connect each requirement to a concrete example and a validation method in the ${artifact}.`,
        stretch: 'Separate must-have behavior from nice-to-have behavior and identify what should be deferred to a later engineering iteration.',
      },
      {
        name: 'Contract and data model',
        build: ({ domain, artifact }) => `Create the first ${artifact} and a simple data model for the ${domain}, including valid examples and invalid examples.`,
        analystAngle: 'Explain each field, state, or rule in business language before making it technical.',
        stretch: 'Add traceability from stakeholder goals to fields, states, validations, and expected system responses.',
      },
      {
        name: 'Exception and risk review',
        build: ({ domain }) => `Catalog failure paths, misuse cases, operational risks, and support scenarios for the ${domain}.`,
        analystAngle: 'Turn ambiguous risks into testable acceptance criteria and decision questions.',
        stretch: 'Rank risks by impact and likelihood, then recommend which risks must be handled before engineering begins.',
      },
      {
        name: 'Engineer-ready handoff',
        build: ({ domain }) => `Package the ${domain} work into a handoff: scope, diagrams, requirements, examples, open questions, and a demo script.`,
        analystAngle: 'Make the handoff clear enough that a developer can estimate and start without another meeting.',
        stretch: 'Add a readiness checklist that shows what makes this ready for software-engineer-level implementation.',
      },
    ],
    'software-engineer': [
      {
        name: 'Vertical slice',
        build: ({ domain, system }) => `Build the smallest working vertical slice of the ${domain}, connecting the main user action through the ${system}.`,
        analystAngle: 'Start from the analyst-level acceptance criteria and prove one complete workflow works end to end.',
        stretch: 'Keep the design intentionally simple and document what you are not solving yet.',
      },
      {
        name: 'Persistence and validation',
        build: ({ artifact }) => `Add durable storage, validation, consistent error handling, and examples that match the ${artifact}.`,
        analystAngle: 'Translate every invalid business state into a clear user-facing or API-facing response.',
        stretch: 'Add test data, integration tests, and a short note on data integrity risks.',
      },
      {
        name: 'Workflow experience',
        build: ({ system }) => `Build a usable workflow experience around the ${system}: list, detail, create/update, status changes, and empty/error states.`,
        analystAngle: 'Use real workflow language so the UI or interaction model mirrors how stakeholders think.',
        stretch: 'Add accessibility, loading states, and a demo path that shows both happy path and exception path.',
      },
      {
        name: 'Testing and quality gate',
        build: ({ domain }) => `Add unit, integration, and end-to-end checks around the highest-risk behavior in the ${domain}.`,
        analystAngle: 'Map tests back to acceptance criteria so quality is tied to requirements, not just code coverage.',
        stretch: 'Add CI, lint/build checks, and a defect log that explains what each test prevents.',
      },
      {
        name: 'Local release package',
        build: ({ domain }) => `Package the ${domain} as a portfolio-ready demo with setup instructions, seeded data, screenshots or sample calls, and known limitations.`,
        analystAngle: 'Write the README for a reviewer who wants to understand the business value before the implementation details.',
        stretch: 'Add a technical debt list and readiness checklist for senior-level hardening.',
      },
    ],
    'senior-engineer': [
      {
        name: 'Reliability hardening',
        build: ({ domain }) => `Harden the ${domain} for retries, idempotency, timeouts, recoverable failures, and clear operational behavior.`,
        analystAngle: 'Prioritize failure modes by customer impact and support cost before choosing technical patterns.',
        stretch: 'Document tradeoffs, fallback behavior, and how you would test failure scenarios.',
      },
      {
        name: 'Observability and operations',
        build: ({ system }) => `Add structured logs, metrics, traces or diagnostics, dashboards, alerts, and a runbook for the ${system}.`,
        analystAngle: 'Define what operators and stakeholders need to know when the system is slow, wrong, or unavailable.',
        stretch: 'Add service-level indicators and an incident review template.',
      },
      {
        name: 'Security and governance',
        build: ({ domain }) => `Add security controls, authorization or policy checks, audit events, dependency review, and governance notes for the ${domain}.`,
        analystAngle: 'Connect controls to risks, user roles, data sensitivity, and compliance-style evidence.',
        stretch: 'Create a threat model, exception process, and secure rollout checklist.',
      },
      {
        name: 'Scale and evolution',
        build: ({ system }) => `Stress the ${system}, identify bottlenecks, improve performance, and document where the design will need to evolve.`,
        analystAngle: 'Tie scale targets to realistic user journeys and business volume assumptions.',
        stretch: 'Compare at least two design alternatives and explain why you selected one.',
      },
      {
        name: 'Production readiness review',
        build: ({ domain }) => `Create a production-readiness package for the ${domain}: architecture notes, risks, rollout, rollback, monitoring, support, and ownership.`,
        analystAngle: 'Show how the system will be operated and changed safely after launch.',
        stretch: 'Make this package strong enough to justify moving into principal-level platform or strategy decisions.',
      },
    ],
    'principal-engineer': [
      {
        name: 'Reference architecture',
        build: ({ domain }) => `Design a reference architecture for the ${domain}, including standards, boundaries, shared capabilities, and decision records.`,
        analystAngle: 'Map stakeholders, organizational constraints, adoption barriers, and business outcomes before proposing the architecture.',
        stretch: 'Explain which decisions should be centralized and which should remain team-owned.',
      },
      {
        name: 'Platform enablement model',
        build: ({ domain }) => `Define a platform or enablement model for the ${domain}: paved roads, templates, guardrails, reusable components, and support expectations.`,
        analystAngle: 'Identify which team pains repeat often enough to deserve platform investment.',
        stretch: 'Include contribution rules, exception handling, and success metrics.',
      },
      {
        name: 'Adoption roadmap',
        build: ({ domain }) => `Create a multi-phase adoption roadmap for the ${domain}, showing pilot teams, migration waves, dependencies, and measurable outcomes.`,
        analystAngle: 'Balance delivery value, risk reduction, team capacity, and stakeholder trust.',
        stretch: 'Add sequencing rationale and a communication plan for leaders and delivery teams.',
      },
      {
        name: 'Operating model',
        build: ({ domain }) => `Design the operating model for the ${domain}: ownership, governance, support, funding, standards review, and lifecycle management.`,
        analystAngle: 'Make decision rights explicit so architecture does not become an informal bottleneck.',
        stretch: 'Add a maturity model and governance metrics that show whether the operating model is working.',
      },
      {
        name: 'Executive strategy narrative',
        build: ({ domain }) => `Write an executive-ready strategy narrative for the ${domain}, connecting technical direction to business outcomes, risk, investment, and roadmap tradeoffs.`,
        analystAngle: 'Translate technical complexity into decisions leaders can make without losing engineering nuance.',
        stretch: 'Use this as the capstone that proves readiness to move from principal-level thinking into broader technical leadership.',
      },
    ],
  };

  const resolveTemplateValue = (value, profile) =>
    typeof value === 'function' ? value(profile) : value;

  return Object.entries(topicProfiles).flatMap(([topicId, topicProfile]) =>
    Object.entries(levelProjectTemplates).flatMap(([difficulty, templates]) =>
      templates.map((template, index) => ({
        id: `${topicId}-${difficulty}-${index + 1}`,
        sequence: index + 1,
        title: `${topicProfile.shortName} ${labelForDemoProjectDifficulty(difficulty)} ${index + 1}: ${template.name}`,
        difficulty,
        topic: topicId,
        timeframe: timeframeForDemoProject(difficulty, index + 1),
        build: resolveTemplateValue(template.build, topicProfile),
        analystAngle: resolveTemplateValue(template.analystAngle, topicProfile),
        stretch: resolveTemplateValue(template.stretch, topicProfile),
        resources: topicProfile.resourceLabels.map((label, resourceIndex) => ({
          label,
          url: topicProfile.resourceUrls[resourceIndex],
        })),
      })),
    ),
  );
}

function timeframeForDemoProject(difficulty, sequence) {
  if (difficulty === 'analyst') {
    return sequence < 5 ? '2 to 4 focused sessions' : '1 week';
  }

  if (difficulty === 'software-engineer') {
    return sequence < 5 ? '1 to 2 weeks' : '2 weeks';
  }

  if (difficulty === 'senior-engineer') {
    return sequence < 5 ? '2 to 3 weeks' : '3 to 4 weeks';
  }

  return sequence < 5 ? '3 to 5 weeks' : '4 to 6 weeks';
}

function extensionFor(file) {
  return file.name.split('.').pop()?.toLowerCase() ?? '';
}

function randomRecentPapers(count) {
  const selectedPapers = [];
  const selectedPaperIds = new Set();

  subjectTabs
    .filter((subject) => subject.id !== 'all')
    .forEach((subject) => {
      const subjectPapers = filterPapersBySubject(technicalPapers, subject.id);
      const recentPapers = shufflePapers(subjectPapers.filter((paper) => paper.year >= 2018));
      const olderPapers = shufflePapers(subjectPapers.filter((paper) => paper.year < 2018));

      [...recentPapers, ...olderPapers].slice(0, count).forEach((paper) => {
        if (!selectedPaperIds.has(paper.id)) {
          selectedPaperIds.add(paper.id);
          selectedPapers.push(paper);
        }
      });
    });

  return selectedPapers;
}

function shufflePapers(papers) {
  return [...papers].sort(() => Math.random() - 0.5);
}

function totalLearningPathPapers() {
  return learningPathStages.reduce((total, stage) => total + stage.papers.length, 0);
}

function countDemoProjects(activeDifficulty, activeTopic) {
  return demoProjects.filter((project) => (
    (activeDifficulty === 'all' || project.difficulty === activeDifficulty) &&
    (activeTopic === 'all' || project.topic === activeTopic)
  )).length;
}

function filterDemoProjects(projects, activeDifficulty, activeTopic, searchQuery) {
  const normalizedSearchQuery = normalizeComparableText(searchQuery);

  return projects.filter((project) => {
    const matchesDifficulty = activeDifficulty === 'all' || project.difficulty === activeDifficulty;
    const matchesTopic = activeTopic === 'all' || project.topic === activeTopic;
    const matchesSearch =
      !normalizedSearchQuery ||
      searchableDemoProjectText(project).includes(normalizedSearchQuery);

    return matchesDifficulty && matchesTopic && matchesSearch;
  }).sort(orderDemoProjects);
}

function orderDemoProjects(leftProject, rightProject) {
  return (
    topicOrderForDemoProject(leftProject.topic) - topicOrderForDemoProject(rightProject.topic) ||
    difficultyOrderForDemoProject(leftProject.difficulty) - difficultyOrderForDemoProject(rightProject.difficulty) ||
    leftProject.sequence - rightProject.sequence ||
    leftProject.title.localeCompare(rightProject.title)
  );
}

function difficultyOrderForDemoProject(difficultyId) {
  const difficultyIndex = demoProjectDifficulties.findIndex((difficulty) => difficulty.id === difficultyId);
  return difficultyIndex === -1 ? Number.MAX_SAFE_INTEGER : difficultyIndex;
}

function topicOrderForDemoProject(topicId) {
  const topicIndex = demoProjectTopics.findIndex((topic) => topic.id === topicId);
  return topicIndex === -1 ? Number.MAX_SAFE_INTEGER : topicIndex;
}

function searchableDemoProjectText(project) {
  return normalizeComparableText([
    project.title,
    project.difficulty,
    project.topic,
    project.timeframe,
    demoProjectContext(project),
    project.build,
    project.analystAngle,
    project.stretch,
    ...demoProjectDeliverables(project),
    ...demoProjectAcceptanceCriteria(project),
    reactUiPlanForDemoProject(project),
    reactStarterCodeForProject(project),
    verboseDemoProjectPrompt(project),
    ...project.resources.map((resource) => resource.label),
  ].join(' '));
}

function verboseDemoProjectPrompt(project) {
  const primaryDeliverables = demoProjectDeliverables(project).slice(0, 3).join(' ');

  return [
    `Build "${project.title}" as a ${labelForDemoProjectDifficulty(project.difficulty).toLowerCase()} ${labelForDemoProjectTopic(project.topic).toLowerCase()} demo.`,
    `Focus on this outcome: ${project.build}`,
    `React UI requirement: ${reactUiPlanForDemoProject(project)}`,
    `Most important deliverables: ${primaryDeliverables}`,
    `Stretch goal: ${project.stretch}`,
  ].join(' ');
}

function demoProjectContext(project) {
  const topicContexts = {
    'ui-react': {
      domain:
        'You are building the front end for an internal engineering enablement portal used by analysts, developers, and tech leads to plan work and review delivery readiness.',
      users:
        'Primary users are a software analyst refining requirements, an engineer implementing a slice, and a lead reviewing accessibility, usability, and component reuse.',
      data:
        'Use fixture data for work items, statuses, owners, risks, comments, and review decisions before connecting to an API.',
    },
    'full-stack': {
      domain:
        'You are building a small delivery-readiness product for a team that needs one place to track requirements, API work, data checks, security review, deployment health, and operational follow-up.',
      users:
        'Primary users are a product analyst, full-stack engineer, security reviewer, and delivery lead preparing a feature for release.',
      data:
        'Use a local database or seeded JSON for projects, requirements, API checks, data-quality results, risk items, release events, and audit history.',
    },
    'web-api': {
      domain:
        'You are building an API-backed workflow for a service team that owns a request intake and fulfillment process used by multiple internal consumers.',
      users:
        'Primary users are an API consumer developer, service owner, analyst validating requirements, and support engineer investigating failed requests.',
      data:
        'Model requests, customers or teams, statuses, comments, validation failures, pagination, and immutable audit events.',
    },
    data: {
      domain:
        'You are building a data-quality and reporting workflow for operations teams reconciling records from two source systems before metrics are trusted.',
      users:
        'Primary users are a data analyst, operations reviewer, engineer owning ingestion, and leader checking KPI confidence.',
      data:
        'Model source files, import runs, reconciliation exceptions, metric definitions, data-quality rules, approvals, and lineage notes.',
    },
    security: {
      domain:
        'You are building a security review workflow for an application team that must prove access, audit, and risk controls before launch.',
      users:
        'Primary users are an engineer, security reviewer, risk owner, and support lead who need clear evidence rather than vague security claims.',
      data:
        'Model users, roles, protected actions, policy decisions, audit events, findings, mitigations, and exception approvals.',
    },
    cloud: {
      domain:
        'You are building a deployment and operations workflow for a small cloud-hosted service that needs repeatable releases and visible health.',
      users:
        'Primary users are an engineer deploying changes, an operator responding to incidents, and a delivery lead checking release readiness.',
      data:
        'Model environments, releases, health checks, configuration values, incidents, rollback decisions, cost notes, and runbook tasks.',
    },
    ai: {
      domain:
        'You are building an AI-assisted feature review workflow where users need evidence, evaluation results, and human approval before trusting generated output.',
      users:
        'Primary users are an analyst preparing prompts, an engineer wiring retrieval or tools, and a reviewer judging quality, safety, and usefulness.',
      data:
        'Model prompts, input documents, generated answers, citations, evaluation cases, reviewer decisions, failure labels, and cost/latency observations.',
    },
    architecture: {
      domain:
        'You are building an architecture decision workspace for a modernization effort where teams need traceable decisions and visible tradeoffs.',
      users:
        'Primary users are a tech lead, architect, product partner, platform owner, and delivery team planning phased change.',
      data:
        'Model capabilities, system boundaries, dependencies, ADRs, risks, quality attributes, migration waves, and ownership decisions.',
    },
  };
  const sequenceContexts = {
    1: 'This first demo should make the problem understandable: define the actors, workflow, current pain, decision points, and what a successful first slice proves.',
    2: 'This second demo should turn the problem into a working implementation with explicit validation, realistic sample data, and a small but complete user journey.',
    3: 'This third demo should focus on workflow depth: state transitions, exceptions, review loops, comments, auditability, and how users recover from mistakes.',
    4: 'This fourth demo should harden the solution: permissions, reliability, performance, observability, edge cases, and production-style failure handling.',
    5: 'This fifth demo should package the work for reuse or leadership review: standards, templates, roadmap, operating model, adoption plan, and decision narrative.',
  };
  const difficultyContexts = {
    analyst:
      'Keep the implementation lightweight; the main artifact is clarity that lets an engineer build without another discovery meeting.',
    'software-engineer':
      'Build a runnable vertical slice with enough real behavior that a reviewer can use the UI and inspect the underlying contracts or data.',
    'senior-engineer':
      'Treat the feature as something that could break in production; emphasize failure modes, operations, risk, and maintainable evolution.',
    'principal-engineer':
      'Treat the demo as a reusable direction for multiple teams; emphasize standards, adoption, governance, and strategic tradeoffs.',
  };
  const context = topicContexts[project.topic] ?? topicContexts['full-stack'];

  return [
    context.domain,
    context.users,
    context.data,
    sequenceContexts[project.sequence],
    difficultyContexts[project.difficulty],
  ].join(' ');
}

function demoProjectDeliverables(project) {
  const sharedDeliverables = [
    'A one-page requirements brief with personas, workflow states, acceptance criteria, assumptions, and out-of-scope items.',
    'A React UI with dashboard/list, detail, create-or-update, loading, empty, validation, and error states.',
    'A README with setup steps, demo script, sample data, tradeoffs, and follow-up backlog.',
  ];
  const topicDeliverables = {
    'ui-react': [
      'A component inventory with props, states, keyboard behavior, responsive breakpoints, and reusable styling decisions.',
      'Interaction tests for the highest-value component behavior using Testing Library.',
    ],
    'full-stack': [
      'A React client, API contract, persistence model, seeded data, authentication or role assumptions, and health/diagnostic view.',
      'At least one end-to-end workflow that crosses UI, API, validation, storage, and observable operational behavior.',
    ],
    'web-api': [
      'An OpenAPI-style endpoint contract with request/response examples, validation rules, pagination or filtering, and problem-detail errors.',
      'A React API consumer screen that exercises happy path, validation failure, empty state, and retryable failure.',
    ],
    data: [
      'A seeded dataset, import or transform path, metric definitions, data-quality checks, and a reconciliation or KPI dashboard.',
      'A data dictionary that explains grain, ownership, freshness, and known limitations.',
    ],
    security: [
      'A misuse-case list, threat model, policy decisions, audit events, and security test cases tied to user roles.',
      'A React security review screen that makes permissions, audit history, or control status visible.',
    ],
    cloud: [
      'Environment configuration, deployment steps, health checks, rollback notes, cost assumptions, and operational runbook.',
      'A React operations panel showing release status, service health, incidents, or configuration drift.',
    ],
    ai: [
      'Prompt or retrieval design, evaluation dataset, quality metrics, safety checks, and human-review workflow.',
      'A React evaluation console showing inputs, outputs, confidence, citations or evidence, and review decisions.',
    ],
    architecture: [
      'Context diagram, key ADRs, quality attributes, dependency map, rollout plan, and architecture risk register.',
      'A React architecture explorer that lets a reviewer move between capabilities, decisions, risks, and roadmap items.',
    ],
  };

  return [
    ...sharedDeliverables,
    ...(topicDeliverables[project.topic] ?? []),
    ...difficultyDeliverables(project.difficulty),
  ];
}

function difficultyDeliverables(difficulty) {
  const deliverablesByDifficulty = {
    analyst: [
      'A developer-ready handoff package; implementation can be a clickable React prototype backed by fixture data.',
    ],
    'software-engineer': [
      'A working vertical slice with realistic data, validation, tests, and local run instructions.',
    ],
    'senior-engineer': [
      'Failure-mode tests, observability notes, risk register, rollout/rollback plan, and production-readiness checklist.',
    ],
    'principal-engineer': [
      'Reference architecture, paved-road template or standards, adoption roadmap, operating model, and executive narrative.',
    ],
  };

  return deliverablesByDifficulty[difficulty] ?? [];
}

function demoProjectAcceptanceCriteria(project) {
  const topicLabel = labelForDemoProjectTopic(project.topic).toLowerCase();
  const difficultyLabel = labelForDemoProjectDifficulty(project.difficulty).toLowerCase();

  return [
    `A reviewer can run or inspect the ${topicLabel} demo locally in under 10 minutes using the README.`,
    'The React UI demonstrates at least one happy path, one empty state, one validation error, and one recoverable error.',
    `The solution includes tests or review checks appropriate for a ${difficultyLabel} project, with each check mapped back to an acceptance criterion.`,
    'The final notes explain tradeoffs, what was intentionally deferred, and what would change before production use.',
  ];
}

function reactUiPlanForDemoProject(project) {
  const topicLabel = labelForDemoProjectTopic(project.topic).toLowerCase();

  if (project.topic === 'ui-react') {
    return 'Treat the UI as the main product: design component states, keyboard flow, responsive layout, loading/error/empty states, and a small component API before wiring data.';
  }

  if (project.topic === 'full-stack') {
    return 'Build a React experience that proves the whole product slice: dashboard, detail workflow, form validation, API loading states, auth-aware actions, and operational health cues.';
  }

  return `Add a React companion UI for the ${topicLabel} work: a dashboard or workflow screen, a detail panel, form validation, loading/error/empty states, and at least one reusable component.`;
}

function reactStarterCodeForProject(project) {
  const componentName = reactComponentNameForDemoProject(project);
  const title = project.title.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

  return `import { useMemo, useState } from 'react';

const demoItems = [
  { id: 1, name: '${title}', status: 'In progress', owner: 'You' },
  { id: 2, name: 'Acceptance criteria review', status: 'Next', owner: 'Future you' },
];

export function ${componentName}() {
  const [selectedId, setSelectedId] = useState(demoItems[0].id);
  const selectedItem = useMemo(
    () => demoItems.find((item) => item.id === selectedId),
    [selectedId],
  );

  return (
    <main className="demo-shell">
      <header>
        <p className="eyebrow">${labelForDemoProjectTopic(project.topic)}</p>
        <h1>${title}</h1>
        <p>${reactUiPlanForDemoProject(project)}</p>
      </header>

      <section aria-label="Demo workflow">
        {demoItems.map((item) => (
          <button key={item.id} type="button" onClick={() => setSelectedId(item.id)}>
            {item.name} - {item.status}
          </button>
        ))}
      </section>

      <aside aria-label="Selected work item">
        <h2>{selectedItem?.name}</h2>
        <p>Status: {selectedItem?.status}</p>
        <p>Owner: {selectedItem?.owner}</p>
      </aside>
    </main>
  );
}`;
}

function reactComponentNameForDemoProject(project) {
  const baseName = project.id
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');

  return `${baseName || 'Demo'}Experience`;
}

function demoProjectCompletionPercent(progress) {
  const completedMilestones = progress?.completedMilestones ?? [];
  return Math.round((completedMilestones.length / demoProjectMilestones.length) * 100);
}

function subjectIdsForPaper(paper) {
  const text = `${paper.topic} ${paper.title} ${paper.summary}`.toLowerCase();
  const subjectIds = new Set(['all']);

  if (text.includes('finance') || text.includes('market') || text.includes('money')) {
    subjectIds.add('finance');
  }

  if (
    text.includes('security') ||
    text.includes('cyber') ||
    text.includes('zero trust') ||
    text.includes('cryptography') ||
    text.includes('threat')
  ) {
    subjectIds.add('cybersecurity');
  }

  if (text.includes('ai') || text.includes('machine learning') || text.includes('transformer')) {
    subjectIds.add('ai');
  }

  if (text.includes('database') || text.includes('databases') || text.includes('storage')) {
    subjectIds.add('databases');
  }

  if (text.includes('network') || text.includes('transport') || text.includes('tls') || text.includes('quic')) {
    subjectIds.add('networking');
  }

  if (text.includes('distributed') || text.includes('consensus') || text.includes('raft') || text.includes('paxos')) {
    subjectIds.add('distributed-systems');
  }

  if (!subjectIds.has('finance')) {
    subjectIds.add('computer-science');
  }

  return subjectIds;
}

function filterPapersBySubject(papers, activeSubject) {
  if (activeSubject === 'all') {
    return papers;
  }

  return papers.filter((paper) => subjectIdsForPaper(paper).has(activeSubject));
}

function orderPapers(papers, activeOrder) {
  return [...papers].sort((leftPaper, rightPaper) => {
    if (activeOrder === 'newest') {
      return yearForSort(rightPaper) - yearForSort(leftPaper);
    }

    if (activeOrder === 'oldest') {
      return yearForSort(leftPaper) - yearForSort(rightPaper);
    }

    if (activeOrder === 'title') {
      return leftPaper.title.localeCompare(rightPaper.title);
    }

    if (activeOrder === 'source') {
      return leftPaper.source.localeCompare(rightPaper.source) || leftPaper.title.localeCompare(rightPaper.title);
    }

    return timestampForSort(rightPaper) - timestampForSort(leftPaper);
  });
}

function yearForSort(paper) {
  return Number.isFinite(Number(paper.year)) ? Number(paper.year) : 0;
}

function timestampForSort(paper) {
  const timestamp = Date.parse(paper.savedAt || paper.discoveredAt || '');
  return Number.isFinite(timestamp) ? timestamp : 0;
}

async function searchOpenAccessResearchPapers(keyword) {
  const normalizedKeyword = keyword.trim().replace(/\s+/g, ' ');

  if (!normalizedKeyword) {
    throw new Error('Enter a keyword to search for research papers.');
  }

  const searchParams = new URLSearchParams({
    search: normalizedKeyword,
    filter: 'type:article,open_access.is_oa:true',
    per_page: String(researchSearchResultLimit),
    sort: 'relevance_score:desc',
  });
  const response = await fetch(`https://api.openalex.org/works?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Research search failed with HTTP ${response.status}.`);
  }

  const data = await response.json();

  return (data.results ?? [])
    .map((work) => openAlexWorkToPaper(work, normalizedKeyword))
    .filter(Boolean);
}

function openAlexWorkToPaper(work, keyword) {
  const title = work.title?.trim();
  const url =
    work.open_access?.oa_url ||
    work.primary_location?.landing_page_url ||
    work.doi ||
    work.id;

  if (!title || !url) {
    return null;
  }

  const source =
    work.primary_location?.source?.display_name ||
    work.host_venue?.display_name ||
    'OpenAlex';
  const abstract = abstractFromInvertedIndex(work.abstract_inverted_index);
  const summary =
    abstract ||
    `Open-access research result for "${keyword}" from OpenAlex.`;

  return {
    id: `openalex-${slugForPaperId(work.doi || work.id || title)}`,
    title,
    year: work.publication_year || 'Unknown year',
    topic: `Search: ${keyword}`,
    source,
    summary: summary.length > 260 ? `${summary.slice(0, 257).trim()}...` : summary,
    url,
  };
}

function abstractFromInvertedIndex(invertedIndex) {
  if (!invertedIndex) {
    return '';
  }

  return Object.entries(invertedIndex)
    .flatMap(([word, positions]) => positions.map((position) => [position, word]))
    .sort(([leftPosition], [rightPosition]) => leftPosition - rightPosition)
    .map(([, word]) => word)
    .join(' ');
}

function slugForPaperId(value) {
  return String(value)
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function relatedSearchKeywordForPaper(paper) {
  const topic = paper.topic.replace(/^Search:\s*/i, '').trim();
  return `${paper.title} ${topic}`.trim();
}

function isSamePaper(leftPaper, rightPaper) {
  return (
    normalizeComparableText(leftPaper.id) === normalizeComparableText(rightPaper.id) ||
    normalizeComparableText(leftPaper.title) === normalizeComparableText(rightPaper.title) ||
    normalizeComparableText(leftPaper.url) === normalizeComparableText(rightPaper.url)
  );
}

function normalizeComparableText(value) {
  return String(value ?? '').trim().toLowerCase();
}

function readStoredPapers(storageKey, fallbackStorageKey) {
  try {
    const storedPapers = JSON.parse(
      window.localStorage.getItem(storageKey) ??
      (fallbackStorageKey ? window.localStorage.getItem(fallbackStorageKey) : null) ??
      '[]',
    );

    return Array.isArray(storedPapers) ? storedPapers : [];
  } catch (error) {
    console.warn('Could not read stored technical reading library.', error);
    return [];
  }
}

function readStoredPaperProgress() {
  try {
    const storedProgress = JSON.parse(
      window.localStorage.getItem(paperProgressStorageKey) ??
      window.localStorage.getItem(legacyPaperProgressStorageKey) ??
      '{}',
    );

    return storedProgress && typeof storedProgress === 'object' && !Array.isArray(storedProgress)
      ? storedProgress
      : {};
  } catch (error) {
    console.warn('Could not read stored reading progress.', error);
    return {};
  }
}

function readStoredDemoProjectProgress() {
  try {
    const storedProgress = JSON.parse(
      window.localStorage.getItem(demoProjectProgressStorageKey) ??
      window.localStorage.getItem(legacyDemoProjectProgressStorageKey) ??
      '{}',
    );

    return storedProgress && typeof storedProgress === 'object' && !Array.isArray(storedProgress)
      ? storedProgress
      : {};
  } catch (error) {
    console.warn('Could not read stored demo project progress.', error);
    return {};
  }
}

function writeStoredValue(storageKey, value) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not save ${storageKey}.`, error);
  }
}

function resetAppStorageFromQueryString() {
  const searchParams = new URLSearchParams(window.location.search);

  if (!searchParams.has('resetStorage')) {
    return false;
  }

  for (const storageKey of appStorageKeys) {
    window.localStorage.removeItem(storageKey);
  }

  searchParams.delete('resetStorage');
  const nextSearch = searchParams.toString();
  const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
  window.history.replaceState(null, '', nextUrl);
  return true;
}

class StartupErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Engineering Growth Studio failed to render.', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="app-shell startup-error">
          <section className="hero">
            <p className="eyebrow">Startup issue</p>
            <h1>Engineering Growth Studio could not render.</h1>
            <p>
              Refresh the page. If it still fails, clear this site&apos;s local storage for
              127.0.0.1:5174 and launch the studio again.
            </p>
            <p className="status">{this.state.error.message}</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

function mergePapers(currentPapers, nextPapers, timestampKey) {
  const existingIds = new Set(currentPapers.map((paper) => paper.id));
  const newPapers = nextPapers
    .filter((paper) => !existingIds.has(paper.id))
    .map((paper) => ({ ...paper, [timestampKey]: new Date().toISOString() }));

  return [...newPapers, ...currentPapers];
}

function App() {
  const [didResetStorage] = useState(() => resetAppStorageFromQueryString());
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(
    didResetStorage
      ? 'Local Engineering Growth Studio data was cleared for this browser.'
      : 'Open the technical reading library, browse the project curriculum, or import a legally accessible document to start learning.',
  );
  const [textContent, setTextContent] = useState('');
  const [epubContent, setEpubContent] = useState('');
  const [objectUrl, setObjectUrl] = useState('');
  const [book, setBook] = useState(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [theme, setTheme] = useState('paper');
  const [showCatalog, setShowCatalog] = useState(false);
  const [catalogInitialTab, setCatalogInitialTab] = useState('starter');
  const [activePaper, setActivePaper] = useState(null);
  const [savedPapers, setSavedPapers] = useState(() =>
    readStoredPapers(userLibraryStorageKey, legacyUserLibraryStorageKey),
  );
  const [discoveredPapers, setDiscoveredPapers] = useState(() =>
    readStoredPapers(discoveredPapersStorageKey, legacyDiscoveredPapersStorageKey),
  );
  const [starterPapers, setStarterPapers] = useState(() => randomRecentPapers(5));
  const [paperProgress, setPaperProgress] = useState(() => readStoredPaperProgress());
  const [demoProjectProgress, setDemoProjectProgress] = useState(() => readStoredDemoProjectProgress());

  const extension = useMemo(() => (file ? extensionFor(file) : ''), [file]);
  const isText = ['txt', 'md', 'markdown', 'html', 'htm'].includes(extension);
  const isPdf = extension === 'pdf';
  const isEpub = extension === 'epub';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    writeStoredValue(userLibraryStorageKey, savedPapers);
  }, [savedPapers]);

  useEffect(() => {
    writeStoredValue(discoveredPapersStorageKey, discoveredPapers);
  }, [discoveredPapers]);

  useEffect(() => {
    writeStoredValue(paperProgressStorageKey, paperProgress);
  }, [paperProgress]);

  useEffect(() => {
    writeStoredValue(demoProjectProgressStorageKey, demoProjectProgress);
  }, [demoProjectProgress]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  async function loadFile(nextFile) {
    const nextExtension = extensionFor(nextFile);

    setFile(nextFile);
    setTextContent('');
    setEpubContent('');
    setChapterIndex(0);
    setStatus(`Loading ${nextFile.name}...`);
    setBook(null);
    setShowCatalog(false);
    setActivePaper(null);

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl('');
    }

    if (unsupportedProtectedTypes.includes(nextExtension)) {
      setStatus('Engineering Growth Studio supports legally accessible technical documents. Try an open PDF, EPUB, TXT, HTML, or Markdown file.');
      return;
    }

    if (!supportedTypes.includes(nextExtension)) {
      setStatus('Unsupported file type. Try a legally accessible technical document as a PDF, EPUB, TXT, HTML, or Markdown file.');
      return;
    }

    if (nextExtension === 'epub') {
      const nextBook = await loadEpub(nextFile);
      setBook(nextBook);
      setEpubContent(await renderEpubChapter(nextBook, 0));
      setStatus(`Reading ${nextFile.name} (${nextBook.spine.length} sections)`);
      return;
    }

    if (nextExtension === 'pdf') {
      setObjectUrl(URL.createObjectURL(nextFile));
      setStatus(`Reading ${nextFile.name}`);
      return;
    }

    setTextContent(await nextFile.text());
    setStatus(`Reading ${nextFile.name}`);
  }

  function onFileChange(event) {
    const [nextFile] = event.target.files;
    if (nextFile) {
      loadFile(nextFile).catch((error) => {
        console.error(error);
        setStatus(`Could not load file: ${error.message}`);
      });
    }
  }

  function openTechnicalPaperCatalog() {
    const nextStarterPapers = randomRecentPapers(5);
    setStarterPapers(nextStarterPapers);
    setDiscoveredPapers((currentPapers) =>
      mergePapers(currentPapers, nextStarterPapers, 'discoveredAt'),
    );
    setFile(null);
    setTextContent('');
    setEpubContent('');
    setChapterIndex(0);
    setBook(null);
    setCatalogInitialTab('starter');
    setShowCatalog(true);
    setActivePaper(null);
    setStatus('Browsing the curated technical reading library. Opening readings adds them to your library.');

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl('');
    }
  }

  function openDemoProjectCatalog() {
    setFile(null);
    setTextContent('');
    setEpubContent('');
    setChapterIndex(0);
    setBook(null);
    setCatalogInitialTab('demo-projects');
    setShowCatalog(true);
    setActivePaper(null);
    setStatus('Browsing demo projects. Pick a difficulty and topic to choose what to build next.');

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl('');
    }
  }

  async function searchResearchPapers(keyword) {
    setStatus(`Searching open-access research papers for "${keyword.trim()}"...`);
    const searchResults = await searchOpenAccessResearchPapers(keyword);
    const existingIds = new Set(discoveredPapers.map((paper) => paper.id));
    const addedCount = searchResults.filter((paper) => !existingIds.has(paper.id)).length;

    setDiscoveredPapers((currentPapers) =>
      mergePapers(currentPapers, searchResults, 'discoveredAt'),
    );

    setStatus(
      searchResults.length === 0
        ? `No open-access research papers found for "${keyword.trim()}".`
        : `Added ${addedCount} new paper${addedCount === 1 ? '' : 's'} for "${keyword.trim()}" to All found.`,
    );

    return { addedCount, resultCount: searchResults.length };
  }

  async function findMoreLikeThis(paper) {
    const keyword = relatedSearchKeywordForPaper(paper);
    setStatus(`Finding more open-access papers like "${paper.title}"...`);
    const searchResults = (await searchOpenAccessResearchPapers(keyword)).filter(
      (searchResult) => !isSamePaper(searchResult, paper),
    );
    const existingIds = new Set(discoveredPapers.map((currentPaper) => currentPaper.id));
    const addedCount = searchResults.filter((searchResult) => !existingIds.has(searchResult.id)).length;

    setDiscoveredPapers((currentPapers) =>
      mergePapers(currentPapers, searchResults, 'discoveredAt'),
    );

    setStatus(
      searchResults.length === 0
        ? `No related open-access papers found for "${paper.title}".`
        : `Added ${addedCount} related paper${addedCount === 1 ? '' : 's'} for "${paper.title}" to All found.`,
    );

    return { addedCount, resultCount: searchResults.length };
  }

  function savePaperToLibrary(paper) {
    const paperWithTimestamp = { ...paper, savedAt: new Date().toISOString() };
    setDiscoveredPapers((currentPapers) => mergePapers(currentPapers, [paper], 'discoveredAt'));
    setSavedPapers((currentPapers) => [
      paperWithTimestamp,
      ...currentPapers.filter((currentPaper) => currentPaper.id !== paper.id),
    ]);
    setStatus(`Saved "${paper.title}" to your local library.`);
  }

  function openPaper(paper) {
    savePaperToLibrary(paper);
    setFile(null);
    setTextContent('');
    setEpubContent('');
    setChapterIndex(0);
    setBook(null);
    setShowCatalog(false);
    setActivePaper(paper);
    setStatus(`Reading "${paper.title}" in the app.`);
  }

  function savePaperProgress(paper, page) {
    const normalizedPage = page.trim();

    if (!normalizedPage) {
      throw new Error('Enter the page you want to save for this paper.');
    }

    setPaperProgress((currentProgress) => ({
      ...currentProgress,
      [paper.id]: {
        page: normalizedPage,
        savedAt: new Date().toISOString(),
      },
    }));
    setStatus(`Saved page ${normalizedPage} for "${paper.title}".`);
  }

  function updateDemoProjectProgress(projectId, updates) {
    setDemoProjectProgress((currentProgress) => ({
      ...currentProgress,
      [projectId]: {
        status: 'not-started',
        completedMilestones: [],
        notes: '',
        ...currentProgress[projectId],
        ...updates,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function toggleDemoProjectMilestone(projectId, milestoneId) {
    setDemoProjectProgress((currentProgress) => {
      const projectProgress = {
        status: 'not-started',
        completedMilestones: [],
        notes: '',
        ...currentProgress[projectId],
      };
      const completedMilestones = new Set(projectProgress.completedMilestones);

      if (completedMilestones.has(milestoneId)) {
        completedMilestones.delete(milestoneId);
      } else {
        completedMilestones.add(milestoneId);
      }

      return {
        ...currentProgress,
        [projectId]: {
          ...projectProgress,
          status: completedMilestones.size > 0 && projectProgress.status === 'not-started'
            ? 'in-progress'
            : projectProgress.status,
          completedMilestones: [...completedMilestones],
          updatedAt: new Date().toISOString(),
        },
      };
    });
  }

  function nextPage() {
    if (!book || chapterIndex >= book.spine.length - 1) {
      return;
    }

    const nextIndex = chapterIndex + 1;
    renderEpubChapter(book, nextIndex).then((content) => {
      setChapterIndex(nextIndex);
      setEpubContent(content);
    });
  }

  function previousPage() {
    if (!book || chapterIndex <= 0) {
      return;
    }

    const nextIndex = chapterIndex - 1;
    renderEpubChapter(book, nextIndex).then((content) => {
      setChapterIndex(nextIndex);
      setEpubContent(content);
    });
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <p className="eyebrow">Engineering growth</p>
        <h1>Engineering Growth Studio</h1>
        <p className="lede">
          Read deeply, practice deliberately, and track your growth from analyst foundations to principal-level engineering.
        </p>

        <label className="file-picker">
          <span>Choose document</span>
          <input
            type="file"
            accept=".epub,.pdf,.txt,.md,.markdown,.html,.htm"
            onChange={onFileChange}
          />
        </label>

        <div className="status-card">
          <strong>Status</strong>
          <p>{status}</p>
        </div>

        <div className="library-card">
          <strong>Technical reading</strong>
          <p>Search for research papers and technical documents, save your library, and use the reading path to move toward senior and principal-level engineering conversations.</p>
          <button type="button" className="secondary-action" onClick={openTechnicalPaperCatalog}>
            Open reading library
          </button>
        </div>

        <div className="library-card">
          <strong>Demo projects</strong>
          <p>Find buildable project ideas by topic and difficulty, starting from software analyst foundations up through principal-level architecture work.</p>
          <button type="button" className="secondary-action" onClick={openDemoProjectCatalog}>
            Open demo projects
          </button>
        </div>

        <div className="controls">
          <button type="button" onClick={previousPage} disabled={!isEpub}>
            Previous section
          </button>
          <button type="button" onClick={nextPage} disabled={!isEpub}>
            Next section
          </button>
        </div>

        <label className="theme-picker">
          Theme
          <select value={theme} onChange={(event) => setTheme(event.target.value)}>
            <option value="paper">Paper</option>
            <option value="sepia">Sepia</option>
            <option value="night">Night</option>
          </select>
        </label>

        <p className="fine-print">
          This app is for legally accessible technical reading and local practice. Encrypted or
          DRM-protected files are not supported.
        </p>
      </aside>

      <section className="reader-panel" aria-label="Reader">
        {!file && !showCatalog && !activePaper && <EmptyState />}
        {showCatalog && (
          <PaperCatalog
            initialTab={catalogInitialTab}
            demoProjectProgress={demoProjectProgress}
            discoveredPapers={discoveredPapers}
            savedPapers={savedPapers}
            starterPapers={starterPapers}
            onOpenPaper={openPaper}
            onSavePaper={savePaperToLibrary}
            onSearchResearchPapers={searchResearchPapers}
            onToggleDemoProjectMilestone={toggleDemoProjectMilestone}
            onUpdateDemoProjectProgress={updateDemoProjectProgress}
          />
        )}
        {activePaper && (
          <PaperReader
            paper={activePaper}
            progress={paperProgress[activePaper.id]}
            onBackToLibrary={openTechnicalPaperCatalog}
            onFindMoreLikeThis={findMoreLikeThis}
            onSaveProgress={savePaperProgress}
          />
        )}
        {file && unsupportedProtectedTypes.includes(extension) && <UnsupportedProtectedFormat />}
        {isEpub && (
          <iframe
            title={file.name}
            className="epub-viewer"
            sandbox=""
            srcDoc={epubContent}
          />
        )}
        {isPdf && objectUrl && <iframe title={file.name} src={objectUrl} className="pdf-viewer" />}
        {isText && <TextReader content={textContent} extension={extension} />}
      </section>
    </main>
  );
}

async function loadEpub(file) {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const container = await readZipText(zip, 'META-INF/container.xml');
  const packagePath = parseXml(container)
    .querySelector('rootfile')
    ?.getAttribute('full-path');

  if (!packagePath) {
    throw new Error('EPUB package file was not found.');
  }

  const packageDirectory = packagePath.includes('/')
    ? packagePath.slice(0, packagePath.lastIndexOf('/') + 1)
    : '';
  const packageXml = parseXml(await readZipText(zip, packagePath));
  const manifest = new Map(
    [...packageXml.querySelectorAll('manifest item')].map((item) => [
      item.getAttribute('id'),
      {
        href: normalizeZipPath(packageDirectory + item.getAttribute('href')),
        type: item.getAttribute('media-type'),
      },
    ]),
  );
  const spine = [...packageXml.querySelectorAll('spine itemref')]
    .map((item) => manifest.get(item.getAttribute('idref')))
    .filter((item) => item?.href && item.type?.includes('html'));

  if (spine.length === 0) {
    throw new Error('No readable EPUB chapters were found.');
  }

  return { zip, spine };
}

async function renderEpubChapter(book, index) {
  const chapter = book.spine[index];
  const chapterHtml = await readZipText(book.zip, chapter.href);
  const document = parseXml(chapterHtml, 'text/html');
  const body = document.body?.innerHTML || chapterHtml;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        background: ${getComputedStyle(documentElement()).getPropertyValue('--reader-page')};
        color: ${getComputedStyle(documentElement()).getPropertyValue('--reader-text')};
        font-family: Georgia, serif;
        font-size: 1.15rem;
        line-height: 1.7;
        margin: 0 auto;
        max-width: 46rem;
        padding: 3rem;
      }
      img { max-width: 100%; }
    </style>
  </head>
  <body>${body}</body>
</html>`;
}

function parseXml(content, type = 'application/xml') {
  return new DOMParser().parseFromString(content, type);
}

async function readZipText(zip, path) {
  const file = zip.file(normalizeZipPath(path));

  if (!file) {
    throw new Error(`EPUB entry not found: ${path}`);
  }

  return file.async('text');
}

function normalizeZipPath(path) {
  return path.replaceAll('\\', '/').replace(/\/+/g, '/');
}

function documentElement() {
  return document.documentElement;
}

function EmptyState() {
  return (
    <div className="empty-state">
      <h2>Choose how you want to level up</h2>
      <p>Open the technical reading library, start a progressive demo project, or import a legally accessible PDF, EPUB, HTML, Markdown, or plain text document.</p>
    </div>
  );
}

function UnsupportedProtectedFormat() {
  return (
    <div className="empty-state">
      <h2>Protected format not supported</h2>
      <p>
        Engineering Growth Studio cannot open encrypted files or bypass DRM. Import a legally
        accessible PDF, EPUB, TXT, HTML, or Markdown document instead.
      </p>
    </div>
  );
}

function PaperCatalog({
  initialTab,
  demoProjectProgress,
  discoveredPapers,
  savedPapers,
  starterPapers,
  onOpenPaper,
  onSavePaper,
  onSearchResearchPapers,
  onToggleDemoProjectMilestone,
  onUpdateDemoProjectProgress,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSubject, setActiveSubject] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeOrder, setActiveOrder] = useState('recently-added');
  const [activeProjectDifficulty, setActiveProjectDifficulty] = useState('all');
  const [activeProjectTopic, setActiveProjectTopic] = useState('all');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const savedPaperIds = new Set(savedPapers.map((paper) => paper.id));
  const isLearningPathTab = activeTab === 'learning-path';
  const isDemoProjectsTab = activeTab === 'demo-projects';
  const isPaperListTab = !isLearningPathTab && !isDemoProjectsTab;
  const tabPapers =
    isLearningPathTab || isDemoProjectsTab
      ? []
      : activeTab === 'saved'
      ? savedPapers
      : activeTab === 'discovered'
        ? discoveredPapers
        : starterPapers;
  const visiblePapers = !isPaperListTab
    ? []
    : orderPapers(filterPapersBySubject(tabPapers, activeSubject), activeOrder);
  const visibleDemoProjects = filterDemoProjects(
    demoProjects,
    activeProjectDifficulty,
    activeProjectTopic,
    projectSearchQuery,
  );
  const emptyMessage =
    activeTab === 'saved'
      ? 'Open or save a paper to add it here. This list stays in this browser.'
      : activeSubject === 'all'
        ? 'Open the library to discover papers. Every surfaced paper stays in this browser.'
        : 'No papers found for this subject in the selected list yet.';

  return (
    <article className="paper-catalog">
      <header className="catalog-header">
        <p className="eyebrow">{isDemoProjectsTab ? 'Demo project studio' : 'Curated research library'}</p>
        <h2>
          {isDemoProjectsTab
            ? 'Build portfolio projects by level'
            : isLearningPathTab
              ? 'Principal engineer reading path'
              : 'Research library'}
        </h2>
        <p>
          {isDemoProjectsTab
            ? 'Choose a subject area and move through its five projects in order. Every demo now includes a React UI practice slice with starter component code, and the full-stack track combines React, APIs, data, security, cloud, and observability into complete product sessions.'
            : isLearningPathTab
              ? 'This track is designed to move you from feature-level discussion to architecture, platform, and risk-oriented engineering conversations. If you read 1 to 3 papers a day and write a short takeaway after each one, your references and tradeoffs will get sharper fast.'
              : 'These random picks span computer science, finance, cybersecurity, AI, data systems, and related technical topics. Click Read in app to open the source page or PDF in this reader; it will also be saved to your local library.'}
        </p>
      </header>

      {!isDemoProjectsTab && (
        <form className="research-search" onSubmit={handleResearchSearch}>
          <label htmlFor="research-search-keyword">
            Search for research papers
            <span>Enter a keyword or topic. Open-access results are added to All found.</span>
          </label>
          <div className="research-search-controls">
            <input
              id="research-search-keyword"
              type="search"
              value={searchKeyword}
              placeholder="e.g. vector databases, zero trust, transformers"
              onChange={(event) => setSearchKeyword(event.target.value)}
            />
            <button type="submit" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search papers'}
            </button>
          </div>
          {searchStatus && <p className="research-search-status">{searchStatus}</p>}
        </form>
      )}

      <div className="catalog-tabs" role="tablist" aria-label="Paper library sections">
        <button
          type="button"
          className={activeTab === 'starter' ? 'active-tab' : 'secondary-action'}
          onClick={() => setActiveTab('starter')}
        >
          Current picks
        </button>
        <button
          type="button"
          className={activeTab === 'saved' ? 'active-tab' : 'secondary-action'}
          onClick={() => setActiveTab('saved')}
        >
          My library ({savedPapers.length})
        </button>
        <button
          type="button"
          className={activeTab === 'discovered' ? 'active-tab' : 'secondary-action'}
          onClick={() => setActiveTab('discovered')}
        >
          All found ({discoveredPapers.length})
        </button>
        <button
          type="button"
          className={activeTab === 'learning-path' ? 'active-tab' : 'secondary-action'}
          onClick={() => setActiveTab('learning-path')}
        >
          Learning path ({totalLearningPathPapers()})
        </button>
        <button
          type="button"
          className={activeTab === 'demo-projects' ? 'active-tab' : 'secondary-action'}
          onClick={() => setActiveTab('demo-projects')}
        >
          Demo projects ({demoProjects.length})
        </button>
      </div>

      {isPaperListTab && (
        <section className="catalog-tools" aria-label="Library filters and ordering">
          <div className="subject-tabs" role="tablist" aria-label="Subject filters">
            {subjectTabs.map((subject) => (
              <button
                key={subject.id}
                type="button"
                className={activeSubject === subject.id ? 'active-tab' : 'secondary-action'}
                onClick={() => setActiveSubject(subject.id)}
              >
                {subject.label} ({filterPapersBySubject(tabPapers, subject.id).length})
              </button>
            ))}
          </div>
          <label className="order-picker">
            Order by
            <select value={activeOrder} onChange={(event) => setActiveOrder(event.target.value)}>
              <option value="recently-added">Recently added</option>
              <option value="newest">Newest publication year</option>
              <option value="oldest">Oldest publication year</option>
              <option value="title">Title A-Z</option>
              <option value="source">Source A-Z</option>
            </select>
          </label>
        </section>
      )}

      {isDemoProjectsTab && (
        <section className="catalog-tools" aria-label="Demo project filters">
          <label className="research-search project-search" htmlFor="demo-project-search">
            Search demo projects
            <span>Search by project name, topic, resource, build goal, or senior/principal stretch.</span>
            <input
              id="demo-project-search"
              type="search"
              value={projectSearchQuery}
              placeholder="e.g. auth, data quality, SLO, RAG, architecture"
              onChange={(event) => setProjectSearchQuery(event.target.value)}
            />
          </label>
          <label className="order-picker">
            Difficulty
            <select
              value={activeProjectDifficulty}
              onChange={(event) => setActiveProjectDifficulty(event.target.value)}
            >
              {demoProjectDifficulties.map((difficulty) => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.label}
                </option>
              ))}
            </select>
          </label>
          <div className="subject-tabs" role="tablist" aria-label="Demo project topic filters">
            {demoProjectTopics.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className={activeProjectTopic === topic.id ? 'active-tab' : 'secondary-action'}
                onClick={() => setActiveProjectTopic(topic.id)}
              >
                {topic.label} ({filterDemoProjects(demoProjects, activeProjectDifficulty, topic.id, projectSearchQuery).length})
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="saved-library" aria-label="Paper list">
        {isDemoProjectsTab ? (
          <DemoProjectsView
            progressByProjectId={demoProjectProgress}
            projects={visibleDemoProjects}
            onToggleMilestone={onToggleDemoProjectMilestone}
            onUpdateProgress={onUpdateDemoProjectProgress}
          />
        ) : isLearningPathTab ? (
          <LearningPathView
            learningPathStages={learningPathStages}
            savedPaperIds={savedPaperIds}
            onOpenPaper={onOpenPaper}
            onSavePaper={onSavePaper}
          />
        ) : visiblePapers.length === 0 ? (
          <p className="muted">{emptyMessage}</p>
        ) : (
          <section className="paper-grid">
            {visiblePapers.map((paper) => (
              <PaperCard
                key={paper.id}
                isSaved={savedPaperIds.has(paper.id)}
                paper={paper}
                onOpenPaper={onOpenPaper}
                onSavePaper={onSavePaper}
              />
            ))}
          </section>
        )}
      </section>
    </article>
  );

  async function handleResearchSearch(event) {
    event.preventDefault();

    const keyword = searchKeyword.trim();
    if (!keyword) {
      setSearchStatus('Enter a keyword to search for research papers.');
      return;
    }

    setIsSearching(true);
    setSearchStatus(`Searching open-access papers for "${keyword}"...`);

    try {
      const { addedCount, resultCount } = await onSearchResearchPapers(keyword);
      setActiveTab('discovered');
      setActiveSubject('all');
      setSearchStatus(
        resultCount === 0
          ? `No open-access papers found for "${keyword}".`
          : `Found ${resultCount} paper${resultCount === 1 ? '' : 's'} and added ${addedCount} new result${addedCount === 1 ? '' : 's'} to All found.`,
      );
    } catch (error) {
      console.error(error);
      setSearchStatus(error.message);
    } finally {
      setIsSearching(false);
    }
  }
}

function DemoProjectsView({ progressByProjectId, projects, onToggleMilestone, onUpdateProgress }) {
  if (projects.length === 0) {
    return (
      <p className="muted">
        No demo projects match this search, difficulty, and topic yet. Try a broader search, All topics, or another level.
      </p>
    );
  }

  return (
    <section className="demo-project-grid" aria-label="Demo project list">
      {projects.map((project) => {
        const progress = progressByProjectId[project.id] ?? {
          status: 'not-started',
          completedMilestones: [],
          notes: '',
        };
        const completionPercent = demoProjectCompletionPercent(progress);

        return (
          <article key={project.id} className="demo-project-card">
            <header>
              <p className="paper-topic">
                {labelForDemoProjectDifficulty(project.difficulty)} · {labelForDemoProjectTopic(project.topic)}
              </p>
              <h3>{project.title}</h3>
              <p className="paper-meta">
                {project.timeframe} · {completionPercent}% complete
                {progress.updatedAt ? ` · Updated ${new Date(progress.updatedAt).toLocaleString()}` : ''}
              </p>
            </header>
            <section className="demo-project-context">
              <strong>Scenario context</strong>
              <p>{demoProjectContext(project)}</p>
            </section>
            <section className="demo-project-progress">
              <label>
                Development status
                <select
                  value={progress.status}
                  onChange={(event) => onUpdateProgress(project.id, { status: event.target.value })}
                >
                  {demoProjectStatuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
              <progress value={completionPercent} max="100">
                {completionPercent}%
              </progress>
            </section>
            <section>
              <strong>Build brief</strong>
              <p className="demo-project-prompt">{verboseDemoProjectPrompt(project)}</p>
            </section>
            <section className="demo-project-specifics">
              <strong>Concrete deliverables</strong>
              <ul>
                {demoProjectDeliverables(project).map((deliverable) => (
                  <li key={deliverable}>{deliverable}</li>
                ))}
              </ul>
            </section>
            <section className="demo-project-specifics">
              <strong>Definition of done</strong>
              <ul>
                {demoProjectAcceptanceCriteria(project).map((criterion) => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ul>
            </section>
            <section className="demo-project-ui">
              <strong>React UI practice</strong>
              <p>{reactUiPlanForDemoProject(project)}</p>
              <details>
                <summary>Starter React component</summary>
                <pre>
                  <code>{reactStarterCodeForProject(project)}</code>
                </pre>
              </details>
            </section>
            <section>
              <strong>Milestone tracker</strong>
              <ul className="demo-project-milestones">
                {demoProjectMilestones.map((milestone) => (
                  <li key={milestone.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={progress.completedMilestones.includes(milestone.id)}
                        onChange={() => onToggleMilestone(project.id, milestone.id)}
                      />
                      <span>{milestone.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <strong>Development notes</strong>
              <textarea
                value={progress.notes}
                placeholder="Track what you built, blockers, decisions, next steps, and what you learned."
                onChange={(event) => onUpdateProgress(project.id, { notes: event.target.value })}
              />
            </section>
            <section>
              <strong>Resources</strong>
              <div className="paper-actions">
                {project.resources.map((resource) => (
                  <a
                    key={resource.url}
                    className="button-link secondary-action"
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resource.label}
                  </a>
                ))}
              </div>
            </section>
          </article>
        );
      })}
    </section>
  );
}

function labelForDemoProjectDifficulty(difficultyId) {
  return demoProjectDifficulties.find((difficulty) => difficulty.id === difficultyId)?.label ?? difficultyId;
}

function labelForDemoProjectTopic(topicId) {
  return demoProjectTopics.find((topic) => topic.id === topicId)?.label ?? topicId;
}

function LearningPathView({ learningPathStages, savedPaperIds, onOpenPaper, onSavePaper }) {
  return (
    <section className="learning-path" aria-label="Principal engineer learning path">
      <article className="learning-path-intro">
        <p className="paper-topic">Suggested cadence</p>
        <h3>Two to six weeks at 1 to 3 papers per day</h3>
        <p>
          Move in order. After each paper, write three bullets: the core design tradeoff, the
          failure mode it is trying to avoid, and how the idea changes a roadmap or architecture
          review.
        </p>
      </article>

      <section className="learning-stage-list">
        {learningPathStages.map((stage) => (
          <article key={stage.id} className="learning-stage-card">
            <header className="learning-stage-header">
              <p className="paper-topic">{stage.cadence}</p>
              <h3>{stage.title}</h3>
              <p>{stage.outcome}</p>
            </header>
            <section className="paper-grid">
              {stage.papers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  isSaved={savedPaperIds.has(paper.id)}
                  paper={paper}
                  onOpenPaper={onOpenPaper}
                  onSavePaper={onSavePaper}
                />
              ))}
            </section>
          </article>
        ))}
      </section>
    </section>
  );
}

function PaperCard({ isSaved, paper, onOpenPaper, onSavePaper }) {
  return (
    <article className="paper-card">
      <p className="paper-topic">{paper.topic}</p>
      <h3>{paper.title}</h3>
      <p className="paper-meta">
        {paper.source} · {paper.year}
      </p>
      <p>{paper.summary}</p>
      <div className="paper-actions">
        <button type="button" onClick={() => onOpenPaper(paper)}>
          Read in app
        </button>
        <button
          type="button"
          className="secondary-action"
          disabled={isSaved}
          onClick={() => onSavePaper(paper)}
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
    </article>
  );
}

function PaperReader({ paper, progress, onBackToLibrary, onFindMoreLikeThis, onSaveProgress }) {
  const [frameStatus, setFrameStatus] = useState('loading');
  const [relatedStatus, setRelatedStatus] = useState('');
  const [isFindingRelated, setIsFindingRelated] = useState(false);
  const [pageInput, setPageInput] = useState(progress?.page ?? '');
  const [progressStatus, setProgressStatus] = useState('');

  useEffect(() => {
    setFrameStatus('loading');
    setRelatedStatus('');
    setProgressStatus('');
    setPageInput(progress?.page ?? '');
    const loadTimeout = window.setTimeout(() => {
      setFrameStatus((currentStatus) =>
        currentStatus === 'loading' ? 'slow-or-blocked' : currentStatus,
      );
    }, 4500);

    return () => window.clearTimeout(loadTimeout);
  }, [paper.url, progress?.page]);

  return (
    <article className="paper-reader">
      <header className="paper-reader-toolbar">
        <div>
          <p className="paper-topic">{paper.topic}</p>
          <h2>{paper.title}</h2>
          <p className="paper-meta">
            {paper.source} · {paper.year}
          </p>
        </div>
        <div className="paper-actions">
          <button type="button" className="secondary-action" onClick={onBackToLibrary}>
            Back to library
          </button>
          <button
            type="button"
            className="secondary-action"
            disabled={isFindingRelated}
            onClick={handleFindMoreLikeThis}
          >
            {isFindingRelated ? 'Finding...' : 'More like this'}
          </button>
          <a className="button-link" href={paper.url} target="_blank" rel="noopener noreferrer">
            Open fallback
          </a>
        </div>
      </header>
      <section className="paper-progress-card" aria-label="Reading progress">
        <label htmlFor={`paper-page-${paper.id}`}>
          Current page
          <span>Save the page you are on for this article.</span>
        </label>
        <div className="paper-progress-controls">
          <input
            id={`paper-page-${paper.id}`}
            type="text"
            inputMode="numeric"
            value={pageInput}
            placeholder="e.g. 12"
            onChange={(event) => setPageInput(event.target.value)}
          />
          <button type="button" onClick={handleSaveProgress}>
            Save page
          </button>
        </div>
        {progress?.page && (
          <p className="viewer-note">
            Last saved page: {progress.page}
            {progress.savedAt ? ` (${new Date(progress.savedAt).toLocaleString()})` : ''}
          </p>
        )}
        {progressStatus && <p className="viewer-note">{progressStatus}</p>}
      </section>
      <iframe
        title={paper.title}
        className="paper-source-viewer"
        src={paper.url}
        onLoad={() => setFrameStatus('loaded')}
        onError={() => setFrameStatus('blocked')}
      />
      {frameStatus === 'loading' && <p className="viewer-note">Loading paper in the reader...</p>}
      {relatedStatus && <p className="viewer-note">{relatedStatus}</p>}
      {frameStatus !== 'loading' && frameStatus !== 'loaded' && (
        <p className="viewer-note">
          This source may block embedded reading. Use Open fallback, download the PDF, then choose it
          with the file picker to read it locally in the app.
        </p>
      )}
    </article>
  );

  function handleSaveProgress() {
    try {
      onSaveProgress(paper, pageInput);
      setProgressStatus(`Saved page ${pageInput.trim()} for this article.`);
    } catch (error) {
      console.error(error);
      setProgressStatus(error.message);
    }
  }

  async function handleFindMoreLikeThis() {
    setIsFindingRelated(true);
    setRelatedStatus(`Finding related papers around "${paper.title}"...`);

    try {
      const { addedCount, resultCount } = await onFindMoreLikeThis(paper);
      setRelatedStatus(
        resultCount === 0
          ? 'No related open-access papers found.'
          : `Found ${resultCount} related paper${resultCount === 1 ? '' : 's'} and added ${addedCount} new result${addedCount === 1 ? '' : 's'} to All found.`,
      );
    } catch (error) {
      console.error(error);
      setRelatedStatus(error.message);
    } finally {
      setIsFindingRelated(false);
    }
  }
}

function TextReader({ content, extension }) {
  if (['html', 'htm'].includes(extension)) {
    return (
      <iframe
        title="HTML document reader"
        className="html-viewer"
        sandbox="allow-popups allow-popups-to-escape-sandbox"
        srcDoc={content}
      />
    );
  }

  return <article className="text-reader">{content}</article>;
}

createRoot(document.getElementById('root')).render(
  <StartupErrorBoundary>
    <App />
  </StartupErrorBoundary>,
);
