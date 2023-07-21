import '../css/HomePage.css';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useState } from 'react';
import { Context as UserIdContext } from '../contexts/UserIdContext';


const mediaConstraints = {
    audio: true,            // We want an audio track
    video: {
      aspectRatio: {
        ideal: 1.333333     // 3:2 aspect is preferred
      }
    }
  };


const HomePage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const userId = useContext(UserIdContext);

    const [webSocketReady, setWebSocketReady] = useState(false);
    const [connection, setConnection] = useState();
    const [peerConnection, setPeerConnection] = useState();
    const [webcamStream, setWebcamStream] = useState();
    const [targetUserId, setTargetUserId] = useState();
    const [receivedSDP, setReceivedSDP] = useState();
    const [iceCandidate, setIceCandidate] = useState();
    const [isCaller, setIsCaller] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    // const [transceiver, setTransceiver] = useState();

    useEffect(() => {
        if (loggedIn) {
            connection.onopen = (e) => {
                console.log('connection opened');
                setWebSocketReady(true);
            }
    
            connection.onmessage = (e) => {
                const parsedJSON = JSON.parse(e.data);
                console.log('connection received message');
                console.log(parsedJSON);
                switch(parsedJSON.type) {
                    case 'found-match':
                        setIsCaller(true);
                        setTargetUserId(parsedJSON.id);
                        break;
                    case 'video-offer':
                        handleVideoOfferMsg(parsedJSON);
                        break;
                    case 'video-answer':
                        handleVideoAnswerMsg(parsedJSON);
                        break;
                    case 'new-ice-candidate':
                        handleNewICECandidateMsg(parsedJSON);
                        break;
                    default:
                        break;
                }
            }
    
            connection.onclose = (e) => {
                console.log('connection closed');
            }
    
            connection.onerror = (e) => {
                console.log('connection error');
                console.log(e);
            }

            if (webSocketReady) {
                connection.send(JSON.stringify({
                    type: 'queue',
                    id: userId.state,
                    location: ''
                }));                    // TODO: location
            }
        }

        return () => {
            if (webSocketReady) {
                connection.close();
            }
        }

        // To ignore loggedIn
        // eslint-disable-next-line
    }, [connection, webSocketReady]);

    useEffect(() => {
        async function addCandidate() {
            var candidate = new RTCIceCandidate(iceCandidate);

            console.log("*** Adding received ICE candidate: ", JSON.stringify(candidate));
            try {
                await peerConnection.addIceCandidate(candidate);
            } catch (err) {
                console.log(err);
            }
        }

        if (peerConnection && webcamStream) {
            // need to set up webcam video and audio media before running peer connection code
            // otherwise might not transmit video and audio
            try {
                webcamStream.getTracks().forEach(
                    track => peerConnection.addTrack(track, webcamStream)
                )
            } catch(err) {
                if (err.name !== "InvalidAccessError") throw err;
            }
            peerConnection.onicecandidate = handleICECandidateEvent;
            peerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
            peerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
            peerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
            peerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
            peerConnection.ontrack = handleTrackEvent;

            if (receivedSDP && !isCaller) {
                // only for callee
                handleCalleePeerConnection();
            } else if (receivedSDP) {
                // only for caller
                acceptCall();
            }

            if (iceCandidate) {
                addCandidate();
            }
        }
        // eslint-disable-next-line
    }, [peerConnection, receivedSDP, iceCandidate])

    useEffect(() => {
        if (webcamStream) {
            try {
                document.getElementById('local_video').srcObject = webcamStream;
            } catch(err) {
                handleGetMediaError(err);
            }
        }
        // To ignore peerConnection
        // eslint-disable-next-line
    }, [webcamStream])

    useEffect(() => {
        if (targetUserId) {
            setPeerConnection(
                new RTCPeerConnection({
                    iceServers: [
                        {
                            urls: 'stun:stun.stunprotocol.org'
                        }
                    ]
                })
            );
        }
    }, [targetUserId])


    const setupWebcam = async() => {
        await navigator.mediaDevices.getUserMedia(mediaConstraints).then((value) => {
            setWebcamStream(value);
        });
    }

    const handleICECandidateEvent = (e) => {
        if (e.candidate) {
            console.log("*** Outgoing ICE candidate: " + e.candidate.candidate);

            connection.send(JSON.stringify({
                type: 'new-ice-candidate',
                target: targetUserId,
                candidate: e.candidate
            }));
        }
    }

    const handleNewICECandidateMsg = (msg) => {
        setIceCandidate(msg.candidate);
    }

    const handleICEConnectionStateChangeEvent = (e) => {
        if (peerConnection) {
            console.log("*** ICE connection state changed to " + peerConnection.iceConnectionState);

            switch(peerConnection.iceConnectionState) {
            case "closed":
            case "failed":
            case "disconnected":
                closeVideoCall();
                break;
            default:
                break;
            }
        }
    }

    const handleICEGatheringStateChangeEvent = (e) => {
        if (peerConnection) {
            console.log("*** ICE gathering state changed to: ", peerConnection.iceGatheringState);
        }
    }

    const handleNegotiationNeededEvent = async () => {
        if (isCaller && !isBusy) {
            setIsBusy(true);
            console.log("*** Negotiation needed");

            try {
                console.log("---> Creating offer")
                const offer = await peerConnection.createOffer();

                if (peerConnection.signalingState !== "stable") {
                    console.log("   -- The connection isn't stable yet; postponing...")
                    return;
                }

                console.log("---> Setting local description to the offer");
                await peerConnection.setLocalDescription(offer);

                console.log("---> Sending the offer to the remote peer");
                connection.send(JSON.stringify({
                    type: 'video-offer',
                    id: userId.state,
                    target: targetUserId,
                    sdp: peerConnection.localDescription
                }));
            } catch(err) {
                console.log("*** The following error occurred while handling the negotiationneeded event: ");
                console.log(err);
            }
        }
    }

    const handleSignalingStateChangeEvent = () => {
        if (peerConnection) {
            setIsBusy(peerConnection.signalingState !== "stable");

            console.log("*** WebRTC signaling state changed to: ", peerConnection.signalingState);
            switch (peerConnection.signalingState) {
                case 'closed':
                    closeVideoCall();
                    break;
                default:
                    break;
            }
        }
    }

    const handleTrackEvent = (e) => {
        console.log("*** Track event");
        document.getElementById("received_video").srcObject = e.streams[0];
    }

    const handleCalleePeerConnection = async () => {
        if (receivedSDP && peerConnection) {
            var desc = new RTCSessionDescription(receivedSDP);

            if (peerConnection.signalingState !== "stable") {
                console.log("   - But the signaling state isn't stable, so triggering rollback");

                await Promise.all([
                    peerConnection.setLocalDescription({type: "rollback"}),
                    peerConnection.setRemoteDescription(desc)
                ])
                return;
            } else {
                console.log("   - Setting remote description");
                await peerConnection.setRemoteDescription(desc);
            }

            console.log("---> Creating and sending answer to caller");
            await peerConnection.setLocalDescription(await peerConnection.createAnswer());

            connection.send(JSON.stringify({
                type: 'video-answer',
                id: userId.state,
                target: targetUserId,
                sdp: peerConnection.localDescription
            }));
        }
    }

    const acceptCall = async() => {
        if (receivedSDP && peerConnection) {
            var desc = new RTCSessionDescription(receivedSDP);
            await peerConnection.setRemoteDescription(desc).catch((err) => {
                console.log(err);
            })
        }
    }

    const handleVideoOfferMsg = async (msg) => {
        console.log("Received video chat offer from " + msg.id);
        if (!peerConnection && !targetUserId) {
            setReceivedSDP(msg.sdp);    // handled in peerConnection's useEffect
            setTargetUserId(msg.id);        // will trigger setPeerConnection
        } else {
            handleCalleePeerConnection();
        }
    }

    const handleVideoAnswerMsg = async (msg) => {
        console.log("*** Call recipient has accepted our call");
        setReceivedSDP(msg.sdp);        // triggers useEffect
    }


    const handleGetMediaError = (err) => {
        alert("Webcam or audio sources is not found or permission is not granted, please try again.");
    }


    const handleQueue = (e) => {
        setLoggedIn(true);
        setupWebcam().then(() => {
            setConnection(new WebSocket(`ws://localhost:3000/websockets?id=${userId.state}`));
        })
        .catch((error) => {
            handleGetMediaError(error)
        });        
    }

    const closeVideoCall = () => {

    }

    return (
        <>
            <div className='call-nav' />
            <div className='main-section'>
                <div className='call-header'>
                    <Button name='search-nearby' variant='secondary' className='form-button' onClick={handleQueue}>Talk with a nearby user!</Button>
                </div>
                <div className='call-main'>
                    <div className='frame-received'>
                        <video className='video-received' id='received_video' autoPlay />
                    </div>
                    <div>
                        <div className='frame-local'>
                            <video className='video-local' id='local_video' autoPlay muted />
                        </div>
                    </div>
                </div>
                
                    {/* <div className='chat-box'>
                        {!loggedIn && 
                            <div className='home-right'>
                                <div>
                                    <h3><span className='title'>Talkie</span>, a free-to-use messaging and video call application, we have NO ACCESS to your <span className='description'>messages</span> or <span className='description'>video stream data</span>, so your conversations will be kept to just you and people you meet!</h3>
                                    <h3>Sign up now and start meeting people!</h3>
                                </div>
                                <p>Application created by Roy Chan & Ethan Chen</p>
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
                    </div> */}
            </div>
        </>
    );
}

export default HomePage;