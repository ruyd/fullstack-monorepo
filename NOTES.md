# Notes

## TypeScript Configuration

client

- Composite: false
- No references due to github actions: TS6305: Output file has not been built from source
- Uses Create React App's internal webpack untouched, module lookup directories modified with craco
- Packages linked via paths and workplace

packages

- Composite: true
- package.json exports

server

- Composite: true with references to packages, tsc bundled output
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
