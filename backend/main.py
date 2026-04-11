from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from maze import Maze
from sudoku import generate_sudoku
from eight_puzzle import generate_eight_puzzle

app = FastAPI(title="Game Puzzle Designer AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Game Puzzle Designer AI API is running"}

@app.get("/maze")
def get_maze(size: int = 10):
    maze_obj = Maze(size, size)
    grid = maze_obj.generate()
    solution, difficulty = maze_obj.solve()
    return {
        "maze": grid,
        "solution_path": solution,
        "difficulty": difficulty
    }

@app.get("/sudoku")
def get_sudoku(difficulty: str = "medium"):
    puzzle, solution = generate_sudoku(difficulty)
    return {
        "puzzle": puzzle,
        "solution": solution,
        "difficulty": difficulty
    }

@app.get("/eight-puzzle")
def get_eight_puzzle(difficulty: str = "medium"):
    initial_state, solution_steps, moves = generate_eight_puzzle(difficulty)
    return {
        "initial_state": initial_state,
        "solution_steps": solution_steps,
        "moves": moves
    }