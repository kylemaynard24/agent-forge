// Settings & Permissions — three example configurations.
// Run: node demo.js

const defensive = {
  permissions: {
    allow: ['Read', 'Grep', 'Glob'],
    ask: ['Edit', 'Write', 'Bash'],
    deny: ['Bash(rm:*)', 'Bash(sudo:*)', 'Bash(:* > /dev/sd*)']
  }
};

const balanced = {
  permissions: {
    allow: [
      'Read', 'Grep', 'Glob',
      'Bash(git status)', 'Bash(git log:*)', 'Bash(git diff:*)',
      'Bash(ls:*)', 'Bash(cat:*)', 'Bash(echo:*)',
      'Bash(node:*)', 'Bash(npm test:*)'
    ],
    ask: ['Edit', 'Write', 'Bash'],
    deny: [
      'Bash(rm:*)', 'Bash(sudo:*)', 'Bash(:* > /dev/sd*)',
      'Bash(npm publish:*)', 'Bash(git push:* --force:*)'
    ]
  }
};

const permissive = {
  permissions: {
    allow: ['Read', 'Grep', 'Glob', 'Edit', 'Write', 'Bash'],
    deny: ['Bash(rm -rf /:*)']
  }
};

console.log('=== DEFENSIVE — read-only auto, all writes prompt ===\n');
console.log(JSON.stringify(defensive, null, 2));
console.log('\nGood for: new projects, untrusted contexts, learning.');
console.log('Pain: you confirm a lot.\n');

console.log('=== BALANCED — read-only auto, safe Bash auto, writes prompt ===\n');
console.log(JSON.stringify(balanced, null, 2));
console.log('\nGood for: daily work where you want flow without surprises.');
console.log('Tune by adding to allow list as you build trust.\n');

console.log('=== PERMISSIVE — almost everything auto, only the most reckless denied ===\n');
console.log(JSON.stringify(permissive, null, 2));
console.log('\nDangerous. Only use when:');
console.log('  - Working in a sandbox you can throw away.');
console.log('  - Doing exploratory work where permission prompts cost more than mistakes.');
console.log('  - You\'ve removed access to anything irreversible.');

console.log('\n=== Recommended starting point ===');
console.log('Start with DEFENSIVE. Move rules from "ask" to "allow" as patterns emerge.');
console.log('After a few weeks, your settings will look like BALANCED, customized to YOUR work.');
console.log('Never go to PERMISSIVE outside throw-away environments.');
