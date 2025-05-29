import React from 'react';

// Librerías de terceros
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Estilos globales
import './App.css';

// Componentes de layout
import Header from './layout/header/header.jsx';
import Footer from './layout/footer/footer.jsx';

// Páginas
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';

function App() {
  return (
    <Router>
      <div className='layout-wrapper'>
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
*/