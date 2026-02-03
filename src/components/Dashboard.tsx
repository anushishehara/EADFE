import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LeaveService, { LeaveBalance, LeaveRequest, AdminDashboardStats as Stats } from '../services/leave.service';
import AdminDashboardStats from './AdminDashboardStats';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const { user, logout, isAdmin, isManager } = useAuth();
    const navigate = useNavigate();
    const [balances, setBalances] = useState<LeaveBalance[]>([]);
    const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);
    const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
    const [adminStats, setAdminStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const balanceRes = await LeaveService.getMyLeaveBalances();
            setBalances(balanceRes.data);

            const leavesRes = await LeaveService.getMyLeaves();
            setMyLeaves(leavesRes.data);

            if (isAdmin) {
                const pendingRes = await LeaveService.getAllPendingLeaves();
                setPendingLeaves(pendingRes.data);

                const statsRes = await LeaveService.getAdminDashboardStats();
                setAdminStats(statsRes.data);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return '#10b981';
            case 'REJECTED': return '#ef4444';
            case 'CANCELLED': return '#6b7280';
            default: return '#f59e0b';
        }
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1><span className="auth-logo">L</span> LeavePortal</h1>
                    <div className="user-info">
                        <span className="welcome-text">Welcome, {user?.username}</span>
                        <span className="user-role">{user?.roles?.join(', ')}</span>
                        <button onClick={handleLogout} className="btn-danger">Logout</button>
                    </div>
                </div>
            </header>

            <div className="dashboard-content">
                <nav className="dashboard-nav">
                    <button className="nav-btn active" onClick={() => navigate('/dashboard')}>
                        Dashboard
                    </button>
                    <button className="nav-btn" onClick={() => navigate('/apply-leave')}>
                        Apply Leave
                    </button>
                    {isAdmin && (
                        <button className="nav-btn" onClick={() => navigate('/manage-leaves')}>
                            Manage Leaves
                        </button>
                    )}
                    {isAdmin && (
                        <button className="nav-btn" onClick={() => navigate('/leave-types')}>
                            Leave Types
                        </button>
                    )}
                    {isAdmin && (
                        <button className="nav-btn" onClick={() => navigate('/users')}>
                            Employees
                        </button>
                    )}
                </nav>

                <main className="main-content">
                    {/* Admin Dashboard Stats */}
                    {isAdmin && adminStats && (
                        <section className="dashboard-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2>Organization Overview</h2>
                            </div>
                            <AdminDashboardStats stats={adminStats} />
                        </section>
                    )}

                    {/* Leave Balances */}
                    <section className="dashboard-section">
                        <h2>My Leave Balances</h2>
                        <div className="balance-grid">
                            {balances.map((balance) => (
                                <div key={balance.id} className="balance-card">
                                    <h3>{balance.leaveType.typeName}</h3>
                                    <div className="balance-stats">
                                        <div className="stat">
                                            <span className="stat-label">Total</span>
                                            <span className="stat-value">{balance.totalDays}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Used</span>
                                            <span className="stat-value used">{balance.usedDays}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Remaining</span>
                                            <span className="stat-value remaining">{balance.remainingDays}</span>
                                        </div>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${(balance.usedDays / balance.totalDays) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* My Recent Leaves */}
                    <section className="dashboard-section">
                        <h2>My Recent Leave Requests</h2>
                        <div className="table-container">
                            <table className="leave-table">
                                <thead>
                                    <tr>
                                        <th>Leave Type</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Days</th>
                                        <th>Status</th>
                                        <th>Applied On</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myLeaves.slice(0, 5).map((leave) => (
                                        <tr key={leave.id}>
                                            <td>{leave.leaveType.typeName}</td>
                                            <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                                            <td>{leave.totalDays}</td>
                                            <td>
                                                <span
                                                    className="status-badge"
                                                    style={{ backgroundColor: getStatusColor(leave.status) }}
                                                >
                                                    {leave.status}
                                                </span>
                                            </td>
                                            <td>{new Date(leave.appliedDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {myLeaves.length === 0 && (
                                <div className="empty-state">No leave requests found</div>
                            )}
                        </div>
                    </section>

                    {/* Pending Approvals (Admin) */}
                    {isAdmin && pendingLeaves.length > 0 && (
                        <section className="dashboard-section">
                            <h2>Pending Approvals ({pendingLeaves.length})</h2>
                            <div className="table-container">
                                <table className="leave-table">
                                    <thead>
                                        <tr>
                                            <th>Employee</th>
                                            <th>Leave Type</th>
                                            <th>Duration</th>
                                            <th>Days</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingLeaves.slice(0, 5).map((leave) => (
                                            <tr key={leave.id}>
                                                <td>{leave.user.fullName}</td>
                                                <td>{leave.leaveType.typeName}</td>
                                                <td>
                                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                                </td>
                                                <td>{leave.totalDays}</td>
                                                <td>
                                                    <button
                                                        className="btn-ghost"
                                                        onClick={() => navigate('/manage-leaves')}
                                                    >
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
