# AI Code Generator

An intelligent code generation tool based on AI and MCP (Model Context Protocol) that automatically generates code and corresponding unit tests from natural language descriptions.

## ✨ Features

- 🤖 **AI-Powered**: Uses OpenAI GPT-4o model to generate high-quality code
- 🔧 **Automatic Test Generation**: Automatically creates unit tests for generated code
- 🎨 **Modern UI**: 
  - Dark/Light mode toggle support
  - Beautiful loading animations
  - Responsive design with mobile support
- 💻 **Syntax Highlighting**: 
  - Syntax-highlighted code display
  - Line numbers
  - Automatic programming language detection
- 📊 **Usage Statistics**: Real-time display of API call counts and token consumption
- 🏗️ **Architecture**: Modular design based on MCP protocol

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling framework
- **react-syntax-highlighter** - Code highlighting

### Backend & Agents
- **Node.js** - Runtime environment
- **Model Context Protocol (MCP)** - Agent communication protocol
- **OpenAI API** - LLM service
- **TypeScript** - Type safety

### Project Structure
```
AI-Coder/
├── apps/
│   └── web/                 # Next.js frontend application
│       ├── app/             # App Router
│       │   ├── api/         # API routes
│       │   ├── page.tsx     # Main page
│       │   └── layout.tsx   # Layout component
│       └── lib/             # Utility functions
│           └── manager.ts   # MCP Manager
├── packages/
│   ├── coder-agent/         # Code generation agent
│   ├── qa-agent/            # Test generation agent
│   └── shared/              # Shared type definitions
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API Key

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/chengyitang/AI-Coder.git
cd AI-Coder
```

2. **Install dependencies**
```bash
npm install
```

3. **Build agent packages**
```bash
cd packages/coder-agent && npm run build
cd ../qa-agent && npm run build
cd ../..
```

4. **Configure environment variables**

Create a `.env` file in the project root (or in each agent directory):

```env
OPENAI_API_KEY=your_openai_api_key_here
```

5. **Start the development server**

```bash
cd apps/web
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
cd apps/web
npm run build
npm start
```

## 📖 Usage Guide

1. **Describe your software**: Enter a description of the software or feature you want to create in the "Software Description" input field
2. **Add requirements**: Specify detailed requirements and technical constraints in the "Requirements" input field
3. **Generate code**: Click the "Generate Software" button
4. **View results**: 
   - Generated code will be displayed in the "Generated Code" section with syntax highlighting
   - Corresponding test code will be displayed in the "Generated Tests" section
   - API usage statistics will be displayed in the "LLM Usage Stats" section

### Example

**Software Description:**
```
A simple calculator application
```

**Requirements:**
```
Must support add, subtract, multiply, divide. Handle division by zero.
```

## 🏗️ Architecture

### MCP (Model Context Protocol)

This project uses the MCP protocol to enable communication between agents:

- **Coder Agent**: Responsible for generating code based on descriptions and requirements
- **QA Agent**: Responsible for creating unit tests for the generated code
- **Manager**: Coordinates the workflow of multiple agents

### Workflow

1. User submits description and requirements
2. Manager calls Coder Agent to generate code
3. Manager retrieves code and language type
4. Manager calls QA Agent to generate tests
5. Returns code, tests, and usage statistics

## 🔧 Development Guide

### Adding a New Agent

1. Create a new agent directory under `packages/`
2. Implement the MCP Server interface
3. Register the new agent in `apps/web/lib/manager.ts`

### Modifying UI

The main UI component is located at `apps/web/app/page.tsx`, styled with Tailwind CSS.

### Modifying Agent Behavior

- Code generation logic: `packages/coder-agent/src/index.ts`
- Test generation logic: `packages/qa-agent/src/index.ts`

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit Issues and Pull Requests.

## 📧 Contact

- GitHub: [@chengyitang](https://github.com/chengyitang)
- Issues: [GitHub Issues](https://github.com/chengyitang/AI-Coder/issues)

