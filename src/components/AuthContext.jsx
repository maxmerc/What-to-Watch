import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    AuthProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };
    const [user, setUser] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [accountId, setAccountId] = useState(null);

    useEffect(() => {
        const session = localStorage.getItem('session_id');
        const account = localStorage.getItem('account_id');
        if (session && account) {
            setUser(true);
            setSessionId(session);
            setAccountId(account);
        }
    }, []);

    const login = (session) => {
        localStorage.setItem('session_id', session);
        setUser(true);
        setSessionId(session);
        if (!accountId) fetchAccountId(session);
    };

    const fetchAccountId = async (session) => {
        const response = await fetch(`http://localhost:5000/account-id?session_id=${session}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            setAccountId(data.id);
            localStorage.setItem('account_id', data.id);
        } else {
            logout();
            console.error('Failed to fetch account details');
        }
    };
    

    const logout = async () => {
        const session = localStorage.getItem('session_id');
        if (session) {
            const response = await fetch('http://localhost:5000/delete-session', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id: session }),
        });
        if (response.ok) {
            setUser(null);
            setSessionId(null);
            setAccountId(null);
            localStorage.removeItem('session_id');
            localStorage.removeItem('account_id');
        } else {
            setUser(null);
            setSessionId(null);
            setAccountId(null);
            localStorage.removeItem('account_id');
            localStorage.removeItem('session_id');
            console.error('Failed to delete session');
        }
        }
    };

    return (
        <AuthContext.Provider value={{ user, sessionId, accountId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
