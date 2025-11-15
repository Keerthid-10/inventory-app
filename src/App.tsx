import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Stock from './components/Stock';
import AddStock from './components/AddStock';
import EditStock from './components/EditStock';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Stock/>} />
      <Route path='/add' element={<AddStock/>} />
      <Route path='/edit/:id' element={<EditStock/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;
