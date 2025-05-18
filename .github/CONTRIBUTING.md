# Contributing to lyrics-lib

Thank you for your interest in contributing to lyrics-lib! This document provides guidelines and instructions for contributing to the project.

## 📝 Issues

- The issue tracker is for **bug reports only**.
- For questions or feature suggestions, please check the FAQ and existing issues (both open and closed) before opening a new one.

## 🛠️ Pull Requests

We welcome contributions via pull requests! Please follow these guidelines:

1. **Fork the repository** and create a new branch from `main` for your changes:
   ```sh
   git checkout -b feature/your-feature-name
   ```
2. **Install dependencies:**
   ```sh
   npm ci
   ```
3. **Make your changes**, ensuring they align with the project's goals and coding style.

4. **Run checks** before submitting:
   ```sh
   npm run prettier    # Format code
   npm run lint        # Check for linting errors
   npm run build       # Ensure the project compiles
   npm run test        # Run tests
   ```

5. **Commit your changes** using the Conventional Commits format:
   ```sh
   git commit -m "feat: add new feature"
   ```

6. **Create a pull request:** Push your branch to your fork and open a pull request against the `main` branch of the lyrics-lib repository.

### Pull Request Guidelines

- Keep pull requests focused on a single issue or feature.
- Include relevant tests for your changes.
- Update documentation (if applicable).
- Follow the project's existing code style.
- Ensure all tests pass before submitting.
- Link any related issues in the pull request description.

## ⚙️ Development Setup

lyrics-lib is built with TypeScript and uses the following tools:

- **npm**: Package manager
- **Prettier**: Code formatter
- **ESLint**: Linter
- **Vitest**: Test runner
- **TypeDoc**: Documentation generator

## ⚖️ License

By contributing to lyrics-lib, you agree that your contributions will be licensed under the MIT License.

Thank you for helping make lyrics-lib better! 💖 