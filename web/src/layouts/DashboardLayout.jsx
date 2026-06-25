import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';

export default function DashboardLayout({ children }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6fb' }}>
            <AppBar position="static" color="primary" elevation={1}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ gap: 2, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                            Connoisseur Fashions
                        </Typography>
                        <Button component={Link} to="/dashboard" color="inherit">
                            Dashboard
                        </Button>
                        <Button component={Link} to="/styles" color="inherit">
                            Styles
                        </Button>
                        <Button component={Link} to="/bundles" color="inherit">
                            Bundles
                        </Button>
                        <Button component={Link} to="/stock" color="inherit">
                            Stock
                        </Button>
                        <Button component={Link} to="/history" color="inherit">
                            History
                        </Button>
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography sx={{ mr: 2 }}>{user?.name}</Typography>
                        <Button variant="outlined" color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {children}
            </Container>
        </Box>
    );
}
