// MCP Servers — registration config + minimal server sketch.
// Run: node demo.js

// === The config you'd add to ~/.claude/mcp.json or .claude/mcp.json ===

const mcpConfig = {
  mcpServers: {
    // Local stdio server: harness spawns it; communicates via stdin/stdout.
    'sqlite-local': {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sqlite', '--db', './local.db']
    },

    // HTTP server: harness connects over network.
    'github': {
      url: 'https://mcp.example.com/github',
      headers: { 'Authorization': 'Bearer ${env:GITHUB_MCP_TOKEN}' }
    }
  }
};

console.log('=== MCP server registration (mcp.json) ===\n');
console.log(JSON.stringify(mcpConfig, null, 2));

console.log('\n=== After registration, Claude sees ===');
console.log('  mcp__sqlite-local__query        — run SQL against local.db');
console.log('  mcp__sqlite-local__list_tables  — list tables');
console.log('  mcp__github__list_issues        — list GitHub issues');
console.log('  mcp__github__create_pr_comment  — post a PR comment');
console.log('  ...etc, depending on what each server exposes');

console.log('\n=== Permission control (.claude/settings.json) ===');
console.log(JSON.stringify({
  permissions: {
    allow: [
      'mcp__sqlite-local__query',     // read-only SQL: allowed
      'mcp__github__list_issues'      // read-only GH: allowed
    ],
    deny: [
      'mcp__sqlite-local__delete',    // dangerous: denied
      'mcp__github__delete_repo'      // very dangerous: denied
    ]
  }
}, null, 2));

console.log('\n=== Sketch: a minimal MCP server in pseudo-code ===\n');
console.log(`
// (Real implementation: use @modelcontextprotocol/sdk)

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({ name: 'todo-server', version: '0.1.0' });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'add_todo',
      description: 'Append a todo item.',
      inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] }
    },
    {
      name: 'list_todos',
      description: 'Return all todos.',
      inputSchema: { type: 'object', properties: {} }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  if (name === 'add_todo') { todos.push(args.text); return { content: [{ type: 'text', text: 'ok' }] }; }
  if (name === 'list_todos') return { content: [{ type: 'text', text: todos.join('\\n') }] };
  throw new Error('unknown tool');
});

await server.connect(new StdioServerTransport());
`);

console.log('Take note:');
console.log('  - Each tool has a name, description, JSON Schema.');
console.log('  - Tool descriptions are read by the LLM — write them like prompts.');
console.log('  - Errors thrown become observations to the LLM.');
console.log('  - The server is a process — sandbox it, log it, secure it.');
