import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from 'react-bootstrap/Navbar';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <section className='page'>
      <Navbar>
        <h1 className='brand'>Talkie</h1>
      </Navbar>

      <HomePage />
    </section>
  );
}

export default App;
