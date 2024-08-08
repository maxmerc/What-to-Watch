import { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

export default function SessionComponent() {
  const { requestToken } = useParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const createSession = async () => {
        const response = await fetch('http://localhost:5000/create-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ request_token: requestToken }),
        });
        const data = await response.json();
        if (data.session_id) {
          login(data.session_id);
          navigate('/');
        } else {
          console.error('Failed to create session:', data);
        }
      };     

    if (requestToken) {
      createSession();
    }
  }, [requestToken, navigate, login]);

  return <div>Loading...</div>;
}

