const fs = require("fs");
const os = require("os");
const path = require("path");

const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
const archiveDir = path.join(codexHome, "user-codex-retrospective");
const indexPath = path.join(archiveDir, "INDEX.md");
const maxIndexChars = 12000;
const maxLinkedChars = 3000;

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (_) {
    return "";
  }
}

function promptTerms(prompt) {
  return [...new Set(
    String(prompt || "")
      .toLowerCase()
      .split(/[^\p{L}\p{N}_-]+/u)
      .filter((term) => term.length >= 2),
  )];
}

function scoreDocument(content, terms) {
  const normalized = content.toLowerCase();
  return terms.reduce((score, term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = normalized.match(new RegExp(escaped, "g"));
    return score + (matches ? matches.length : 0);
  }, 0);
}

function relevantDocuments(prompt) {
  const terms = promptTerms(prompt);
  let documents = [];
  try {
    documents = fs
      .readdirSync(archiveDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "INDEX.md")
      .map((entry) => {
        const filePath = path.join(archiveDir, entry.name);
        const content = readText(filePath);
        return { name: entry.name, content, score: scoreDocument(content, terms) };
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, 2);
  } catch (_) {
    documents = [];
  }
  return documents.filter((document) => document.content);
}

function buildContext(prompt) {
  const index = readText(indexPath);
  const linked = relevantDocuments(prompt)
    .map((document) => `\n--- ${document.name} ---\n${document.content.slice(0, maxLinkedChars)}`)
    .join("\n");

  if (!index && !linked) {
    return "Retrospective archive unavailable. Continue using the active user and repository instructions.";
  }

  return [
    "Before acting on this user instruction, consult the retrospective archive below. Apply relevant guidance, prefer newer entries when guidance conflicts, and read linked retrospective documents when the index points to them.",
    "\n--- user-codex-retrospective/INDEX.md ---\n",
    index.slice(0, maxIndexChars),
    linked,
  ].join("\n");
}

let input = "";
try {
  input = fs.readFileSync(0, "utf8");
} catch (_) {
  input = "";
}

let event = {};
try {
  event = JSON.parse(input || "{}");
} catch (_) {
  event = {};
}

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "UserPromptSubmit",
    additionalContext: buildContext(event.prompt),
  },
}));
