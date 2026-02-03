import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaveService, { User } from '../services/leave.service';
import './Dashboard.css'; // Reuse table styles

const Users: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await LeaveService.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1><span className="auth-logo">L</span> LeavePortal</h1>
                    <button className="btn-outline" onClick={() => navigate('/dashboard')}>
                        ← Back to Dashboard
                    </button>
                </div>
            </header>

            <div className="dashboard-content" style={{ gridTemplateColumns: '1fr' }}>
                <main className="main-content">
                    <section className="dashboard-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2>Employee Management</h2>
                        </div>

                        <div className="table-container">
                            <table className="leave-table">
                                <thead>
                                    <tr>
                                        <th>Full Name</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Roles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td style={{ fontWeight: 600 }}>{user.fullName}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className="user-role" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                                                    {user.department}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="user-role">
                                                    {user.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {loading && <div className="loading-state" style={{ padding: '2rem' }}>Loading employees...</div>}
                            {!loading && users.length === 0 && <div className="empty-state">No users found</div>}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Users;
