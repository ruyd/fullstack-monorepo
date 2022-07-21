# Notes

## TypeScript Configuration

client

- Uses Create React App's internal compile scripts untouched, module lookup directories modified with craco
  packages

- Composite true
- package.json exports

server

- Composite project with references to packages, tsc bundled output
- Packages Hot Reload note: paths' need non-wildcarded dir names

NPM

```json
"workspaces": [
"packages/*",
"client",
"server"
],
```

## Structure
