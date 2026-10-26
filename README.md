# 🧩 Sudo8Maze — Interactive AI Puzzle Designer & Solver

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python_3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, full-stack visualizer and interactive playground demonstrating classic **Artificial Intelligence search algorithms** and **heuristics** across three beloved puzzle domains: **Maze Generation & Solving**, **Sudoku**, and the **8-Puzzle**.

## 🌐 Live Demo

Try the application here: [https://sudo8-maze.vercel.app/](https://sudo8-maze.vercel.app/)

---

## 📸 Overview & Features

| Puzzle | Algorithm | Heuristic / Technique | Description |
| :--- | :--- | :--- | :--- |
| **🌀 Maze** | DFS + BFS | Randomized Carving + Shortest Path | Procedurally generates perfect mazes using recursive Depth-First Search and computes optimal solutions with Breadth-First Search. |
| **🔢 Sudoku** | Recursive Backtracking | Constraint Propagation | Generates valid boards across multiple difficulty levels and visualizes real-time backtracking solver logic. |
| **🕹️ 8-Puzzle** | $A^*$ (A-Star) Search | Manhattan Distance | Solves arbitrary tile states optimally, animating step-by-step heuristic state transitions toward the target board. |

### Key Highlights
- **Interactive Gameplay**: Play puzzles manually or let the AI algorithm solve them step-by-step.
- **Real-Time Visualizations**: See paths and tile slides animated directly in the browser.
- **Modular Full-Stack Architecture**: Clean decoupling between the FastAPI algorithmic engine and the React frontend.
- **Responsive Dark Mode UI**: Built with Tailwind CSS and Lucide icons for a sleek, cyber-inspired design.

---

## 🧠 AI Concepts Demonstrated

1. **Depth-First Search (DFS)**:
   - Recursively explores unvisited cells while knocking down walls between them to generate a complete, loop-free maze.
2. **Breadth-First Search (BFS)**:
   - Explores adjacent cells in concentric layers to guarantee finding the shortest path from start $(0,0)$ to goal $(N-1, N-1)$.
3. **Recursive Backtracking**:
   - Systematically tries digit placements $(1-9)$ conforming to row, column, and $3 \times 3$ grid constraints, backtracking immediately when a branch violates a rule.
4. **$A^*$ Search Algorithm**:
   - Evaluates game states using $f(n) = g(n) + h(n)$, where $g(n)$ is the path cost and $h(n)$ is the **Manhattan Distance** heuristic (sum of horizontal and vertical distances of tiles from their target positions).

---

## 🛠️ Tech Stack

- **Backend**: Python 3, [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/)
- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Axios](https://axios-http.com/), [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: v18 or higher (with `npm`)
- **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/S-Sumanth-18/Sudo8Maze.git
cd Sudo8Maze
```

---

### 2. Backend Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   - **Windows**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   > 📍 Backend will run at `http://localhost:8000` (API documentation available at `http://localhost:8000/docs`).

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   > 📍 Frontend will run at `http://localhost:5173`. Open this URL in your browser to interact with the puzzles!

---

## 📡 API Reference

| Endpoint | Method | Query Parameters | Description |
| :--- | :---: | :--- | :--- |
| `/` | `GET` | — | Health check / API status message |
| `/api/maze` | `GET` | `size` *(int, default: 10)* | Returns generated maze grid and BFS solution path |
| `/api/sudoku` | `GET` | `difficulty` *(easy, medium, hard)* | Returns incomplete puzzle board and full solved matrix |
| `/api/eight-puzzle` | `GET` | `difficulty` *(easy, medium, hard)* | Returns initial state, sequence of states, and move count |

Interactive Swagger UI documentation is available at `http://localhost:8000/docs`.

---

## 📂 Project Structure

```text
Sudo8Maze/
├── backend/
│   ├── main.py             # FastAPI entrypoint & route handlers
│   ├── maze.py             # Maze generator (DFS) & solver (BFS)
│   ├── sudoku.py           # Sudoku board builder & solver (Backtracking)
│   ├── eight_puzzle.py     # 8-Puzzle state generator & A* search solver
│   ├── utils.py            # Backend utility helpers
│   └── requirements.txt    # Python requirements
├── frontend/
│   ├── index.html          # Vite HTML template
│   ├── package.json        # Frontend scripts & dependencies
│   ├── tailwind.config.js  # Tailwind styling configuration
│   └── src/
│       ├── App.jsx         # App routes & layout
│       ├── components/
│       │   └── Navbar.jsx  # Navigation bar
│       └── pages/
│           ├── Home.jsx            # Landing page
│           ├── MazePage.jsx        # Interactive maze generator & solver
│           ├── SudokuPage.jsx      # Sudoku player & backtracking visualizer
│           └── EightPuzzlePage.jsx # 8-Puzzle board & A* step animator
└── README.md
```

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.