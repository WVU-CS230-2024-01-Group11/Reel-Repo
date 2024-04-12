import React, { useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { deleteAccount } from '../../services/database';
import NavigationBar from '../NavigationBar/NavigationBar';
import { UsernameContext } from '../Contexts/UsernameContext';
const AccountDeletion = () => {
    const [showModal, setShowModal] = useState(false);
    const {username,setUsername}=useContext(UsernameContext);
    const handleDelete = async () => {
        setShowModal(false); // Close the modal
        try {
            const response = await deleteAccount(username);
            alert(response); // Show success message
            // Implement what should happen after account is deleted (e.g., redirect)
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