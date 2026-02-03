import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ApplyLeave from './components/ApplyLeave';
import ManageLeaves from './components/ManageLeaves';
import LeaveTypes from './components/LeaveTypes';
import Users from './components/Users';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return isAdmin ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Manager/Admin Route Component
const ManagerRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isManager } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return isManager ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Employee Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/apply-leave" element={
                        <ProtectedRoute>
                            <ApplyLeave />
                        </ProtectedRoute>
                    } />

                    {/* Protected Admin Routes */}
                    <Route path="/manage-leaves" element={
                        <AdminRoute>
                            <ManageLeaves />
                        </AdminRoute>
                    } />

                    {/* Protected Admin Routes */}
                    <Route path="/leave-types" element={
                        <AdminRoute>
                            <LeaveTypes />
                        </AdminRoute>
                    } />
                    <Route
                        path="/users"
                        element={
                            <AdminRoute>
                                <Users />
                            </AdminRoute>
                        }
                    />

                    {/* Redirects */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
