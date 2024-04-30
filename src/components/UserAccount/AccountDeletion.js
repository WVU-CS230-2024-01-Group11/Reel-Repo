import React, { useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { deleteAccount } from '../../services/database';
import NavigationBar from '../NavigationBar/NavigationBar';
import { useNavigate } from 'react-router-dom';
import { useUsername } from '../Contexts/UsernameContext';

/**
 * AccountDeletion Component
 *
 * A React component for deleting a user's account. Provides UI elements for deleting the account,
 * including a confirmation modal. It also handles the account deletion logic and navigates to the homepage upon successful deletion.
 *
 * @returns {JSX.Element} - The JSX structure of the AccountDeletion component.
 */
const AccountDeletion = () => {
    // State variable to control the visibility of the modal
    const [showModal, setShowModal] = useState(false);
    // Username context variables for accessing and updating the current user's username
    const { username, setUsername } = useUsername();
    const navigate = useNavigate();

    /**
     * handleDelete Function
     *
     * Handles the deletion of the user's account by calling the `deleteAccount` function,
     * then clearing the username context and navigating to the homepage.
     *
     * @returns {void}
     */
    const handleDelete = async () => {
        
        setShowModal(false); // Close the modal
        try {
            const response = await deleteAccount(username);
            alert(response); // Show success message
            setUsername(''); // Clear the username context
            navigate('/'); // Redirect to the homepage
        } catch (error) {
            alert('Failed to delete account. Please try again later.');
        }
    };

    return (
        <>
        <NavigationBar/>
        <div className='content'>
            <h1>User Settings</h1>
            <h2>Hello {username}!</h2>
            <Button variant="danger" onClick={() => setShowModal(true)}>
                Delete Account
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your account? This action cannot be undone.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>
        </>
    );
};

export default AccountDeletion;