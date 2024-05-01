import React, { useState, useEffect, useCallback } from 'react';
import { fetchParticlesMode, fetchThemeMode, sendFriendRequest, acceptFriendRequest, declineFriendRequest, checkFriendship, getReceivedFriendRequests, getCurrentFriends, removeFriend, getSentFriendRequests, fetchUsernames } from '../../services/database';
import { useUsername } from '../Contexts/UsernameContext';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar'
import styles from './/Friends.css'
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";


const FriendsDemo = (props) => {
    const { username, setUsername } = useUsername();
    const [targetUser, setTargetUser] = useState('');
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [currentFriends, setCurrentFriends] = useState([]);
    const [isFriends, setIsFriends] = useState(null);
    const [usernames, setUsernames] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const received = await getReceivedFriendRequests(username);
            const sent = await getSentFriendRequests(username);
            const friends = await getCurrentFriends(username);
            setReceivedRequests(received);
            setSentRequests(sent);
            setCurrentFriends(friends);
            const users = await fetchUsernames();
            setUsernames(users.filter(user => user.username !== username));
        };

        fetchData();
    }, [username]);

    const handleSendRequest = async (targetUser) => {
        await sendFriendRequest(username, targetUser);
        alert('Friend request sent!');
    };

    const handleAcceptRequest = async (requester) => {
        await acceptFriendRequest(requester, username);
        alert('Friend request accepted!');
    };

    const handleDeclineRequest = async (requester) => {
        await declineFriendRequest(requester, username);
        alert('Friend request declined!');
    };

    const handleCheckFriendship = async () => {
        const status = await checkFriendship(username, targetUser);
        setIsFriends(status);
    };

    const handleRemoveFriend = async (friend) => {
        await removeFriend(username, friend);
        alert('Friend removed!');
    };

    const [particlesMode, setParticlesMode] = useState();
    const [themeMode, setThemeMode] = useState();
    const [particlesColor, setParticlesColor] = useState();
    const [cardColor, setCardColor] = useState();

    useEffect(() => {
        fetchUserSettings();
      }, [username]);
      const fetchUserSettings = async () => {
        const fetchedParticlesMode = await fetchParticlesMode(username);
        const fetchedThemeMode = await fetchThemeMode(username);
        setParticlesMode(fetchedParticlesMode.particles_mode);
        setThemeMode(fetchedThemeMode.theme_mode);
        setParticlesColor('light' === fetchedThemeMode.theme_mode ? props.primary : props.secondary);
        setCardColor('light' === fetchedThemeMode.theme_mode ? props.secondary : props.accent2);
        const element = document.body;
        element.dataset.bsTheme = fetchedThemeMode.theme_mode;
      }
  
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
}, []);

const particlesLoaded = useCallback(async container => {
    await console.log(container);
}, []);

    return (
        <>
         <NavigationBar />
        <div className='content'>
        <h1>Friends</h1>
            <Row className="mb-3">
                <Col>
                    <Form.Control style={{opacity: "0.95"}} type="text" placeholder="Search For User" value={targetUser} onChange={(e) => setTargetUser(e.target.value)} />
                    {targetUser && (
                            <div className="search-overlay" >
                                <ul>
                                    {usernames.filter(user => user.username.toLowerCase().includes(targetUser.toLowerCase())).map(filteredUser => (
                                        <li key={filteredUser.username} className="user-item">
                                            <span>{filteredUser.username}</span>
                                            <Button variant="primary" size="sm" className="send-request-btn" onClick={() => handleSendRequest(filteredUser.username)}>Send Friend Request</Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                </Col>
                <Col className="d-flex align-items-end">
                
                    <Button className="mr-2 button-hover" style={{opacity: "0.97", outline: "none", whiteSpace: "nowrap"}} onClick={handleCheckFriendship}>Check Friendship</Button>
                    {isFriends !== null && (
                        <div style={{margin: "10px", whiteSpace: "nowrap"}}>
                            {isFriends.isFriends ? 'You are friends' : 'You are not friends'}
                        </div>
                    )}
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Card style={{opacity: "0.97", backgroundColor: cardColor, outline: "none"}}>
                        <Card.Body>
                            <Card.Title style={{whiteSpace: "nowrap"}}>Received Friend Requests</Card.Title>
                            <ul>
                                {receivedRequests.map(request => (
                                    <li key={request.requester} >
                                        {request.requester}
                                        <Button variant="success" onClick={() => handleAcceptRequest(request.requester)}>Accept</Button>
                                        <Button variant="danger" onClick={() => handleDeclineRequest(request.requester)}>Decline</Button>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card style={{opacity: "0.97", backgroundColor: cardColor, outline: "none"}}>
                        <Card.Body>
                            <Card.Title style={{whiteSpace: "nowrap"}}>Sent Friend Requests</Card.Title>
                            <ul>
                                {sentRequests.map(request => (
                                    <li style={{marginTop: "10px", marginBottom: "10px"}} key={request.receiver}>{request.receiver}</li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card style={{opacity: "0.97", backgroundColor: cardColor, outline: "none"}}>
                        <Card.Body>
                            <Card.Title>Current Friends</Card.Title>
                            <ul>
                                {currentFriends.map(friend => (
                                    <li key={friend.friend} className="mb-2">
                                        <div style={{display: "inline-block", margin: "10px"}}>{friend.friend}</div>
                                        <Button variant="danger" size="sm" className="ml-2" onClick={() => handleRemoveFriend(friend.friend)}>Remove Friend</Button>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
        <Particles style={{display: particlesMode === 1 ? "" : "none"}}
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fullScreen: {
                    enable: true,
                    zIndex: -1
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                            mode: "push",
                        },
                        onHover: {
                            enable: false,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: particlesColor,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 8,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 4000,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 1,
                    },
                    shape: {
                        type: "square",
                    },
                    size: {
                        value: { min: 10, max: 20 },
                    },
                },
                detectRetina: true,
            }}
          />
        </>
    );
};

export default FriendsDemo;
