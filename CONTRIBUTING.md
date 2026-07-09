# Contributing to READABILITY-AI

Thank you for your interest in contributing to READABILITY-AI! We welcome contributions from everyone. This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

Please be respectful and constructive in all interactions. We're committed to providing a welcoming and inclusive environment for all contributors.

## 🐛 Reporting Issues

Found a bug? Here's how to report it:

1. **Check existing issues** - Make sure the issue hasn't been reported already
2. **Provide detailed information:**
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots or error logs
   - Browser/OS/Node version information

3. **Open an issue** - [Create a new issue](https://github.com/Royalbulls/READABILITY-AI/issues)

## 💡 Suggesting Enhancements

Have an idea to improve READABILITY-AI?

1. Check the [existing discussions](https://github.com/Royalbulls/READABILITY-AI/discussions)
2. Describe your enhancement clearly
3. Explain why it would be useful
4. Open a [discussion or issue](https://github.com/Royalbulls/READABILITY-AI/issues)

## 🚀 Development Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Git

### Steps

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/READABILITY-AI.git
   cd READABILITY-AI
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic

7. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

8. **Commit your changes**
   ```bash
   git commit -m "type: description of changes"
   # Example: git commit -m "feat: add new AI simplification mode"
   ```

## 📝 Commit Message Format

Please follow this format:

```
type: subject

body (optional)

footer (optional)
```

### Types:
- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, semicolons, etc.)
- **refactor:** Code refactoring without feature changes
- **perf:** Performance improvements
- **test:** Adding tests
- **chore:** Build process, dependencies, etc.

### Examples:
```
feat: add multi-language support for simplification
fix: resolve audio playback issue on mobile devices
docs: update installation guide
```

## 🔄 Pull Request Process

1. **Update your branch**
   ```bash
   git pull origin main
   ```

2. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Title: Clear and descriptive
   - Description: Explain what you've done and why
   - Link any related issues

4. **PR Checklist:**
   - [ ] Code follows the project's style guide
   - [ ] Tests pass locally (`npm run lint` & `npm run build`)
   - [ ] Documentation is updated
   - [ ] No breaking changes (or documented if necessary)

5. **Review Process**
   - Maintainers will review your PR
   - Address feedback and make requested changes
   - Once approved, your PR will be merged

## 📚 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful variable and function names
- Add comments for complex logic

### Performance
- Optimize for speed and efficiency
- Avoid unnecessary re-renders in React
- Use lazy loading for components
- Minimize bundle size

### Accessibility
- Ensure keyboard navigation works
- Add proper ARIA labels
- Test with screen readers
- Follow WCAG guidelines

### Testing
- Test your changes locally
- Verify on different browsers
- Test on mobile devices
- Check performance impact

## 🎓 Project Structure

```
READABILITY-AI/
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── styles/           # CSS files
│   ├── App.tsx           # Main App component
│   └── main.tsx          # React entry point
├── server.ts             # Express server
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## ❓ Questions?

- 📧 Email: royalbullsadvisory412@gmail.com
- 💬 Discussions: [GitHub Discussions](https://github.com/Royalbulls/READABILITY-AI/discussions)
- 🐙 GitHub Issues: [Open an issue](https://github.com/Royalbulls/READABILITY-AI/issues)

## 🎉 Thank You!

Thank you for contributing to READABILITY-AI! Your efforts help make this project better for everyone.

---

**Happy coding!** 🚀
