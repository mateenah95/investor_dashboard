import React, { useState } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import {Landmark} from 'lucide-react';
import constants from '../constants';
import { toast } from 'react-toastify';


function Login() {
    const {user, setUser} = React.useContext(UserContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        try {
            const resp = await axios.post(`${constants.API_URL}/auth`, { email, password });
            setUser({...resp.data.user, token: resp.data.token});
            toast.success('Login Successfull!');
            navigate('/portfolio');
        } catch (err) {
            if (err.response) {
                toast.error('Login error:', err.response.data.error);
                setError(`Login failed! ${err.response.data.error}.`);
                return;
            }
            setError(`Login error: ${err}`);
            toast.error('Login error. Please see console logs for error info.')
            return;
        }
    };

    React.useEffect(() => {
        if (user) {
            navigate('/portfolio');
        }
    }, [user])

    return (
        <div className='card p-5' style={{ width: '400px'}}>
            <Landmark className='text-center mx-auto' size={50}/>
            <br />
            <h2 className='text-center'>Investor Dashboard</h2>
            <hr />
            <h4 className='text-center'>Login</h4>
            <br />
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label className='form-label'>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className='form-control'
                    />
                </div>
                <br />
                <div className='form-group'>
                    <label className='form-label'>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='form-control'
                    />
                </div>
                <br />
                {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
                <button type="submit" className='btn btn-dark w-100'>Login</button>
            </form>
        </div>
    );
}

export default Login;