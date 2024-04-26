import React, { useState, useEffect } from 'react';
import { sendFriendRequest, acceptFriendRequest, declineFriendRequest, checkFriendship, getReceivedFriendRequests, getCurrentFriends, removeFriend, getSentFriendRequests, fetchUsernames } from '../../services/database';
import { useUsername } from '../Contexts/UsernameContext';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar'
import styles from './/Friends.css'


const FriendsDemo = () => {
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
