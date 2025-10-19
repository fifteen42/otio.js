# Contributing to otio.js

Thank you for your interest in contributing to otio.js!

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/otio.js.git
cd otio.js
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run tests:
```bash
npm test
```

## Development Workflow

### Building

```bash
npm run build    # Build for production
npm run dev      # Build and watch for changes
```

### Testing

```bash
npm test         # Run tests
npm run test:ui  # Run tests with UI
npm run test:coverage  # Run tests with coverage
```

### Code Quality

```bash
npm run lint     # Lint code
npm run format   # Format code
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure all tests pass (`npm test`)
5. Ensure code is properly formatted (`npm run format`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features
- Keep functions small and focused

## Commit Messages

- Use clear and descriptive commit messages
- Start with a verb in present tense (Add, Fix, Update, etc.)
- Reference issues when applicable

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

