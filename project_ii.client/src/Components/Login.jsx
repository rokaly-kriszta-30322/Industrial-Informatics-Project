/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminMenuComponent from './Admin_Menu';
import HomePage from './HomePage';
import { useNavigate } from 'react-router-dom';

const LoginComponent = ({ onLogin, setLoginError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const encodedEmail = encodeURIComponent(email);
            const response = await axios.get(`https://localhost:7209/Fitness_App/GetUserByEmail/${encodedEmail}`);

            const user = response.data;


            if (user.password === password) {
                onLogin(user);
            } else {
                setLoginError('Invalid email or password');

            }

        } catch (err) {
            setLoginError('Invalid email or password');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

const AuthenticationComponent = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const encodedEmail = encodeURIComponent(email);
            const checkEmail = await axios.get(`https://localhost:7209/Fitness_App/GetUserByEmailAuth/${encodedEmail}`);

            if (checkEmail.data) {
                setError('Email already exists');
                return;
            }

            const response = await axios.post('https://localhost:7209/Fitness_App/AddUser', {
                user_name: name,
                email,
                password,
                role: 'user'
            });

            if (response.data) {
                const user = response.data;

                onLogin(user);
            } else {
                setError('Error creating account');
            }
        } catch (err) {
            setError('Error creating account. Please try again.');
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};


const UserComponent = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [showLogin, setShowLogin] = useState(true);
    const [loginError, setLoginError] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const navigate = useNavigate();

    const handleLogin = (user) => {
        setCurrentUser({
            userId: user.user_id,
            userName: user.user_name,
            role: user.role,
            email: user.email
        });

        sessionStorage.setItem('userId', user.user_id);

        if (user.role === 'admin') {
            navigate('/admin_menu');
        } else {
            navigate('/home');
        }
    };

    useEffect(() => {

        axios.get('https://localhost:7209/Fitness_App/GetAllUsers')
            .then(response => {
                setAllUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    return (
        <div>
            {currentUser ? (
                <div>
                    <h2>Welcome, {currentUser.userName}!</h2>
                    
                </div>
            ) : (
                <div>
                    {showLogin ? (
                        <LoginComponent onLogin={handleLogin} setLoginError={setLoginError} />
                    ) : (
                        <AuthenticationComponent onLogin={handleLogin} />
                    )}
                    {loginError && <p className="error">{loginError}</p>}
                    <button onClick={() => setShowLogin(!showLogin)}>
                        {showLogin ? 'Create Account' : 'Back to Login'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserComponent;