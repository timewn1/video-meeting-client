import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Room from './pages/Room';

import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/room/*' element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
