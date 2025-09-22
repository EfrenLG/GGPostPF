import React from 'react';
import { UserProvider } from "./context/UserContext";

// Librerías de terceros
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Estilos globales
import './App.css';

// Componentes de layout
import Header from './layout/header/header.jsx';
import Footer from './layout/footer/footer.jsx';

import AdRefreshOnRouteChange from './components/AdRefreshOnRouteChange/AdRefreshOnRouteChange.jsx';
import ChatGPT from './components/ChatGPT/ChatGPT.jsx';

// Páginas
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Post from './pages/Post/Post.jsx';
import RawgAPI from './pages/RawgAPI/RawgAPI.jsx';
import User from './pages/User/User.jsx';

function App() {
  return (
    <Router>
      <UserProvider>
        <div className='layout-wrapper'>
          <Header />
          <AdRefreshOnRouteChange />
          <div className='main-content'>
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/post' element={<Post />} />
              <Route path='/rawgAPI' element={<RawgAPI />} />
              <Route path='/user' element={<User />} />
            </Routes>
          </div>
          <ChatGPT />
          <Footer />
        </div>
      </UserProvider>
    </Router>
  );
};

export default App;