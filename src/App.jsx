import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Header from './layout/header/header.jsx';
import Footer from './layout/footer/footer.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';

function App() {
  return (
    <Router>
      <div className='app'>
        <Header />
        <div className='main-content'>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

/*
<Router path='*' element={<NotFound />} />


function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Container />
      </main>
      <Footer />
    </>
  );
};*/