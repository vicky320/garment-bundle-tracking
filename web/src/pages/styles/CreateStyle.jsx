import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStyle } from '../../services/style.service.js';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Alert,
} from '@mui/material';

export default function CreateStyle() {
    const [sku, setSku] = useState('');
    const [styleName, setStyleName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!sku || !styleName) {
            setError('SKU and style name are required.');
            return;
        }

        setLoading(true);
        try {
            await createStyle({ sku, styleName, description });
            setMessage(`Created style ${sku} successfully.`);
            setSku('');
            setStyleName('');
            setDescription('');
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create style');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Create new style</Typography>
                <Button variant="outlined" onClick={() => navigate('/styles')}>
                    Back to styles
                </Button>
            </Box>
            <Card>
                <CardContent>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
                        <TextField
                            label="SKU"
                            value={sku}
                            onChange={(event) => setSku(event.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Style Name"
                            value={styleName}
                            onChange={(event) => setStyleName(event.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Saving…' : 'Save style'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
