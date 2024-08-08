import { useContext, useState } from 'react';
import { AppBar, Container, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import SignInPopup from './SignIn';
import LoginIcon from '@mui/icons-material/Login';
import AuthContext from './AuthContext';

NavText.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isMain: PropTypes.bool,
};

function NavText({ href, text, isMain = false}) {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
}

export default function NavBar() {
  const { user, login, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position='static'>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <NavText href='/' text='Home' isMain />
          <NavText href='/about' text='About' />
          {user ? (
            <div style={{ marginLeft: 'auto' }}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar />
              </IconButton>
              <Menu
                id="primary-search-account-menu"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  component={NavLink}
                  to="/account"
                  onClick={handleMenuClose}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose; logout(); }}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <IconButton
              onClick={handleOpen}
              style={{ marginLeft: 'auto' }}
              color='inherit'
              edge="end"
              aria-label="sign-in"
            >
              <LoginIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>
      <SignInPopup open={open} handleClose={handleClose} setUser={login} />
    </AppBar>
  );
}

