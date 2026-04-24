// Adapter — wrapping a legacy XML "shouter" as a modern logger
// Run: node demo.js

// --- Adaptee: legacy library we cannot modify ---

class XmlShouter {
  shout(xml) {
    console.log('XML ▶', xml);
  }
}

// --- Target: the interface the client expects ---

class Logger {
  log(_entry) { throw new Error('log({level, message}) must be implemented'); }
}

// --- Adapter: makes XmlShouter conform to Logger ---

class XmlShouterAdapter extends Logger {
  constructor(shouter) {
    super();
    this.shouter = shouter;
  }

  log({ level, message }) {
    const escaped = String(message).replace(/[&<>]/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]
    ));
    const xml = `<entry level="${level}">${escaped}</entry>`;
    this.shouter.shout(xml);
  }
}

// --- A regular implementation for contrast ---

class ConsoleLogger extends Logger {
  log({ level, message }) {
    console.log(`[${level}] ${message}`);
  }
}

// --- Client ---
// The client only knows about Logger. It doesn't care whether it's backed by
// ConsoleLogger or a wrapped legacy XmlShouter.

function runAudit(logger) {
  logger.log({ level: 'INFO',  message: 'audit started' });
  logger.log({ level: 'WARN',  message: 'disk >90% full' });
  logger.log({ level: 'ERROR', message: 'service X unreachable <emergency>' });
}

// --- Demo ---

console.log('=== Adapter demo ===\n');

console.log('-- using ConsoleLogger --');
runAudit(new ConsoleLogger());

console.log('\n-- using legacy XmlShouter via adapter --');
runAudit(new XmlShouterAdapter(new XmlShouter()));

console.log('\nKey idea: runAudit() never changed — only the Logger it received did.');
