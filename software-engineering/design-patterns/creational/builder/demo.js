// Builder — HTTP request builder
// Run: node demo.js

// --- Product (immutable once built) ---

class HttpRequest {
  constructor({ method, url, headers, query, body }) {
    this.method = method;
    this.url = url;
    this.headers = Object.freeze({ ...headers });
    this.query = Object.freeze({ ...query });
    this.body = body;
    Object.freeze(this);
  }

  toString() {
    const qs = Object.entries(this.query).map(([k, v]) => `${k}=${v}`).join('&');
    const fullUrl = qs ? `${this.url}?${qs}` : this.url;
    const headerLines = Object.entries(this.headers).map(([k, v]) => `  ${k}: ${v}`).join('\n');
    return [
      `${this.method} ${fullUrl}`,
      headerLines,
      this.body ? '\n' + JSON.stringify(this.body, null, 2) : ''
    ].filter(Boolean).join('\n');
  }
}

// --- Builder ---

class HttpRequestBuilder {
  constructor() {
    this._method = 'GET';
    this._url = null;
    this._headers = {};
    this._query = {};
    this._body = null;
  }

  method(m) { this._method = m.toUpperCase(); return this; }
  url(u)    { this._url = u; return this; }
  header(k, v) { this._headers[k] = v; return this; }
  query(k, v)  { this._query[k] = v; return this; }

  json(body) {
    this._body = body;
    this._headers['Content-Type'] = 'application/json';
    return this;
  }

  build() {
    if (!this._url) throw new Error('url() is required before build()');
    if (this._body && this._method === 'GET') {
      throw new Error('GET requests cannot have a body');
    }
    return new HttpRequest({
      method: this._method,
      url: this._url,
      headers: this._headers,
      query: this._query,
      body: this._body,
    });
  }
}

// --- Demo ---

console.log('=== Builder demo ===\n');

const search = new HttpRequestBuilder()
  .method('GET')
  .url('https://api.example.com/search')
  .query('q', 'design-patterns')
  .query('limit', 10)
  .header('Authorization', 'Bearer TOKEN')
  .build();

console.log('-- search request --');
console.log(search.toString());

const create = new HttpRequestBuilder()
  .method('POST')
  .url('https://api.example.com/items')
  .header('Authorization', 'Bearer TOKEN')
  .json({ name: 'widget', qty: 3 })
  .build();

console.log('\n-- create request --');
console.log(create.toString());

// Validation runs at build() time:
try {
  new HttpRequestBuilder()
    .method('GET')
    .url('https://api.example.com/bad')
    .json({ oops: true })
    .build();
} catch (err) {
  console.log('\nRejected at build():', err.message);
}
