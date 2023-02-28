import '../css/HomePage.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export const HomePage = () => {
    return (
        <div className='main-section'>
            <div className='left'>
                <img className='logo' src="/logo.PNG" alt="logo"/>
                <h1>Talkie</h1>
                <p>Find and chat with people near you!</p>
                <Form>
                    <Form.Group className='mb-3' controlId='formBasicUsername'>
                        <Form.Control type="text" placeholder="Username" />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className='buttons-group' controlId='formBasicButtons'>
                        <Button variant='secondary' type='submit' className='form-button'>Login</Button>
                        <Button variant='secondary' type='submit' className='form-button'>Sign Up</Button>
                    </Form.Group>
                </Form>
            </div>
            <div className='right'>
                <div className='chat-box'>
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
                </div>
            </div>
        </div>
    );
}