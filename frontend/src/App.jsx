import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MazePage from './pages/MazePage';
import SudokuPage from './pages/SudokuPage';
import EightPuzzlePage from './pages/EightPuzzlePage';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500/30">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/maze" element={<MazePage />} />
            <Route path="/sudoku" element={<SudokuPage />} />
            <Route path="/eight-puzzle" element={<EightPuzzlePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
