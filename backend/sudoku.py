import random
import copy

def is_valid(board, r, c, num):
    for i in range(9):
        if board[r][i] == num:
            return False
        if board[i][c] == num:
            return False
    # Check 3x3 box
    br, bc = 3 * (r // 3), 3 * (c // 3)
    for i in range(3):
        for j in range(3):
            if board[br + i][bc + j] == num:
                return False
    return True

def solve_sudoku_board(board):
    for r in range(9):
        for c in range(9):
            if board[r][c] == 0:
                nums = list(range(1, 10))
                random.shuffle(nums)
                for num in nums:
                    if is_valid(board, r, c, num):
                        board[r][c] = num
                        if solve_sudoku_board(board):
                            return True
                        board[r][c] = 0
                return False
    return True

def generate_sudoku(difficulty):
    board = [[0]*9 for _ in range(9)]
    solve_sudoku_board(board)
    solution = copy.deepcopy(board)
    
    # Remove numbers based on difficulty
    if difficulty == "easy":
        cells_to_remove = 30
    elif difficulty == "hard":
        cells_to_remove = 55
    else: # medium
        cells_to_remove = 45
        
    positions = [(r, c) for r in range(9) for c in range(9)]
    random.shuffle(positions)
    
    for i in range(cells_to_remove):
        r, c = positions[i]
        board[r][c] = 0
        
    return board, solution
