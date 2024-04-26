import React from 'react'
import NavigationBar from '../NavigationBar/NavigationBar'
import { useState, useEffect } from 'react'
import  { useUsername } from '../Contexts/UsernameContext'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css';
import avatar1 from '../Avatars/row-1-column-1.jpg';
import avatar2 from '../Avatars/row-1-column-2.jpg';
import avatar3 from '../Avatars/row-1-column-3.jpg';
import avatar4 from '../Avatars/row-1-column-4.jpg';
import avatar5 from '../Avatars/row-2-column-1.jpg';
import avatar6 from '../Avatars/row-2-column-2.jpg';
import avatar7 from '../Avatars/row-2-column-3.jpg';
import avatar8 from '../Avatars/row-2-column-4.jpg';
import avatar9 from '../Avatars/row-3-column-1.jpg';
import avatar10 from '../Avatars/row-3-column-2.jpg';
import avatar11 from '../Avatars/row-3-column-3.jpg';
import avatar12 from '../Avatars/row-3-column-4.jpg';
import defaultAvatar from '../Avatars/blank-profile-picture-973460_1280.jpg'
import { updateCharacterIcon, fetchCharacterIcon } from '../../services/database'

export default function Profile() {
  const { username, setUsername } = useUsername();
  //Should be like useState(retrieveAvatar(username))
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);
  const [currentAvatar, setCurrentAvatar] = useState();

  const avatarMap = {
    defaultAvatar: defaultAvatar,
    avatar1: avatar1,
    avatar2: avatar2,
    avatar3: avatar3,
    avatar4: avatar4,
    avatar5: avatar5,
    avatar6: avatar6,
    avatar7: avatar7,
    avatar8: avatar8,
    avatar9: avatar9,
    avatar10: avatar10,
    avatar11: avatar11,
    avatar12: avatar12
  };
  
  useEffect(() => {
    const loadCharacterIcon = async () => {
        const result = await fetchCharacterIcon(username);
        setCurrentAvatar(avatarMap[result[0].character_icon] || defaultAvatar);
        
    };
  
    if (username) {
        loadCharacterIcon();
    }
  }, [username]);
  
  const handleAvatarSelect = (key) => {
    console.log('Selected avatar:', key);
    setSelectedAvatar(avatarMap[key]);
};
const handleSelection = () => {
  if (selectedAvatar) {
      const avatarKey = Object.keys(avatarMap).find(key => avatarMap[key] === selectedAvatar);
      if (avatarKey) {
          updateCharacterIcon(username, avatarKey).catch(console.error);
          handleConfirmAvatar();
      }
  }
}
const handleConfirmAvatar = async () => {
  try {
      // Assume updateCharacterIcon sends the selected avatar key and updates the database
      await updateCharacterIcon(username, Object.keys(avatarMap).find(key => avatarMap[key] === selectedAvatar));
      setCurrentAvatar(selectedAvatar);  // Update the avatar shown on the profile
  } catch (error) {
      console.error('Error updating avatar:', error);
  }
};
  return (
    <>
    <NavigationBar />
    <div style={{ paddingTop: '200px' }}>
      <div> Current:
        <img src={currentAvatar || defaultAvatar} alt="Current Avatar" style={{ width: '300px', height: '300px' }} />
      </div>
      <div>
        Selected: <img src={selectedAvatar || defaultAvatar} alt="Selected Avatar" style={{ width: '300px', height: '300px' }} />
      </div>
      <Popup trigger={<button>Choose Avatar</button>} modal nested>
        {Object.entries(avatarMap).map(([key, image]) => (
          <button key={key} onClick={() => handleAvatarSelect(key)}>
            <img src={image} alt={`Avatar ${key}`} style={{ width: '100px', height: '100px' }} />
          </button>
        ))}
        <button onClick={handleSelection}>Confirm Selection</button>
      </Popup>
    </div>
    </>
  )
}
