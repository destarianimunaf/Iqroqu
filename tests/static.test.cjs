const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { root, scriptPaths } = require('./helpers/load-app.cjs');

test('the static entry loads existing local scripts, styles, and illustrations', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const file of scriptPaths()) assert.ok(fs.statSync(path.join(root, file)).isFile(), file);
  for (const match of html.matchAll(/<link[^>]*href="([^"]+)"/g)) {
    const file = path.join(root, match[1]);
    const css = fs.readFileSync(file, 'utf8');
    for (const url of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      if (/^(https?:|data:)/.test(url[1])) continue;
      assert.ok(fs.statSync(path.resolve(path.dirname(file), url[1])).isFile(), url[1]);
    }
  }
  const images = fs.readFileSync(path.join(root, 'src/data/images.js'), 'utf8');
  for (const match of images.matchAll(/"(assets\/[^"]+)"/g)) {
    assert.ok(fs.statSync(path.join(root, match[1])).size > 1000, match[1]);
  }
});
