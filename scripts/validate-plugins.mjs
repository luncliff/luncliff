import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const manifest = readJson('plugins/luncliff-workspace/plugin.json');
const copilot = readJson('.github/plugin/marketplace.json');
const codex = readJson('.agents/plugins/marketplace.json');

assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
assert.equal(copilot.plugins.length, 1);
assert.equal(codex.plugins.length, 1);
assert.equal(copilot.plugins[0].name, manifest.name);
assert.equal(codex.plugins[0].name, manifest.name);
assert.equal(copilot.plugins[0].version, manifest.version);
assert.equal(copilot.plugins[0].source, codex.plugins[0].source.path);
assert.equal(copilot.name, codex.name);

const pluginRoot = resolve(copilot.plugins[0].source);
assert.deepEqual(readJson(resolve(pluginRoot, 'plugin.json')), manifest);
assert.ok(existsSync(resolve(pluginRoot, 'skills/workspace-maintenance/SKILL.md')));
console.log('CLI plugin catalogs valid');