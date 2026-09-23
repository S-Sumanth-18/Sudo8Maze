import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Play } from 'lucide-react';

const MazePage = () => {
  const [mazeData, setMazeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(15);
  const [showSolution, setShowSolution] = useState(false);
  
  // Gameplay states
  const [playerPosition, setPlayerPosition] = useState([0, 0]);
  const [hasWon, setHasWon] = useState(false);

  const fetchMaze = async () => {
    setLoading(true);
    setShowSolution(false);
    setHasWon(false);
    setPlayerPosition([0, 0]);
    try {
      const res = await axios.get(`/api/maze?size=${size}`);
      setMazeData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaze();
  }, []);

  // Keyboard movement handler for player
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent scrolling when using arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      
      if (!mazeData || showSolution || hasWon) return;

      const [r, c] = playerPosition;
      const walls = mazeData.maze[r][c]; // [top, right, bottom, left]
      let nr = r, nc = c;

      if (e.key === 'ArrowUp' && !walls[0]) nr -= 1;
      else if (e.key === 'ArrowRight' && !walls[1]) nc += 1;
      else if (e.key === 'ArrowDown' && !walls[2]) nr += 1;
      else if (e.key === 'ArrowLeft' && !walls[3]) nc -= 1;

      if (nr !== r || nc !== c) {
        setPlayerPosition([nr, nc]);
        if (nr === size - 1 && nc === size - 1) {
          setHasWon(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mazeData, playerPosition, showSolution, hasWon, size]);

  const isPathCell = (r, c) => {
    if (!mazeData || !mazeData.solution_path || !showSolution) return false;
    return mazeData.solution_path.some(([pr, pc]) => pr === r && pc === c);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-indigo-200 mb-4">
          DFS Maze Generator
        </h1>
        <p className="text-slate-400 mb-2">Generates with Recursive Backtracking. Solves with Breadth-First Search.</p>
        <p className="text-indigo-300 font-semibold">Play mode: Use arrow keys to navigate from Start (S) to End (E)!</p>
      </div>

      <div className="w-full bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm mb-8 flex flex-wrap gap-4 items-end justify-between">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Maze Size ({size}x{size})</label>
          <input 
            type="range" 
            min="5" max="25" 
            value={size} 
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-48 accent-indigo-500"
          />
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={fetchMaze}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2 w-5 h-5" /> : null}
            Generate Maze
          </button>
          
          <button 
            onClick={() => setShowSolution(!showSolution)}
            disabled={!mazeData || loading}
            className={`px-6 py-2.5 font-medium rounded-xl transition-colors border flex items-center ${
              showSolution ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-transparent border-slate-600 hover:border-slate-400 text-slate-300'
            }`}
          >
            <Play className="mr-2 w-4 h-4" />
            {showSolution ? 'Hide Solution' : 'Solve (BFS)'}
          </button>
        </div>
      </div>

      {hasWon && (
        <div className="mb-6 px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-xl animate-fade-in font-bold text-xl">
          🎉 You Won! You successfully navigated to the end!
        </div>
      )}

      <div className="relative p-4 bg-slate-800 rounded-xl overflow-auto w-full flex justify-center border border-white/10 shadow-2xl shadow-indigo-500/10">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-indigo-400">
            <Loader2 className="animate-spin w-12 h-12" />
          </div>
        ) : mazeData ? (
          <div 
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${size}, 1fr)`,
              width: 'fit-content'
            }}
          >
            {mazeData.maze.map((row, r) => (
              row.map((cell, c) => (
                <div 
                  key={`${r}-${c}`}
                  className={`w-6 h-6 md:w-8 md:h-8 transition-colors duration-300 ${isPathCell(r, c) ? 'bg-indigo-500' : 'bg-slate-900'} relative`}
                >
                  {/* Walls */}
                  {cell[0] && <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-200/50 z-10" />}
                  {cell[1] && <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-indigo-200/50 z-10" />}
                  {cell[2] && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-200/50 z-10" />}
                  {cell[3] && <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-indigo-200/50 z-10" />}
                  
                  {/* Start Marker */}
                  {r === 0 && c === 0 && !isPathCell(r,c) && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs text-green-400 font-bold opacity-50">S</span>
                  )}
                  {/* End Marker */}
                  {r === size - 1 && c === size - 1 && !isPathCell(r,c) && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs text-rose-400 font-bold opacity-50">E</span>
                  )}
                  
                  {/* Player Marker */}
                  {playerPosition[0] === r && playerPosition[1] === c && !showSolution && (
                    <div className="absolute inset-1 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] z-20 animate-pulse" />
                  )}
                </div>
              ))
            ))}
          </div>
        ) : null}
      </div>
      
      {mazeData && showSolution && (
        <div className="mt-6 text-indigo-200 animate-fade-in font-mono text-sm">
          <span className="text-white font-semibold">Solution Length:</span> {mazeData.difficulty} moves
        </div>
      )}
    </div>
  );
};

export default MazePage;
