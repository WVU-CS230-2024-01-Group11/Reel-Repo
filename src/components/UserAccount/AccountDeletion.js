import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {deleteAccount, fetchThemeMode, fetchParticlesMode, updateThemeMode, updateParticlesMode, totalMovieWatchTime } from '../../services/database';
import NavigationBar from '../NavigationBar/NavigationBar';
import { useNavigate } from 'react-router-dom';
import { useUsername } from '../Contexts/UsernameContext';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

/**
 * AccountDeletion Component
 *
 * A React component for deleting a user's account. Provides UI elements for deleting the account,
 * including a confirmation modal. It also handles the account deletion logic and navigates to the homepage upon successful deletion.
 *
 * @returns {JSX.Element} - The JSX structure of the AccountDeletion component.
 */
const AccountDeletion = (props) => {
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

    const [particlesMode, setParticlesMode] = useState();
    const [particlesColor, setParticlesColor] = useState();
    const [themeMode, setThemeMode] = useState();
    useEffect(() => {
        fetchUserSettings();
      }, [username]);
    const fetchUserSettings = async () => {
        const fetchedParticlesMode = await fetchParticlesMode(username);
        const fetchedThemeMode = await fetchThemeMode(username);
        setParticlesMode(fetchedParticlesMode.particles_mode);
        setThemeMode(fetchedThemeMode.theme_mode);
        setParticlesColor('light' === fetchedThemeMode.theme_mode ? props.primary : props.secondary);
        const element = document.body;
        element.dataset.bsTheme = fetchedThemeMode.theme_mode;
    }

    const changeThemeMode = () => {
        try {
            const mode = 'light' === themeMode ? 'dark' : 'light';
            setThemeMode(mode);
            updateThemeMode(username, mode);
            const element = document.body;
            element.dataset.bsTheme = mode;
            setParticlesColor('light' === mode ? props.primary : props.secondary);
        } catch (error) {
            alert('Failed to update setting. Please try again later.');
        }
    }

    const changeParticleMode = async () => {
        try {
            const mode = particlesMode ? 0 : 1;
            setParticlesMode(mode);
            updateParticlesMode(username, mode === 1 ? true : false);
            setParticlesColor('light' === themeMode ? props.primary : props.secondary);
        } catch (error) {
            alert('Failed to update setting. Please try again later.');
        }
    }

    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);
    
    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);

    return (
        <>
        <NavigationBar/>
        <div style={{display: "grid", justifyContent: "center", alignContent: "center", margin: "100px", marginTop: "150px"}}>
            <h1>Settings</h1>
            <div className="form-check form-switch mx-4" onClick={changeThemeMode} style={{marginTop: "20px"}}>
                <input type="checkbox" className="form-check-input p-2" id='flexSwitchCheckChecked' checked={'dark' === themeMode ? true : false} readOnly />
                <span style={{margin: "10px", whiteSpace: "nowrap"}}>Dark Mode</span>
            </div>
            <div className="form-check form-switch mx-4" onClick={changeParticleMode} style={{margin: "20px"}}>
                <input type="checkbox" className="form-check-input p-2" id='flexSwitchCheckChecked' checked={particlesMode} readOnly />
                <span style={{margin: "10px", whiteSpace: "nowrap"}}>Particle Effect</span>
            </div>
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

export default AccountDeletion;