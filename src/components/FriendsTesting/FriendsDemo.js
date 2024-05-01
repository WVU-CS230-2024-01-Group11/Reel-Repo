import React, { useState, useEffect, useCallback } from 'react';
import { fetchParticlesMode, fetchThemeMode, sendFriendRequest, acceptFriendRequest, declineFriendRequest, checkFriendship, getReceivedFriendRequests, getCurrentFriends, removeFriend, getSentFriendRequests, fetchUsernames } from '../../services/database';
import { useUsername } from '../Contexts/UsernameContext';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar'
import { useNavigate } from 'react-router-dom';
import styles from './/Friends.css'
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";


const FriendsDemo = () => {
    const { username, setUsername } = useUsername();
    const [targetUser, setTargetUser] = useState('');
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [currentFriends, setCurrentFriends] = useState([]);
    const [isFriends, setIsFriends] = useState(null);
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
        <div className="container">
         <NavigationBar />

            <h2>Friends Demo</h2>
        <div style = {{paddingTop: '100px'}}>
            <Row className="mb-3">
                <Col>
                    <Form.Control type="text" placeholder="Search For User" value={targetUser} onChange={(e) => setTargetUser(e.target.value)} />
                    {targetUser && (
                            <div className="search-overlay" >
                                <ul>
                                    {usernames.filter(user => user.username.toLowerCase().includes(targetUser.toLowerCase())).map(filteredUser => (
                                        <li key={filteredUser.username} onClick={() => navigate(`/profile/${filteredUser.username}`)} className="user-item">
                                            <span >{filteredUser.username}</span>
                                            <Button variant="primary" size="sm" className="send-request-btn" onClick={() => handleSendRequest(filteredUser.username)}>Send Friend Request</Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                </Col>
                <Col className="d-flex align-items-end">
                
                    <Button className="mr-2" onClick={handleCheckFriendship}>Check Friendship</Button>
                    {isFriends !== null && (
                        <div>
                            {isFriends.isFriends ? 'You are friends' : 'You are not friends'}
                        </div>
                    )}
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Received Friend Requests</Card.Title>
                            <ul>
                                {receivedRequests.map(request => (
                                    <li key={request.requester}>
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
                    <Card>
                        <Card.Body>
                            <Card.Title>Sent Friend Requests</Card.Title>
                            <ul>
                                {sentRequests.map(request => (
                                    <li key={request.receiver}>{request.receiver}</li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Current Friends</Card.Title>
                            <ul>
                                {currentFriends.map(friend => (
                                    <li key={friend.friend} className="mb-2">
                                        <span>{friend.friend}</span>
                                        <Button variant="danger" size="sm" className="ml-2" onClick={() => handleRemoveFriend(friend.friend)}>Remove Friend</Button>
                                    </li>
                                ))}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
        </div>
    );
};

export default FriendsDemo;
