import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
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
import { fetchBundles, advanceBundleStage } from '../../services/bundle.service.js';
import { fetchStyles } from '../../services/style.service.js';
import { fetchStock } from '../../services/stock.service.js';

const stagingLabels = ['Cutting', 'Stitching', 'Finishing', 'Packing', 'Factory Store', 'Dispatch'];

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [bundles, setBundles] = useState([]);
    const [stockRows, setStockRows] = useState([]);
    const [styles, setStyles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busyBundle, setBusyBundle] = useState(null);

    useEffect(() => {
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
    }, []);

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
