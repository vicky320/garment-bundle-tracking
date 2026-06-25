import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material';
import { fetchBundles, getBundleByCode, advanceBundleStage } from '../../services/bundle.service.js';
import { fetchStyles } from '../../services/style.service.js';
import { fetchStock } from '../../services/stock.service.js';

const stagingLabels = ['Cutting', 'Stitching', 'Finishing', 'Packing', 'Factory Store', 'Dispatch'];

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [bundles, setBundles] = useState([]);
    const [stockRows, setStockRows] = useState([]);
    const [styles, setStyles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busyBundle, setBusyBundle] = useState(null);
    const [bundleCode, setBundleCode] = useState('');
    const [scanLoading, setScanLoading] = useState(false);
    const [scanMessage, setScanMessage] = useState('');
    const [scanError, setScanError] = useState('');

    useEffect(() => {
        if (user?.role === 'operator') {
            navigate('/operator', { replace: true });
            return;
        }

        async function loadData() {
            try {
                const [bundleData, styleData, stockData] = await Promise.all([
                    fetchBundles(),
                    fetchStyles(),
                    fetchStock(),
                ]);
                setBundles(bundleData);
                setStyles(styleData);
                setStockRows(stockData);
            } catch (err) {
                setError(err?.response?.data?.message || 'Unable to load dashboard data');
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [user, navigate]);

    const counts = stagingLabels.map((stage) => ({
        label: stage,
        value: bundles.filter((bundle) => bundle.currentStage === stage).length,
    }));

    const handleAdvanceBundle = async (bundleId) => {
        setBusyBundle(bundleId);
        try {
            const updatedBundle = await advanceBundleStage(bundleId);
            setBundles((prev) => prev.map((bundle) => (bundle._id === updatedBundle._id ? updatedBundle : bundle)));
        } catch (err) {
            setError(err?.response?.data?.message || 'Unable to dispatch bundle');
        } finally {
            setBusyBundle(null);
        }
    };

    const handleOperatorScan = async () => {
        setScanError('');
        setScanMessage('');
        if (!bundleCode.trim()) {
            setScanError('Enter a bundle code first');
            return;
        }

        setScanLoading(true);
        try {
            const bundle = await getBundleByCode(bundleCode.trim());
            const updatedBundle = await advanceBundleStage(bundle._id);
            setBundles((prev) => prev.map((item) => (item._id === updatedBundle._id ? updatedBundle : item)));
            setScanMessage(`Bundle ${updatedBundle.bundleCode} advanced to ${updatedBundle.currentStage}`);
            setBundleCode('');
        } catch (err) {
            if (err?.response?.status === 404) {
                setScanError('Bundle not found. Please verify the code.');
            } else {
                setScanError(err?.response?.data?.message || 'Failed to advance bundle.');
            }
        } finally {
            setScanLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Welcome back, {user?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Role: {user?.role}
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        {counts.map((card) => (
                            <Grid item xs={12} sm={6} md={3} key={card.label}>
                                <Card>
                                    <CardContent>
                                        <Typography color="text.secondary" gutterBottom>
                                            {card.label}
                                        </Typography>
                                        <Typography variant="h4">{card.value}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3}>
                        {user?.role === 'operator' && (
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Operator Scan
                                        </Typography>
                                        <Stack spacing={2}>
                                            <TextField
                                                label="Bundle Code"
                                                value={bundleCode}
                                                onChange={(event) => setBundleCode(event.target.value)}
                                                fullWidth
                                                disabled={scanLoading}
                                            />
                                            <Button
                                                variant="contained"
                                                onClick={handleOperatorScan}
                                                disabled={scanLoading || !bundleCode.trim()}
                                            >
                                                {scanLoading ? 'Scanning…' : 'Scan and Advance'}
                                            </Button>
                                            {scanMessage && <Alert severity="success">{scanMessage}</Alert>}
                                            {scanError && <Alert severity="error">{scanError}</Alert>}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Work in Progress
                                    </Typography>
                                    <TableContainer component={Paper} elevation={0}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Bundle</TableCell>
                                                    <TableCell>Style</TableCell>
                                                    <TableCell>Stage</TableCell>
                                                    <TableCell align="right">Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {bundles.map((bundle) => (
                                                    <TableRow key={bundle._id}>
                                                        <TableCell>{bundle.bundleCode}</TableCell>
                                                        <TableCell>{bundle.style?.styleName || bundle.style?.sku}</TableCell>
                                                        <TableCell>{bundle.currentStage}</TableCell>
                                                        <TableCell align="right">
                                                            {user?.role === 'manager' && (bundle.currentStage === 'Packing' || bundle.currentStage === 'Factory Store') ? (
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    onClick={() => handleAdvanceBundle(bundle._id)}
                                                                    disabled={busyBundle === bundle._id}
                                                                >
                                                                    {busyBundle === bundle._id
                                                                        ? 'Processing…'
                                                                        : bundle.currentStage === 'Packing'
                                                                            ? 'Move to Factory Store'
                                                                            : 'Dispatch'}
                                                                </Button>
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {bundle.currentStage === 'Dispatch' ? 'Dispatched' : '—'}
                                                                </Typography>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Stock On Hand
                                    </Typography>
                                    <TableContainer component={Paper} elevation={0}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Location</TableCell>
                                                    <TableCell>SKU</TableCell>
                                                    <TableCell>Quantity</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {stockRows.map((row) => (
                                                    <TableRow key={row._id}>
                                                        <TableCell>{row.location}</TableCell>
                                                        <TableCell>{row.bundle?.style?.sku || '—'}</TableCell>
                                                        <TableCell>{row.quantity}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
}
