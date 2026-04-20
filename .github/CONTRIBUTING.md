# Contributing to lyrics-lib

Thanks for your interest in contributing! This document covers the basics of
filing issues and submitting pull requests.

## Issues

- The issue tracker is for **bug reports** and **feature proposals**.
- Before filing a new one, please search existing issues (open and closed).

## Pull requests

1. **Fork** the repository and create a branch from `main`:
   ```sh
   git checkout -b feature/your-feature-name
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
   (No `package-lock.json` is committed; `.gitignore` excludes it.)
3. **Make your changes**, matching the project's coding style and keeping
   modules thin and composable.
4. **Run the checks** before submitting:
   ```sh
   npm run typecheck   # tsc --noEmit
   npm run build       # produces dist/
   npm test            # vitest
   ```
5. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add support for ...
   fix: correct behavior of ...
   docs: update README for ...
   refactor: simplify ...
   chore: bump dependency ...
   ```
6. **Open a pull request** against `main` with a focused summary and a link
   to any related issue.

### PR guidelines

- Keep each PR focused on a single concern.
- Update or add tests for behavior changes.
- Update docs (`README.md`, `.github/CHANGELOG.md`) when user-facing
  behavior changes.
- Ensure `npm run typecheck`, `npm run build`, and `npm test` all pass.

## Development setup

- **Runtime**: Node.js **>= 18** (the code uses the global `fetch`).
- **Language**: TypeScript (strict mode).
- **Build**: `tsc` (see `tsconfig.json`).
- **Tests**: Vitest (`tests/**/*.test.ts`).
- **Docs**: TypeDoc (`npm run docs`).

Formatters and linters are not currently wired up; please keep diffs tidy
(consistent indentation, no stray trailing whitespace, etc.).

## License

By contributing, you agree your contributions are licensed under MIT, the
same license as the rest of the project.
