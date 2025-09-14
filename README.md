# Automata Studio

Automata Studio is a web-based tool designed for building and visualizing automata. It enables students and researchers to explore concepts from the Theory of Computation through interactive diagrams and simulations.

## Features

- Build and visualize DFA, NFA, PDA, and Turing Machines
- Step-by-step simulation with Instantaneous Descriptions (IDs)
- Convert NFA to DFA using subset construction
- Graphical editor for states and transitions
- Support for start, accepting, and rejecting states
- Import/Export automata in JSON and JFLAP (.jff) formats
- Undo/Redo functionality and autosave via local storage
- Live validation warnings for:
    - Missing start state
    - No accepting states
    - Undefined symbols in transitions
    - Dead or unreachable states
    - Nondeterminism (for DFA)

## Project Structure

```
automata-studio/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        ├── layout/
        │   └── Layout.jsx
        ├── store/
        │   └── AutomatonContext.jsx
        ├── routes/
        │   ├── Home.jsx
        │   ├── Builder.jsx
        │   ├── Simulator.jsx
        │   └── Determinize.jsx
        ├── components/
        │   ├── Toolbar.jsx
        │   ├── GraphCanvas.jsx
        │   ├── BuilderPanel.jsx
        │   ├── IDPanel.jsx
        │   └── MemoryPanel.jsx
        └── engine/
                ├── dfa.js
                ├── nfa.js
                ├── determinize.js
                └── types.js
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/automata-studio.git
cd automata-studio
npm install
```

### Development

To run the app in development mode with hot reload:

```bash
npm run dev
```

### Build

To create a production-ready build:

```bash
npm run build
```

### Preview

To preview the production build locally:

```bash
npm run preview
```

## Usage

1. **Builder Page**: Create an automaton by adding states, marking start/accept/reject states, and adding transitions (including epsilon transitions). Use the toolbar to switch automaton types or load presets.
2. **Simulator Page**: Enter an input string and run the simulation to view step-by-step Instantaneous Descriptions (IDs).
3. **NFA→DFA Page**: Convert an NFA to a DFA and visualize the determinization process.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.