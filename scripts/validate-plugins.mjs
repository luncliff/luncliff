import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const copilot = readJson('.github/plugin/marketplace.json');
const codex = readJson('.agents/plugins/marketplace.json');
const pluginRoot = resolve(copilot.plugins[0].source);
const manifest = readJson(resolve(pluginRoot, 'plugin.json'));

assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
assert.equal(copilot.plugins.length, 1);
assert.equal(codex.plugins.length, 1);
assert.equal(copilot.plugins[0].name, manifest.name);
assert.equal(codex.plugins[0].name, manifest.name);
assert.equal(copilot.plugins[0].version, manifest.version);
assert.equal(copilot.plugins[0].source, codex.plugins[0].source.path);
assert.equal(copilot.name, codex.name);
assert.equal(copilot.plugins[0].source, './.github', 'Plugin root must remain VS Code-discoverable');

assert.deepEqual(readJson(resolve(pluginRoot, 'plugin.json')), manifest);
const packagedSkills = resolve(pluginRoot, 'skills');
const skillDirectories = readdirSync(packagedSkills, { withFileTypes: true })
	.filter((entry) => entry.isDirectory());
assert.ok(skillDirectories.length > 0, 'Plugin must package at least one skill');
for (const directory of skillDirectories) {
	const skill = readFileSync(resolve(packagedSkills, directory.name, 'SKILL.md'), 'utf8');
	assert.match(skill, /^---\r?\n/, `${directory.name} must start with YAML frontmatter`);
	assert.match(skill, new RegExp(`^name: ${directory.name}$`, 'm'));
	assert.match(skill, /^description: .+$/m, `${directory.name} must have a description`);
	assert.doesNotMatch(skill, /^disable-model-invocation:\s*true$/m,
		`${directory.name} must be discoverable by VS Code agents`);
}
const pluginAgent = readFileSync(resolve(pluginRoot, 'com.github.copilot/agents/review.agent.md'));
const workspaceAgent = readFileSync(resolve(pluginRoot, 'agents/review.agent.md'));
assert.deepEqual(workspaceAgent, pluginAgent, 'Workspace and plugin review agents must match');
console.log('CLI plugin catalogs valid');