import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Play, ArrowRightCircle } from 'lucide-react';

const EightPuzzlePage = () => {
  const [initialState, setInitialState] = useState(null);
  const [currentState, setCurrentState] = useState(null);
  const [solutionSteps, setSolutionSteps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Target state to check for win
  const targetState = JSON.stringify([[1, 2, 3], [4, 5, 6], [7, 8, 0]]);

  const fetchPuzzle = async () => {
    setLoading(true);
    setIsPlaying(false);
    setStepIndex(0);
    try {
      const res = await axios.get(`/api/eight-puzzle?difficulty=${difficulty}`);
      setInitialState(res.data.initial_state);
      setCurrentState(res.data.initial_state);
      setSolutionSteps(res.data.solution_steps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying && solutionSteps && stepIndex < solutionSteps.length - 1) {
      interval = setInterval(() => {
        setStepIndex(prev => {
          if (prev >= solutionSteps.length - 2) {
            setIsPlaying(false);
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, solutionSteps, stepIndex]);

  // Update current state if AI solution is playing
  useEffect(() => {
    if (solutionSteps && stepIndex >= 0 && stepIndex < solutionSteps.length && isPlaying) {
      setCurrentState(solutionSteps[stepIndex]);
    }
  }, [stepIndex, solutionSteps, isPlaying]);

  // Sync state when stepIndex is manually changed via buttons
  const setStepSync = (idx) => {
    setStepIndex(idx);
    if (solutionSteps && solutionSteps[idx]) {
      setCurrentState(solutionSteps[idx]);
    }
  };

  const hasWon = currentState && JSON.stringify(currentState) === targetState;

  const handleTileClick = (r, c) => {
    if (isPlaying || loading || hasWon) return;

    // Find the empty tile (0)
    let zr = -1, zc = -1;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentState[i][j] === 0) {
          zr = i;
          zc = j;
          break;
        }
      }
    }

    // Check if the clicked tile is adjacent to the empty tile
    if (Math.abs(r - zr) + Math.abs(c - zc) === 1) {
      // Swap them
      const newState = currentState.map(row => [...row]);
      newState[zr][zc] = newState[r][c];
      newState[r][c] = 0;
      setCurrentState(newState);
      
      // Stop AI solution playback tracking if user makes a manual move
      setStepIndex(-1);
    }
  };

  const renderGrid = () => {
    if (!currentState) return null;
    return (
      <div className="grid grid-cols-3 gap-2 bg-slate-700 p-2 rounded-xl">
        {currentState.map((row, r) => 
          row.map((val, c) => (
            <div 
              key={`${r}-${c}`}
              onClick={() => handleTileClick(r, c)}
              className={`w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-4xl font-bold rounded-lg transition-all duration-300 shadow-lg ${
                val === 0 
                  ? 'bg-slate-800/80 shadow-inner translate-y-1 cursor-default' 
                  : `bg-gradient-to-br from-pink-500 to-rose-600 text-white border border-pink-400/30 ${!hasWon && !isPlaying ? 'cursor-pointer hover:-translate-y-1 hover:brightness-110 active:scale-95' : ''}`
              }`}
            >
              {val !== 0 ? val : ''}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-300 mb-4">
          8-Puzzle AI
        </h1>
        <p className="text-slate-400 mb-2">Solves using A* Search algorithm with Manhattan Distance heuristic.</p>
        <p className="text-pink-300 font-semibold">Play mode: Click a tile next to the empty space to slide it!</p>
      </div>

      <div className="w-full bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm mb-8 flex flex-wrap gap-4 items-end justify-between">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Scramble Complexity</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2 outline-none focus:border-pink-500 transition-colors"
          >
            <option value="easy">Easy (10-15 moves)</option>
            <option value="medium">Medium (16-22 moves)</option>
            <option value="hard">Hard (23-30 moves)</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={fetchPuzzle}
            disabled={loading}
            className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2 w-5 h-5" /> : null}
            Generate Puzzle
          </button>
        </div>
      </div>

      {hasWon && (
        <div className="mb-6 px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-xl animate-fade-in font-bold text-xl">
          🎉 You Won! The 8-Puzzle is solved!
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-12 items-center justify-center w-full">
        <div className="relative p-2 bg-slate-800/80 rounded-2xl border border-white/10 shadow-2xl shadow-pink-900/20">
          {loading ? (
            <div className="w-[304px] h-[304px] md:w-[400px] md:h-[400px] flex items-center justify-center text-pink-400">
              <Loader2 className="animate-spin w-12 h-12" />
            </div>
          ) : renderGrid()}
        </div>

        {solutionSteps && currentState && !hasWon && (
          <div className="flex flex-col items-center w-full md:w-64 bg-slate-800/40 p-6 rounded-2xl border border-white/5">
            <h3 className="font-semibold text-xl mb-6 text-pink-300">Solution Controls</h3>
            
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => setStepSync(Math.max(0, stepIndex - 1))}
                disabled={stepIndex <= 0 || isPlaying}
                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full disabled:opacity-50"
              >
                <ArrowRightCircle className="w-6 h-6 rotate-180" />
              </button>
              
              <button 
                onClick={() => {
                  if (!isPlaying) {
                    // If user manually played, we reset to the initial state to clearly show the AI solution
                    if (stepIndex === -1) {
                      setCurrentState(initialState);
                      setStepIndex(0);
                    }
                  }
                  setIsPlaying(!isPlaying);
                }}
                className={`p-3 rounded-full transition-colors ${isPlaying ? 'bg-rose-500 hover:bg-rose-600' : 'bg-pink-600 hover:bg-pink-500'} text-white`}
              >
                <Play className={`w-6 h-6 ${isPlaying ? 'opacity-50' : ''}`} />
              </button>
              
              <button 
                onClick={() => setStepSync(Math.min(solutionSteps.length - 1, stepIndex + 1))}
                disabled={(stepIndex !== -1 && stepIndex === solutionSteps.length - 1) || isPlaying}
                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full disabled:opacity-50"
              >
                <ArrowRightCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="text-center font-mono">
              <div className="text-slate-400 mb-2">Step Breakdown</div>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
                {stepIndex === -1 ? '?' : stepIndex} <span className="text-xl text-slate-500">/ {solutionSteps.length - 1}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EightPuzzlePage;
