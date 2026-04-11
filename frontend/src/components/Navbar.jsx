import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
            AI Puzzles
          </Link>
          <div className="hidden md:flex gap-6">
            <NavLink to="/maze" active={isActive('/maze')}>Maze</NavLink>
            <NavLink to="/sudoku" active={isActive('/sudoku')}>Sudoku</NavLink>
            <NavLink to="/eight-puzzle" active={isActive('/eight-puzzle')}>8-Puzzle</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, children }) => (
  <Link 
    to={to} 
    className={`font-medium transition-colors duration-200 ${
      active ? 'text-white' : 'text-slate-400 hover:text-white'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;
