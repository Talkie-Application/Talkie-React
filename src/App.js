import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CallPage from './pages/CallPage';

function App() {
  return (
    <Router>
      <section className='page'>
        <Navbar>
          <h1 className='brand'>Talkie</h1>
        </Navbar>

        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </section>
    </Router>
  );
}

export default App;
