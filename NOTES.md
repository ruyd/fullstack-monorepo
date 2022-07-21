# Notes

## TypeScript Configuration

client

- Uses Create React App's internal compile scripts untouched saved for module scoping with craco
- No tsconfig.references otherwise github actions' not-compiled-from-source error pops up
- Packages linked through paths and node module resolution

packages

- Composite true
- package.json exports

server

- Composite project with references to packages, tsc bundled output
- Packages Hot Reload note: paths' need non-wildcarded dir names

## Structure
