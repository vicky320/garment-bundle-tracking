import React, { useEffect, useState } from 'react';
import {
    Box,
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
import { fetchStock } from '../../services/stock.service.js';

export default function Stock() {
    const [stockRows, setStockRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadStock() {
            try {
                const data = await fetchStock();
                setStockRows(data);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load inventory');
            } finally {
                setLoading(false);
            }
        }

        loadStock();
    }, []);

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Stock on hand
            </Typography>
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
            )}
        </Box>
    );
}
