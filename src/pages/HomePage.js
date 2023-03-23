import '../css/HomePage.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';


export const HomePage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [data, setData] = useState({
        username: '',
        password: ''
    })

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (e.target.name === 'login') {
            await fetch('http://localhost:3000/api/login', {
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
                setLoggedIn(true);
            })
            .catch((error) => {
                
            });
        } else if (e.target.name === 'signUp') {
            
        }
    }

    return (
        <div className='main-section'>
            <div className='left'>
                {!loggedIn && 
                    <>
                        <img className='logo' src="/logo.PNG" alt="logo"/>
                        <h1>Talkie</h1>
                        <p>Find and chat with people near you!</p>
                        <Form>
                            <Form.Group className='mb-3' controlId='formBasicUsername'>
                                <Form.Control name='username' type="text" placeholder="Username" onChange={handleChange}/>
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='formBasicPassword'>
                                <Form.Control name='password' type="password" placeholder="Password" onChange={handleChange}/>
                            </Form.Group>
                            <Form.Group className='buttons-group' controlId='formBasicButtons'>
                                <Button name='login' variant='secondary' type='submit' className='form-button' onClick={handleSubmit}>Login</Button>
                                <Button name='signUp' variant='secondary' type='submit' className='form-button' onClick={handleSubmit}>Sign Up</Button>
                            </Form.Group>
                        </Form>
                    </>
                }
                {loggedIn && 
                    <div className='left-logged-in'>
                        <Button name='view-friends' variant='secondary' className='form-button'>View friends</Button>
                        <Button name='search-friends' variant='secondary' className='form-button'>Look up a user</Button>
                        <Button name='search-nearby' variant='secondary' className='form-button'>Talk with a nearby user!</Button>

                    </div>
                }
            </div>
            <div className='right'>
                <div className='chat-box'>
                    {!loggedIn && 
                        <div className='home-right'>
                            <div>
                                <h3><span className='title'>Talkie</span>, a free-to-use messaging and video call application, we have <span className='description'>NO ACCESS to your messages or video stream data</span>, so your conversations will be kept to just you and people you meet!</h3>
                                <h3>Sign up now and start meeting people!</h3>
                            </div>
                            <p>Application created by Roy Chan</p>
                        </div>
                    }
                    {loggedIn && 
                        <>
                            <div className='messages'>
                                hi, this is a test
                            </div>
                            <div className='bottom-bar'>
                                <Form className='form-chat'>
                                    <Form.Group controlId='formBasicChat' className='text-input'>
                                        <Form.Control type='text' placeholder='Enter message'/>
                                    </Form.Group>
                                    <Button variant='secondary' type='submit' className='send-button'>
                                        <p style={{flex: 1, margin: 0}}>Send</p>
                                    </Button>
                                </Form>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}