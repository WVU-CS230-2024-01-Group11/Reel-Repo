// Temporary homepage, shows how to navigate via useNavigate
// Needed to get to search as of right now

import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Temp Homepage</h1>
            <button onClick={()=>navigate('/search')}>Search</button>
            <button onClick={()=>navigate('/stats')}>Stats</button>
            <button onClick={()=>navigate('/account-creation')}>Account Creation</button>
            <button onClick={()=>navigate('/account-login')}>Account Login</button>
        </div>
    );
}

export default Home;