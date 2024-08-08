import { Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from "@mui/material/styles";
import PropTypes from 'prop-types';

import { useContext } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SessionComponent from "./components/session";
import AuthContext from "./components/AuthContext";
import AccountPage from "./pages/AccountPage";

const theme = createTheme({
  palette: {
    primary: {main: '#1976d2',},
    secondary: {main: '#e91e63',},},
});

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/authenticate/:requestToken" element={<SessionComponent />} />
          <Route path="/account" element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          } />
        </Routes>
    </ThemeProvider>
  );
}
