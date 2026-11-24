const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');

// Use the browser's actual entry order so a missing file or dependency fails tests.
function scriptPaths() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  return [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(match => match[1]);
}

function loadApp(context, { bundledAudio = true } = {}) {
  for (const file of scriptPaths()) {
    if (!bundledAudio && file === 'assets/audio/manifest.js') continue;
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  }
}

module.exports = { root, scriptPaths, loadApp };
