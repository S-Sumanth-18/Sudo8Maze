import React from 'react';
import { Link } from 'react-router-dom';
import { Grid3X3, ArrowRight, LayoutGrid, Gamepad2 } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Game Puzzle Designer AI
        </h1>
        <p className="text-xl text-slate-300">
          Generate, solve, and interact with algorithmic puzzles powered by classic AI search algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl">
        <PuzzleCard 
          title="Maze Generator" 
          description="Explore Depth-First Search generation and Breadth-First Search solving in a dynamic maze."
          link="/maze"
          icon={<LayoutGrid className="w-10 h-10 text-indigo-400" />}
          gradient="from-indigo-900/50 to-indigo-800/30"
          borderHover="hover:border-indigo-400"
        />
        <PuzzleCard 
          title="Sudoku Solver" 
          description="Classic 9x9 Sudoku generated and solved instantly using recursive backtracking."
          link="/sudoku"
          icon={<Grid3X3 className="w-10 h-10 text-purple-400" />}
          gradient="from-purple-900/50 to-purple-800/30"
          borderHover="hover:border-purple-400"
        />
        <PuzzleCard 
          title="8-Puzzle AI" 
          description="Slide tiles to solve the puzzle using A* Search and Manhattan Distance heuristics."
          link="/eight-puzzle"
          icon={<Gamepad2 className="w-10 h-10 text-pink-400" />}
          gradient="from-pink-900/50 to-pink-800/30"
          borderHover="hover:border-pink-400"
        />
      </div>
    </div>
  );
};

const PuzzleCard = ({ title, description, link, icon, gradient, borderHover }) => (
  <Link to={link} className="group block">
    <div className={`h-full p-8 rounded-2xl bg-gradient-to-br ${gradient} border border-slate-700/50 ${borderHover} transition-all duration-300 backdrop-blur-sm relative overflow-hidden group-hover:-translate-y-2 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]`}>
      <div className="mb-6 inline-flex p-3 rounded-xl bg-slate-800/50 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 mb-8">{description}</p>
      <div className="absolute bottom-8 right-8 flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Try Now <ArrowRight className="ml-2 w-4 h-4" />
      </div>
    </div>
  </Link>
);

export default Home;
