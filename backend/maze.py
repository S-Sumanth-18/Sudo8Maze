import random
from collections import deque

class Maze:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols
        self.grid = [[[True, True, True, True] for _ in range(cols)] for _ in range(rows)]
        self.visited = [[False for _ in range(cols)] for _ in range(rows)]
    
    def generate(self):
        self._dfs(0, 0)
        return self.grid
    
    def _dfs(self, r, c):
        self.visited[r][c] = True
        directions = [(0,1), (1,0), (0,-1), (-1,0)]  # right, down, left, up
        random.shuffle(directions)
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < self.rows and 0 <= nc < self.cols and not self.visited[nr][nc]:
                # walls: [top, right, bottom, left]
                if dr == -1 and dc == 0:  # up
                    self.grid[r][c][0] = False; self.grid[nr][nc][2] = False
                elif dr == 0 and dc == 1:  # right
                    self.grid[r][c][1] = False; self.grid[nr][nc][3] = False
                elif dr == 1 and dc == 0:  # down
                    self.grid[r][c][2] = False; self.grid[nr][nc][0] = False
                elif dr == 0 and dc == -1:  # left
                    self.grid[r][c][3] = False; self.grid[nr][nc][1] = False
                self._dfs(nr, nc)

    def solve(self):
        # BFS to find shortest path from (0,0) to (rows-1, cols-1)
        start = (0, 0)
        end = (self.rows - 1, self.cols - 1)
        queue = deque([(start, [start])])
        visited = set([start])
        
        while queue:
            (r, c), path = queue.popleft()
            if (r, c) == end:
                return path, len(path)
            
            # Check valid neighbors based on walls
            walls = self.grid[r][c]
            # top
            if not walls[0] and (r-1, c) not in visited:
                visited.add((r-1, c))
                queue.append(((r-1, c), path + [(r-1, c)]))
            # right
            if not walls[1] and (r, c+1) not in visited:
                visited.add((r, c+1))
                queue.append(((r, c+1), path + [(r, c+1)]))
            # bottom
            if not walls[2] and (r+1, c) not in visited:
                visited.add((r+1, c))
                queue.append(((r+1, c), path + [(r+1, c)]))
            # left
            if not walls[3] and (r, c-1) not in visited:
                visited.add((r, c-1))
                queue.append(((r, c-1), path + [(r, c-1)]))
        return [], 0