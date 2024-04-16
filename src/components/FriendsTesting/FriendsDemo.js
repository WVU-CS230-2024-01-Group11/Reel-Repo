import React, {useState, useEffect} from 'react';
import { sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    checkFriendship,
    getReceivedFriendRequests,
    getCurrentFriends,
removeFriend, getSentFriendRequests,} from '../../services/database';
import { useUsername } from '../Contexts/UsernameContext';
const FriendsDemo = () => {
    const { username, setUsername } = useUsername();
    const [targetUser, setTargetUser] = useState('');
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [currentFriends, setCurrentFriends] = useState([]);
    const [isFriends, setIsFriends] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const received = await getReceivedFriendRequests(username);
            const sent = await getSentFriendRequests(username);
            const friends = await getCurrentFriends(username);
            setReceivedRequests(received);
            setSentRequests(sent);
            setCurrentFriends(friends);
        };

        fetchData();
    }, [username]);

    const handleSendRequest = async () => {
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
        <div>
            <h2>Friends Demo</h2>
            <input
                type="text"
                placeholder="Enter target username"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
            />
            <button onClick={handleSendRequest}>Send Friend Request</button>
            <button onClick={handleCheckFriendship}>Check Friendship</button>
            {isFriends !== null && (
                <div>
                    {isFriends.isFriends ? 'You are friends' : 'You are not friends'}
                </div>
            )}
            <h3>Received Friend Requests</h3>
            <ul>
                {receivedRequests.map(request => (
                    <li key={request.requester}>
                        {request.requester}
                        <button onClick={() => handleAcceptRequest(request.requester)}>Accept</button>
                        <button onClick={() => handleDeclineRequest(request.requester)}>Decline</button>
                    </li>
                ))}
            </ul>
            <h3>Sent Friend Requests</h3>
            <ul>
                {sentRequests.map(request => (
                    <li key={request.receiver}>{request.receiver}</li>
                ))}
            </ul>
            <h3>Current Friends</h3>
            <ul>
                {currentFriends.map(friend => (
                    <li key={friend.friend}>
                        {friend.friend}
                        <button onClick={() => handleRemoveFriend(friend.friend)}>Remove Friend</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FriendsDemo;
