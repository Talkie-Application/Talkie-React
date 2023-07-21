import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
// import CallPage from './pages/CallPage';
import { Provider as UserIdContextProvider } from './contexts/UserIdContext';
import { AuthLayout } from './layouts/AuthLayout';

function App() {
  return (
    <UserIdContextProvider>
      <Router>
        <section className='page'>
          

          <Routes>
            <Route path='/login' element={<LoginPage />} />

            <Route element={<AuthLayout />}>
              <Route path='/' element={<HomePage />} />
              
            </Route>
          </Routes>

          <Navbar style={{position: 'absolute'}}>
            <h1 className='brand'>Talkie</h1>
          </Navbar>
        </section>
      </Router>
    </UserIdContextProvider>
  );
}

export default App;
