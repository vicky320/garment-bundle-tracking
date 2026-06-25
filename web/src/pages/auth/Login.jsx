import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { login as loginRequest } from '../../services/auth.service.js';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
    Alert,
} from '@mui/material';

export default function Login() {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            const result = await loginRequest({ email, password });
            login({ user: result.user, token: result.token });
            navigate('/dashboard');
        } catch (err) {
            setError(err?.response?.data?.message || 'Invalid credentials or server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 12 }}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Connoisseur Fashions Login
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Login using seeded manager or operator credentials.
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            margin="normal"
                            autoComplete="email"
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            margin="normal"
                            autoComplete="current-password"
                        />
                        <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
                            {loading ? 'Logging in…' : 'Login'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}
