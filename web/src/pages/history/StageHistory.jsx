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
import { fetchHistory } from '../../services/history.service.js';

export default function StageHistory() {
    const [historyRows, setHistoryRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadHistory() {
            try {
                const data = await fetchHistory();
                setHistoryRows(data);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load stage history');
            } finally {
                setLoading(false);
            }
        }

        loadHistory();
    }, []);

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Stage history
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
                                        <TableCell>Bundle</TableCell>
                                        <TableCell>From</TableCell>
                                        <TableCell>To</TableCell>
                                        <TableCell>Operator</TableCell>
                                        <TableCell>Created At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {historyRows.map((row) => (
                                        <TableRow key={row._id}>
                                            <TableCell>{row.bundle?.bundleCode || '—'}</TableCell>
                                            <TableCell>{row.fromStage}</TableCell>
                                            <TableCell>{row.toStage}</TableCell>
                                            <TableCell>{row.operator?.name || '—'}</TableCell>
                                            <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
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
