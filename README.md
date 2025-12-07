# AI Code Generator

> **UCI MSWE 270 Final Project - Group 10**

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
- 📊 **LLM Usage Tracking**: 
  - Per-agent breakdown (Coder Agent / QA Agent)
  - Total tokens consumed
  - API call counts
- 🏗️ **MCP Architecture**: Multi-agent system with Model Context Protocol

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
│       │   ├── api/         # API routes (generate endpoint)
│       │   ├── page.tsx     # Main page (UI)
│       │   └── layout.tsx   # Layout component
│       └── lib/
│           └── manager.ts   # MCP Manager (coordinates agents)
├── packages/
│   ├── coder-agent/         # Code generation agent (MCP Server)
│   └── qa-agent/            # Test generation agent (MCP Server)
├── .env.example             # Environment variables template
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

Copy the example file and add your OpenAI API key:

```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
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
   - LLM usage statistics broken down by agent will be displayed in the "LLM Usage Stats" section

### Example

**Software Description:**

```
A software application that allows scouts and coaches to analyze and track the performance of individual athletes in various sports.
```

**Requirements:**

```
1. Users can input performance data (speed, agility, accuracy, endurance) for each athlete
2. Generate detailed reports with insights on strengths and weaknesses
3. Compare performance of multiple athletes side by side
4. Store athlete profiles with historical performance data
```

## 🏗️ Architecture

### Multi-Agent System with MCP

This project implements a multi-agent system using the Model Context Protocol (MCP) for inter-agent communication:

| Component | Role | MCP Role | Tools |
|-----------|------|----------|-------|
| **Manager** | Coordinates workflow | MCP Client | - |
| **Coder Agent** | Generates code | MCP Server | `generate_code` |
| **QA Agent** | Generates tests | MCP Server | `generate_tests` |

### Collaboration Pattern

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│    User     │────▶│   Manager    │────▶│   Coder    │
│   (Input)   │     │  (Manager)   │     │   Agent    │
└─────────────┘     └──────┬───────┘     └─────┬──────┘
                          │                    │
                          │  1. generate_code  │
                          │◀───────────────────┤
                          │                    │
                          │     ┌────────────┐ │
                          │────▶│     QA     │ │
                          │     │   Agent    │ │
                          │     └─────┬──────┘ │
                          │           │        │
                          │  2. generate_tests │
                          │◀──────────┤        │
                          │           │        │
                    ┌─────▼─────┐     │        │
                    │  Return   │     │        │
                    │  Results  │     │        │
                    └───────────┘     │        │
```

### Workflow

1. User submits description and requirements via UI
2. Manager establishes MCP connections to agents
3. Manager calls **Coder Agent** → generates code
4. Manager calls **QA Agent** → generates tests based on code
5. Manager aggregates results and usage statistics
6. Manager closes MCP connections (resource cleanup)
7. Returns code, tests, and per-agent usage statistics to UI

### MCP Implementation Details

- **Transport**: `StdioClientTransport` / `StdioServerTransport`
- **Communication**: JSON-RPC over stdio
- **Connection Management**: Proper `connect()` and `disconnect()` lifecycle

## 📊 LLM Usage Tracking

The system tracks and displays LLM usage broken down by agent:

```
┌─────────────────────────────────────┐
│          LLM Usage Stats            │
├─────────────────┬───────────────────┤
│  🔵 Coder Agent │  🟢 QA Agent      │
│  Tokens: 500    │  Tokens: 300      │
│  API Calls: 1   │  API Calls: 1     │
├─────────────────┴───────────────────┤
│  📊 Total Usage                     │
│  Total Tokens: 800                  │
│  Total API Calls: 2                 │
└─────────────────────────────────────┘
```

## 🔧 Development Guide

### Adding a New Agent

1. Create a new agent directory under `packages/`
2. Implement the MCP Server interface using `@modelcontextprotocol/sdk`
3. Define tools with `ListToolsRequestSchema` and `CallToolRequestSchema`
4. Register the new agent in `apps/web/lib/manager.ts`

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
