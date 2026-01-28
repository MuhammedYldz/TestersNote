import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CreateNotePage from './pages/CreateNotePage';
import EditNotePage from './pages/EditNotePage';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateNotePage />} />
          <Route path="/edit/:id" element={<EditNotePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;