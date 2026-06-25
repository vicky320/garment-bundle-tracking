import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    TextField,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
import { getBundleByCode, advanceBundleStage } from '../../services/bundle.service.js';

export default function OperatorScan() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [bundleCode, setBundleCode] = useState('');
    const [bundleDetails, setBundleDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user?.role && user.role !== 'operator') {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleScan = async () => {
        setError('');
        setSuccess('');
        setBundleDetails(null);
        if (!bundleCode.trim()) {
            setError('Enter a valid bundle code.');
            return;
        }

        setLoading(true);
        try {
            const bundle = await getBundleByCode(bundleCode.trim());
            setBundleDetails(bundle);
        } catch (err) {
            if (err?.response?.status === 404) {
                setError('Bundle not found. Verify the code and try again.');
            } else {
                setError(err?.response?.data?.message || 'Unable to load bundle details.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAdvance = async () => {
        if (!bundleDetails) return;
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const updatedBundle = await advanceBundleStage(bundleDetails._id);
            setBundleDetails(updatedBundle);
            setSuccess(`Bundle ${updatedBundle.bundleCode} advanced to ${updatedBundle.currentStage}.`);
        } catch (err) {
            setError(err?.response?.data?.message || 'Unable to advance bundle stage.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Operator Scan
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Welcome, {user?.name}. Use bundle code to advance the stage.
            </Typography>

            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <TextField
                            label="Bundle Code"
                            value={bundleCode}
                            onChange={(event) => setBundleCode(event.target.value)}
                            fullWidth
                            disabled={loading}
                        />

                        <Button
                            variant="contained"
                            onClick={handleScan}
                            disabled={loading || !bundleCode.trim()}
                        >
                            {loading ? 'Looking up…' : 'Scan Bundle'}
                        </Button>

                        {loading && <CircularProgress size={24} />}

                        {bundleDetails && (
                            <Box sx={{ pt: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Bundle Information
                                </Typography>
                                <Typography>Bundle Code: {bundleDetails.bundleCode}</Typography>
                                <Typography>Style: {bundleDetails.style?.styleName || bundleDetails.style?.sku}</Typography>
                                <Typography>Quantity: {bundleDetails.quantity}</Typography>
                                <Typography>Current Stage: {bundleDetails.currentStage}</Typography>
                                <Button
                                    sx={{ mt: 2 }}
                                    variant="contained"
                                    onClick={handleAdvance}
                                    disabled={loading || bundleDetails.currentStage === 'Dispatch' || bundleDetails.currentStage === 'Factory Store'}
                                >
                                    {bundleDetails.currentStage === 'Dispatch'
                                        ? 'Already Dispatched'
                                        : bundleDetails.currentStage === 'Factory Store'
                                            ? 'Dispatch Requires Manager'
                                            : 'Move to Next Stage'}
                                </Button>
                                {bundleDetails.currentStage === 'Factory Store' && (
                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        Operator can advance only up to Factory Store. Dispatch must be completed by a manager.
                                    </Alert>
                                )}
                            </Box>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
