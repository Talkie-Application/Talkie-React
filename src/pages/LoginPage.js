import '../css/LoginPage.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import { Context as UserIdContext } from '../contexts/UserIdContext';
import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [selectedLogin, setSelectedLogin] = useState(true);
    const userId = useContext(UserIdContext);
    const [data, setData] = useState({
        username: '',
        password: ''
    })

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    const handleCardChange = (e) => {
        if (e.target.name === 'login') {
            setSelectedLogin(true);
        } else {
            setSelectedLogin(false);
        }
    }

    const fetchUser = async (url) => {
        await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        })
        .then((res) => {
            return res.json();  // a promise
        })
        .then((json) => {
            if (json.error) {
                document.getElementById('error-text').innerHTML = json.error;
            } else {
                userId.setID(json.token);
                navigate('/');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (e.target.name === 'login') {
            fetchUser('http://localhost:3000/api/login');
        } else if (e.target.name === 'signUp') {
            fetchUser('http://localhost:3000/api/signUp');
        }
    }

    return (
        <div className='hero'>
            <div className='hero-left'>
                {/* <img className='logo' src="/logo.PNG" alt="logo"/> */}
                <h1>Talkie</h1>
                <p>Find and chat with people near you!</p>
            </div>
            <div className='hero-right'>
                <Card className='.card'>
                    <Card.Header>
                        <Nav variant='tabs' defaultActiveKey='login'>
                            <Nav.Item>
                                <Nav.Link name='login' eventKey='login' onClick={handleCardChange}>Login</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link name='signUp' eventKey='signUp' onClick={handleCardChange}>Sign Up</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group className='mb-3' controlId='formBasicUsername'>
                                <Form.Control name='username' type="text" placeholder="Username" onChange={handleChange}/>
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='formBasicPassword'>
                                <Form.Control name='password' type="password" placeholder="Password" onChange={handleChange}/>
                            </Form.Group>
                            <Form.Text id="error-text" className="text-muted"></Form.Text>
                            <Form.Group className='buttons-group' controlId='formBasicButtons' style={{marginTop: '30px'}}>
                                {selectedLogin && <Button name='login' variant='secondary' type='submit' className='form-button' onClick={handleSubmit}>Login</Button>}
                                {!selectedLogin && <Button name='signUp' variant='secondary' type='submit' className='form-button' onClick={handleSubmit}>Sign Up</Button>}
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default LoginPage;