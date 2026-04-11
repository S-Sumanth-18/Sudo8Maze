import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Play } from 'lucide-react';

const SudokuPage = () => {
  const [originalBoard, setOriginalBoard] = useState(null);
  const [userBoard, setUserBoard] = useState(null);
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [showSolution, setShowSolution] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  const fetchSudoku = async () => {
    setLoading(true);
    setShowSolution(false);
    setSelectedCell(null);
    try {
      const res = await axios.get(`http://localhost:8000/sudoku?difficulty=${difficulty}`);
      setOriginalBoard(res.data.puzzle);
      // Deep copy the original board for the user to play on
      setUserBoard(JSON.parse(JSON.stringify(res.data.puzzle)));
      setSolution(res.data.solution);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSudoku();
  }, [difficulty]); // Reload if difficulty changes? No, let's keep it manual. Wait, remove dependency!
  
  // Re-run on mount
  useEffect(() => {
    fetchSudoku();
  }, []);

  // Keyboard handling for typing numbers in Sudoku
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedCell || !userBoard || showSolution) return;
      const [r, c] = selectedCell;
      
      // User can only modify empty cells from the original board
      if (originalBoard[r][c] !== 0) return;

      if (e.key >= '1' && e.key <= '9') {
        const newBoard = [...userBoard];
        newBoard[r][c] = parseInt(e.key);
        setUserBoard(newBoard);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        const newBoard = [...userBoard];
        newBoard[r][c] = 0;
        setUserBoard(newBoard);
      } else if (e.key === 'ArrowUp') {
        setSelectedCell([Math.max(0, r - 1), c]);
      } else if (e.key === 'ArrowDown') {
        setSelectedCell([Math.min(8, r + 1), c]);
      } else if (e.key === 'ArrowLeft') {
        setSelectedCell([r, Math.max(0, c - 1)]);
      } else if (e.key === 'ArrowRight') {
        setSelectedCell([r, Math.min(8, c + 1)]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, userBoard, originalBoard, showSolution]);

  const checkWin = () => {
    if (!userBoard || !solution) return false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (userBoard[r][c] !== solution[r][c]) return false;
      }
    }
    return true;
  };

  const hasWon = checkWin();

  const renderCell = (r, c) => {
    const isOriginal = originalBoard && originalBoard[r][c] !== 0;
    const val = showSolution ? solution[r][c] : userBoard[r][c];
    const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;
    const isIncorrect = !showSolution && !isOriginal && val !== 0 && val !== solution[r][c];

    // Thicker borders for 3x3 grids
    const borderClasses = `
      ${r % 3 === 0 && r !== 0 ? 'border-t-2 border-t-purple-500/50' : 'border-t border-slate-700'}
      ${c % 3 === 0 && c !== 0 ? 'border-l-2 border-l-purple-500/50' : 'border-l border-slate-700'}
      ${r === 8 ? 'border-b border-slate-700' : ''}
      ${c === 8 ? 'border-r border-slate-700' : ''}
    `;

    let textColor = 'text-slate-500';
    if (isOriginal) textColor = 'text-white';
    else if (showSolution) textColor = 'text-purple-400';
    else if (val !== 0) textColor = isIncorrect ? 'text-rose-500' : 'text-purple-300';

    return (
      <div 
        key={`${r}-${c}`} 
        onClick={() => { if (!isOriginal && !showSolution) setSelectedCell([r, c]); }}
        className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-lg md:text-2xl font-semibold transition-colors
          ${borderClasses}
          ${isSelected ? 'bg-purple-900/40 ring-2 ring-inset ring-purple-500 z-10' : (isOriginal ? 'bg-slate-800' : 'bg-slate-900 hover:bg-slate-800/50')}
          ${textColor}
          ${!isOriginal && !showSolution ? 'cursor-pointer' : ''}
        `}
      >
        {val !== 0 ? val : ''}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200 mb-4">
          Sudoku Solver
        </h1>
        <p className="text-slate-400 mb-2">Generates and solves 9x9 grids using Backtracking Algorithm.</p>
        <p className="text-purple-300 font-semibold">Play mode: Click a cell and type 1-9 to fill it. Mistakes are highlighted.</p>
      </div>

      <div className="w-full bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm mb-8 flex flex-wrap gap-4 items-end justify-between">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2 outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={fetchSudoku}
            disabled={loading}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2 w-5 h-5" /> : null}
            Generate Sudoku
          </button>
          
          <button 
            onClick={() => {
              setShowSolution(!showSolution);
              setSelectedCell(null);
            }}
            disabled={!originalBoard || loading || hasWon}
            className={`px-6 py-2.5 font-medium rounded-xl transition-colors border flex items-center ${
              showSolution ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-transparent border-slate-600 hover:border-slate-400 text-slate-300'
            }`}
          >
            <Play className="mr-2 w-4 h-4" />
            {showSolution ? 'Hide Solution' : 'Solve (Backtracking)'}
          </button>
        </div>
      </div>

      {hasWon && !showSolution && (
        <div className="mb-6 px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-xl animate-fade-in font-bold text-xl">
          🎉 You Won! The Sudoku is correctly solved!
        </div>
      )}

      <div className="p-2 bg-slate-800 rounded-xl shadow-2xl shadow-purple-900/20 border border-white/10 relative">
        {loading ? (
          <div className="w-[360px] h-[360px] md:w-[504px] md:h-[504px] flex items-center justify-center text-purple-400">
            <Loader2 className="animate-spin w-12 h-12" />
          </div>
        ) : originalBoard && userBoard ? (
          <div className="grid grid-cols-9 bg-slate-700 border-2 border-slate-600 w-fit">
            {userBoard.map((row, r) => row.map((_, c) => renderCell(r, c)))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SudokuPage;
