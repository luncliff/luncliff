# luncliff's GitHub Workspace

## How To

### Setup

Install .agents/skills using [Microsoft Agent Package Manager (APM)](https://microsoft.github.io/apm/):

```powershell
# see apm.yml for the details
apm install
```

The manifest also installs the latest default-branch contents from
`github/awesome-copilot`. Use `apm install --update` to refresh the resolved
revision after the lockfile has been created.

### Lint

Install the dependencies in [package.json](./package.json)

```powershell
npm install
```

Then run the lint command.

```powershell
npm run lint
```
