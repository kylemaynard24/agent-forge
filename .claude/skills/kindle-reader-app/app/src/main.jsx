import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import JSZip from 'jszip';
import './styles.css';

const supportedTypes = ['epub', 'pdf', 'txt', 'md', 'markdown', 'html', 'htm'];
const unsupportedKindleTypes = ['azw', 'azw3', 'kfx', 'mobi'];
const userLibraryStorageKey = 'kindle-reader-app:technical-paper-library';
const discoveredPapersStorageKey = 'kindle-reader-app:discovered-technical-papers';
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

function readStoredPapers(storageKey) {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? '[]');
  } catch (error) {
    console.warn('Could not read stored technical paper library.', error);
    return [];
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
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('Choose a DRM-free EPUB, PDF, TXT, HTML, or Markdown file to start reading.');
  const [textContent, setTextContent] = useState('');
  const [epubContent, setEpubContent] = useState('');
  const [objectUrl, setObjectUrl] = useState('');
  const [book, setBook] = useState(null);
  const [chapterIndex, setChapterIndex] = useState(0);
  const [theme, setTheme] = useState('paper');
  const [showCatalog, setShowCatalog] = useState(false);
  const [activePaper, setActivePaper] = useState(null);
  const [savedPapers, setSavedPapers] = useState(() => readStoredPapers(userLibraryStorageKey));
  const [discoveredPapers, setDiscoveredPapers] = useState(() =>
    readStoredPapers(discoveredPapersStorageKey),
  );
  const [starterPapers, setStarterPapers] = useState(() => randomRecentPapers(5));

  const extension = useMemo(() => (file ? extensionFor(file) : ''), [file]);
  const isText = ['txt', 'md', 'markdown', 'html', 'htm'].includes(extension);
  const isPdf = extension === 'pdf';
  const isEpub = extension === 'epub';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(userLibraryStorageKey, JSON.stringify(savedPapers));
  }, [savedPapers]);

  useEffect(() => {
    window.localStorage.setItem(discoveredPapersStorageKey, JSON.stringify(discoveredPapers));
  }, [discoveredPapers]);

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

    if (unsupportedKindleTypes.includes(nextExtension)) {
      setStatus('This Kindle format is not supported here. Encrypted Kindle books must be read with Amazon Kindle apps, or imported as a legitimate DRM-free EPUB/PDF/TXT export.');
      return;
    }

    if (!supportedTypes.includes(nextExtension)) {
      setStatus('Unsupported file type. Try a DRM-free EPUB, PDF, TXT, HTML, or Markdown file.');
      return;
    }

    if (nextExtension === 'epub') {
      const nextBook = await loadEpub(nextFile);
      setBook(nextBook);
      setEpubContent(await renderEpubChapter(nextBook, 0));
      setStatus(`Reading ${nextFile.name} (${nextBook.spine.length} chapters)`);
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
    setShowCatalog(true);
    setActivePaper(null);
    setStatus('Browsing 5 random research picks per subject. Opening papers adds them to your library.');

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl('');
    }
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
        <p className="eyebrow">Local reader</p>
        <h1>Kindle Reader App</h1>
        <p className="lede">
          Import your legally accessible ebook or document and read it locally in the browser.
        </p>

        <label className="file-picker">
          <span>Choose book file</span>
          <input
            type="file"
            accept=".epub,.pdf,.txt,.md,.markdown,.html,.htm,.azw,.azw3,.kfx,.mobi"
            onChange={onFileChange}
          />
        </label>

        <div className="status-card">
          <strong>Status</strong>
          <p>{status}</p>
        </div>

        <div className="library-card">
          <strong>Curated library</strong>
          <p>Start with 5 random papers per subject, then build a local library as you open or save them.</p>
          <button type="button" className="secondary-action" onClick={openTechnicalPaperCatalog}>
            Open research library
          </button>
        </div>

        <div className="controls">
          <button type="button" onClick={previousPage} disabled={!isEpub}>
            Previous chapter
          </button>
          <button type="button" onClick={nextPage} disabled={!isEpub}>
            Next chapter
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
          DRM-protected Kindle purchases are not supported. Use Amazon Kindle apps for encrypted
          files or import a legitimate DRM-free export.
        </p>
      </aside>

      <section className="reader-panel" aria-label="Reader">
        {!file && !showCatalog && !activePaper && <EmptyState />}
        {showCatalog && (
          <PaperCatalog
            discoveredPapers={discoveredPapers}
            savedPapers={savedPapers}
            starterPapers={starterPapers}
            onOpenPaper={openPaper}
            onSavePaper={savePaperToLibrary}
          />
        )}
        {activePaper && (
          <PaperReader paper={activePaper} onBackToLibrary={openTechnicalPaperCatalog} />
        )}
        {file && unsupportedKindleTypes.includes(extension) && <UnsupportedKindleFormat />}
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
      <h2>Pick a book to begin</h2>
      <p>EPUB gives the best reading experience. PDF and plain text formats are also supported.</p>
    </div>
  );
}

