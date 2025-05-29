//import { useState } from 'react'
/*import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'*/
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Header from './layout/header/header.jsx';
import Footer from './layout/footer/footer.jsx';
import Container from './components/Container/Container.jsx';

function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Container/>
      </main>
      <Footer />
    </>
  );
};

export default App;