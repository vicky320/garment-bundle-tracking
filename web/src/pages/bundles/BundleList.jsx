import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material';
import { fetchBundles } from '../../services/bundle.service.js';

export default function BundleList() {
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadBundles() {
            try {
                const data = await fetchBundles();
                setBundles(data);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load bundles');
            } finally {
                setLoading(false);
            }
        }

        loadBundles();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Bundle master</Typography>
                <Button component={RouterLink} to="/bundles/create" variant="contained">
                    Create Bundle
                </Button>
            </Box>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <Card>
                    <CardContent>
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Bundle</TableCell>
                                        <TableCell>Style SKU</TableCell>
                                        <TableCell>Qty</TableCell>
                                        <TableCell>Stage</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bundles.map((bundle) => (
                                        <TableRow key={bundle._id}>
                                            <TableCell>{bundle.bundleCode}</TableCell>
                                            <TableCell>{bundle.style?.sku || '—'}</TableCell>
                                            <TableCell>{bundle.quantity}</TableCell>
                                            <TableCell>{bundle.currentStage}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
