import React, { useState, useEffect } from 'react';
import { sendFriendRequest, acceptFriendRequest, declineFriendRequest, checkFriendship, getReceivedFriendRequests, getCurrentFriends, removeFriend, getSentFriendRequests, fetchUsernames } from '../../services/database';
import { useUsername } from '../Contexts/UsernameContext';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar'
import { useNavigate } from 'react-router-dom';
import styles from './/Friends.css'


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
                
                    
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Received Friend Requests</Card.Title>
                            <ul>
                                {receivedRequests.map(request => (
                                    <li key={request.requester} onClick={() => navigate(`/profile/${request.requester}`)} >
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
                                    <li key={request.receiver} onClick={() => navigate(`/profile/${request.receiver}`)}>{request.receiver}</li>
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
                                        <span onClick={() => navigate(`/profile/${friend.friend}`)}>{friend.friend}</span>
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
