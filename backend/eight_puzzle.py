import random
import heapq

def manhattan_distance(state, target):
    dist = 0
    for i in range(3):
        for j in range(3):
            val = state[i][j]
            if val != 0:
                # find target pos
                for tr in range(3):
                    for tc in range(3):
                        if target[tr][tc] == val:
                            dist += abs(i - tr) + abs(j - tc)
    return dist

def get_neighbors(state):
    neighbors = []
    # find 0 (empty tile)
    r, c = -1, -1
    for i in range(3):
        for j in range(3):
            if state[i][j] == 0:
                r, c = i, j
                break
        if r != -1: break
    
    dirs = [(0,1), (1,0), (0,-1), (-1,0)]
    for dr, dc in dirs:
        nr, nc = r + dr, c + dc
        if 0 <= nr < 3 and 0 <= nc < 3:
            new_state = [row[:] for row in state]
            new_state[r][c], new_state[nr][nc] = new_state[nr][nc], new_state[r][c]
            neighbors.append(new_state)
    return neighbors

def state_to_tuple(state):
    return tuple(tuple(row) for row in state)

def solve_eight_puzzle_a_star(start_state):
    target_state = [[1, 2, 3], [4, 5, 6], [7, 8, 0]]
    queue = []
    # (f, g, state_tuple, path)
    heapq.heappush(queue, (0, 0, state_to_tuple(start_state), [start_state]))
    visited = set()
    visited.add(state_to_tuple(start_state))
    
    while queue:
        _, g, current_tuple, path = heapq.heappop(queue)
        current = [list(row) for row in current_tuple]
        
        if current == target_state:
            return path, g
        
        for neighbor in get_neighbors(current):
            n_tuple = state_to_tuple(neighbor)
            if n_tuple not in visited:
                visited.add(n_tuple)
                h = manhattan_distance(neighbor, target_state)
                heapq.heappush(queue, (g + 1 + h, g + 1, n_tuple, path + [neighbor]))
                
    return [], 0 # Should not happen if solvable

def make_solvable_state(difficulty):
    # Start from solved and make random moves backward
    state = [[1, 2, 3], [4, 5, 6], [7, 8, 0]]
    num_moves = random.randint(10, 15) if difficulty == "easy" else (random.randint(16, 22) if difficulty == "medium" else random.randint(23, 30))
    for _ in range(num_moves):
        neighbors = get_neighbors(state)
        state = random.choice(neighbors)
    return state

def generate_eight_puzzle(difficulty="medium"):
    initial_state = make_solvable_state(difficulty)
    solution_steps, moves = solve_eight_puzzle_a_star(initial_state)
    return initial_state, solution_steps, moves
