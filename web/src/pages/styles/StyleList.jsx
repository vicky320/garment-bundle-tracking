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
import { fetchStyles } from '../../services/style.service.js';

export default function StyleList() {
    const [styles, setStyles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadStyles() {
            try {
                const data = await fetchStyles();
                setStyles(data);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load styles');
            } finally {
                setLoading(false);
            }
        }

        loadStyles();
    }, []);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Style master</Typography>
                <Button component={RouterLink} to="/styles/create" variant="contained">
                    Create Style
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
                                        <TableCell>SKU</TableCell>
                                        <TableCell>Style Name</TableCell>
                                        <TableCell>Description</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {styles.map((style) => (
                                        <TableRow key={style._id}>
                                            <TableCell>{style.sku}</TableCell>
                                            <TableCell>{style.styleName}</TableCell>
                                            <TableCell>{style.description}</TableCell>
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
