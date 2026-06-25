import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';
import StyleList from '../pages/styles/StyleList.jsx';
import CreateStyle from '../pages/styles/CreateStyle.jsx';
import BundleList from '../pages/bundles/BundleList.jsx';
import CreateBundle from '../pages/bundles/CreateBundle.jsx';
import Stock from '../pages/stock/Stock.jsx';
import StageHistory from '../pages/history/StageHistory.jsx';
import OperatorScan from '../pages/operator/OperatorScan.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Dashboard />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Dashboard />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/styles"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <StyleList />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/styles/create"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <CreateStyle />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/bundles"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <BundleList />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/bundles/create"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <CreateBundle />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/stock"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Stock />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <StageHistory />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/operator"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <OperatorScan />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
