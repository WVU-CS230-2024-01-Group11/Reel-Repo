import React, { useState, useEffect, useCallback } from 'react';
import { fetchParticlesMode, fetchThemeMode, sendFriendRequest, acceptFriendRequest, declineFriendRequest, getReceivedFriendRequests, getCurrentFriends, removeFriend, getSentFriendRequests, fetchUsernames } from '../../services/database';
import { useUsername } from '../Contexts/UsernameContext';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar'
import { useNavigate } from 'react-router-dom';
import './/Friends.css'
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const FriendsDemo = (props) => {
/**
 * Component for managing friend requests and current friends.
 */
    const { username} = useUsername();
    const [targetUser, setTargetUser] = useState('');
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [currentFriends, setCurrentFriends] = useState([]);
    const [usernames, setUsernames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        /**
         * Fetches necessary data for the component.
         */
        const fetchData = async () => {
            try {
                // Fetch necessary data
                const received = await getReceivedFriendRequests(username);
                const sent = await getSentFriendRequests(username);
                const friends = await getCurrentFriends(username);

                // Set states for fetched data
                setReceivedRequests(received);
                setSentRequests(sent);
                setCurrentFriends(friends);

                // Convert friend list to a Set for fast lookup
                const friendUsernames = new Set(friends.map(friend => friend.friend));

                // Fetch all usernames and filter out current friends
                const users = await fetchUsernames();
                setUsernames(users.filter(user => user.username !== username && !friendUsernames.has(user.username)));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [username]);

    /**
     * Handles sending a friend request to the target user.
     * @param {string} targetUser - The username of the target user.
     */
    const handleSendRequest = async (targetUser) => {
        await sendFriendRequest(username, targetUser);
        alert('Friend request sent!');
    };

    /**
     * Handles accepting a friend request from the requester.
     * @param {string} requester - The username of the requester.
     */
    const handleAcceptRequest = async (requester) => {
        await acceptFriendRequest(requester, username);
        alert('Friend request accepted!');
    };

    /**
     * Handles declining a friend request from the requester.
     * @param {string} requester - The username of the requester.
     */
    const handleDeclineRequest = async (requester) => {
        await declineFriendRequest(requester, username);
        alert('Friend request declined!');
    };

    /**
     * Handles removing a friend from the current friends list.
     * @param {string} friend - The username of the friend to remove.
     */
    const handleRemoveFriend = async (friend) => {
        await removeFriend(username, friend);
        alert('Friend removed!');
    };

    //State variables to keep track of settings
    const [particlesMode, setParticlesMode] = useState();
    const [themeMode, setThemeMode] = useState();
    const [particlesColor, setParticlesColor] = useState();
    const [cardColor, setCardColor] = useState();

    //Fetch user settings when username changes
    useEffect(() => {
        fetchUserSettings();
    }, [username]);

    /**
     * fetchUser Settings Function
     *
     * Fetches all the user's settings and stores them in state variables
     * 
     * @returns {void}
     */
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
  
    /**
     * particlesInit Function
     *
     * Loads particle simulation
     *
     * @returns {void}
     */
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    /**
     * particlesLoaded Function
     *
     * Keeps track of particles currently loaded
     *
     * @returns {void}
     */
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
                    <Form.Control style={{opacity: "0.97" }} type="text" placeholder="Search For User" value={targetUser} onChange={(e) => setTargetUser(e.target.value)} />
                    {targetUser && (
                            <div className="search-overlay" style={{backgroundColor: themeMode === 'dark' ? props.accent1 : "whitesmoke", borderRadius: "15px"}}>
                                <ul>
                                    {usernames.filter(user => user.username.toLowerCase().includes(targetUser.toLowerCase())).map(filteredUser => (
                                        <li key={filteredUser.username} onClick={() => navigate(`/profile/${filteredUser.username}`)} className="user-item">
                                            <span style={{cursor: "pointer"}}>{filteredUser.username}</span>
                                            <Button variant="primary" size="sm" className="send-request-btn" onClick={() => handleSendRequest(filteredUser.username)}>Send Friend Request</Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </Col>
                    <Col className="d-flex align-items-end">

                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Card style={{backgroundColor: cardColor, color: "white"}}>
                            <Card.Body>
                                <Card.Title style={{whiteSpace: "nowrap"}}>Received Friend Requests</Card.Title>
                                <ul>
                                    {receivedRequests.map(request => (
                                        <li style={{marginTop: "10px", marginBottom: "10px", cursor: "pointer", whiteSpace:"nowrap"}} key={request.requester} onClick={() => navigate(`/profile/${request.requester}`)} >
                                            {request.requester}
                                            <Button variant="success" style={{margin: "10px", fontSize: "12pt"}} onClick={() => handleAcceptRequest(request.requester)}>Accept</Button>
                                            <Button variant="danger" style={{fontSize: "12pt"}} onClick={() => handleDeclineRequest(request.requester)}>Decline</Button>
                                        </li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{backgroundColor: cardColor, color: "white"}}>
                            <Card.Body>
                                <Card.Title>Sent Friend Requests</Card.Title>
                                <ul>
                                    {sentRequests.map(request => (
                                        <li style={{marginTop: "10px", marginBottom: "10px", cursor: "pointer"}} key={request.receiver} onClick={() => navigate(`/profile/${request.receiver}`)}>{request.receiver}</li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card style={{backgroundColor: cardColor, color: "white"}}>
                            <Card.Body>
                                <Card.Title>Current Friends</Card.Title>
                                <ul>
                                    {currentFriends.map(friend => (
                                        <li style={{cursor: "pointer"}} key={friend.friend} className="mb-2">
                                            <span onClick={() => navigate(`/profile/${friend.friend}`)} style={{margin: "10px"}}>{friend.friend}</span>
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
