// SignInPopup.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

SignInPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default function SignInPopup({ open, handleClose, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:5000/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        alert('Sign in successful');

        // Fetch the TMDB request token
        const tokenResponse = await fetch('http://localhost:5000/request-token');
        const tokenData = await tokenResponse.json();

        // Redirect user to TMDB for authentication
        window.location.href = `http://localhost:5000/authenticate/${tokenData.request_token}`;

        handleClose();
        setUser(true); // Update user state
      } else {
        const result = await response.json();
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="sign-in-modal-title"
      aria-describedby="sign-in-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="sign-in-modal-title" variant="h6" component="h2">
          Sign In
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSignIn}
        >
          Sign In
        </Button>
      </Box>
    </Modal>
  );
}