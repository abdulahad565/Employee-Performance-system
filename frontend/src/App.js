// frontend/src/App.js
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import Signup from './components/Signup';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  AccountCircle,
  AdminPanelSettings,
  ExitToApp
} from '@mui/icons-material';
import { AuthProvider, useAuth } from './context/AuthContext';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import ReviewList from './components/ReviewList';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  return (
    <Router>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Employee Performance System
          </Typography>

          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/employees">
            Employees
          </Button>
          <Button color="inherit" component={Link} to="/reviews">
            Reviews
          </Button>

          {isAuthenticated && isAdmin() && (
            <Button
              color="inherit"
              component={Link}
              to="/admin"
              startIcon={<AdminPanelSettings />}
            >
              Admin
            </Button>
          )}

          {isAuthenticated ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
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
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Typography variant="body2">
                    Welcome, {user?.username}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              color="inherit"
              onClick={() => setLoginOpen(true)}
              startIcon={<AccountCircle />}
            >
              Admin Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
          <Route path="/employees/:id" element={<ProtectedRoute><EmployeeDetail /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><ReviewList /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        </Routes>
      </Container>

      <Login
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
