import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStyles } from '../../services/style.service.js';
import { createBundle } from '../../services/bundle.service.js';
import {
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    TextField,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';

export default function CreateBundle() {
    const [bundleCode, setBundleCode] = useState('');
    const [styleId, setStyleId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [styles, setStyles] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadStyles() {
            try {
                const data = await fetchStyles();
                setStyles(data);
                setStyleId(data?.[0]?._id || '');
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load styles');
            } finally {
                setLoading(false);
            }
        }

        loadStyles();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!bundleCode || quantity < 1 || !styleId) {
            setError('Bundle ID, style, and positive quantity are required.');
            return;
        }

        setSubmitting(true);
        try {
            await createBundle({ bundleCode, style: styleId, quantity });
            setMessage(`Bundle ${bundleCode} created.`);
            setBundleCode('');
            setQuantity(1);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create bundle');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Create new bundle</Typography>
                <Button variant="outlined" onClick={() => navigate('/bundles')}>
                    Back to bundles
                </Button>
            </Box>
            <Card>
                <CardContent>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'grid', gap: 2 }}>
                            <TextField
                                label="Bundle ID"
                                value={bundleCode}
                                onChange={(event) => setBundleCode(event.target.value)}
                                fullWidth
                            />
                            <TextField
                                select
                                label="Style"
                                value={styleId}
                                onChange={(event) => setStyleId(event.target.value)}
                                fullWidth
                            >
                                {styles.map((style) => (
                                    <MenuItem key={style._id} value={style._id}>
                                        {style.sku} — {style.styleName}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Quantity"
                                type="number"
                                value={quantity}
                                onChange={(event) => setQuantity(Number(event.target.value))}
                                fullWidth
                            />
                            <Button type="submit" variant="contained" disabled={submitting}>
                                {submitting ? 'Creating…' : 'Create bundle'}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
