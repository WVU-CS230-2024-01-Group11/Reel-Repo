import React from 'react'
import NavigationBar from '../NavigationBar/NavigationBar'
import { useState } from 'react'
import  { useUsername } from '../Contexts/UsernameContext'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css';
import avatar1 from './Avatars/row-1-column-1.jpg';
import avatar2 from './Avatars/row-1-column-2.jpg';
import avatar3 from './Avatars/row-1-column-3.jpg';
import avatar4 from './Avatars/row-1-column-4.jpg';
import avatar5 from './Avatars/row-2-column-1.jpg';
import avatar6 from './Avatars/row-2-column-2.jpg';
import avatar7 from './Avatars/row-2-column-3.jpg';
import avatar8 from './Avatars/row-2-column-4.jpg';
import avatar9 from './Avatars/row-3-column-1.jpg';
import avatar10 from './Avatars/row-3-column-2.jpg';
import avatar11 from './Avatars/row-3-column-3.jpg';
import avatar12 from './Avatars/row-3-column-4.jpg';
import defaultAvatar from './Avatars/blank-profile-picture-973460_1280.jpg'

export default function Profile() {
  const { username, setUsername } = useUsername();
  //Should be like useState(retrieveAvatar(username))
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);

  const handleAvatarSelect = (avatarNum) => {
    console.log('Selected avatar:', avatarNum);
    setSelectedAvatar(avatarNum);

  };
  return (
    <>
    <NavigationBar />
    <div style={{ paddingTop: '200px' }}>
      <div>
       <img src={selectedAvatar} alt="Selected Avatar" style={{ width: '300px', height: '300px' }} />
      </div>
      <Popup trigger={<button>Choose Avatar</button>} modal nested>
        <button onClick={() => handleAvatarSelect(avatar1)}>
          <img src={avatar1} alt="Avatar 1" style={{ width: '100px', height: '100px' }} />
        </button>
        <button onClick={() => handleAvatarSelect(avatar2)}>
          <img src={avatar2} alt="Avatar 2" style={{ width: '100px', height: '100px' }} />
        </button>
        <button onClick={() => handleAvatarSelect(avatar3)}>
          <img src={avatar3} alt="Avatar 3" style={{ width: '100px', height: '100px' }} />
        </button>
        <button onClick={() => handleAvatarSelect(avatar4)}>
          <img src={avatar4} alt="Avatar 4" style={{ width: '100px', height: '100px' }} />
        </button>
        <button onClick={() => handleAvatarSelect(avatar5)}>
          <img src={avatar5} alt="Avatar 5" style={{ width: '100px', height: '100px' }} />
        </button>
        <button onClick={() => handleAvatarSelect(avatar6)}>
          <img src={avatar6} alt="Avatar 6" style={{ width: '100px', height: '100px' }} />
        </button>
        <button onClick={() => handleAvatarSelect(avatar7)}>
          <img src={avatar7} alt="Avatar 7" style={{ width: '100px', height: '100px' }} />
        </button>
        <button onClick={() => handleAvatarSelect(avatar8)}>
          <img src={avatar8} alt="Avatar 8" style={{ width: '100px', height: '100px' }} />
        </button>
        <button onClick={() => handleAvatarSelect(avatar9)}>
          <img src={avatar8} alt="Avatar 9" style={{ width: '100px', height: '100px' }} />
        </button>
        <button onClick={() => handleAvatarSelect(avatar10)}>
          <img src={avatar10} alt="Avatar 8" style={{ width: '100px', height: '100px' }} />
        </button>
        <button onClick={() => handleAvatarSelect(avatar11)}>
          <img src={avatar11} alt="Avatar 8" style={{ width: '100px', height: '100px' }} />
        </button>
        <button onClick={() => handleAvatarSelect(avatar12)}>
          <img src={avatar12} alt="Avatar 8" style={{ width: '100px', height: '100px' }} />
        </button>
      </Popup>
    </div>
    </>
  )
}