function UnsupportedKindleFormat() {
  return (
    <div className="empty-state">
      <h2>Kindle format not supported</h2>
      <p>
        This app cannot open encrypted Kindle files or bypass DRM. Open those in Amazon Kindle, or
        import a legitimate DRM-free EPUB, PDF, TXT, HTML, or Markdown copy.
      </p>
    </div>
  );
}

function PaperCatalog({ discoveredPapers, savedPapers, starterPapers, onOpenPaper, onSavePaper }) {
  const [activeTab, setActiveTab] = useState('starter');
  const [activeSubject, setActiveSubject] = useState('all');
  const savedPaperIds = new Set(savedPapers.map((paper) => paper.id));
  const tabPapers =
    activeTab === 'saved'
      ? savedPapers
      : activeTab === 'discovered'
        ? discoveredPapers
        : starterPapers;
  const visiblePapers = filterPapersBySubject(tabPapers, activeSubject);
  const emptyMessage =
    activeTab === 'saved'
      ? 'Open or save a paper to add it here. This list stays in this browser.'
      : activeSubject === 'all'
        ? 'Open the library to discover papers. Every surfaced paper stays in this browser.'
        : 'No papers found for this subject in the selected list yet.';

  return (
    <article className="paper-catalog">
      <header className="catalog-header">
        <p className="eyebrow">Curated research library</p>
        <h2>Five papers per subject to start</h2>
        <p>
          These random picks span computer science, finance, cybersecurity, AI, data systems,
          and related technical topics. Click Read in app to open the source page or PDF in this
          reader; it will also be saved to your local library.
        </p>
      </header>

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
      </div>

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

      <section className="saved-library" aria-label="Paper list">
        {visiblePapers.length === 0 ? (
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

function PaperReader({ paper, onBackToLibrary }) {
  const [frameStatus, setFrameStatus] = useState('loading');

  useEffect(() => {
    setFrameStatus('loading');
    const loadTimeout = window.setTimeout(() => {
      setFrameStatus((currentStatus) =>
        currentStatus === 'loading' ? 'slow-or-blocked' : currentStatus,
      );
    }, 4500);

    return () => window.clearTimeout(loadTimeout);
  }, [paper.url]);

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
          <a className="button-link" href={paper.url} target="_blank" rel="noopener noreferrer">
            Open fallback
          </a>
        </div>
      </header>
      <iframe
        title={paper.title}
        className="paper-source-viewer"
        src={paper.url}
        onLoad={() => setFrameStatus('loaded')}
        onError={() => setFrameStatus('blocked')}
      />
      {frameStatus === 'loading' && <p className="viewer-note">Loading paper in the reader...</p>}
      {frameStatus !== 'loading' && frameStatus !== 'loaded' && (
        <p className="viewer-note">
          This source may block embedded reading. Use Open fallback, download the PDF, then choose it
          with the file picker to read it locally in the app.
        </p>
      )}
    </article>
  );
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

createRoot(document.getElementById('root')).render(<App />);
