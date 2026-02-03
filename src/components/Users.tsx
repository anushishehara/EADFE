import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaveService, { User } from '../services/leave.service';
import './Dashboard.css';

const Users: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        department: '',
        role: ''
    });
    const [processing, setProcessing] = useState(false);

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

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setFormData({
            fullName: user.fullName,
            email: user.email,
            department: user.department || '',
            role: user.role
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this employee? This will also remove all their leave records and balances.')) {
            try {
                setProcessing(true);
                await LeaveService.deleteUser(id);
                loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user.');
            } finally {
                setProcessing(false);
            }
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        try {
            setProcessing(true);
            await LeaveService.updateUser(selectedUser.id, formData);
            setShowEditModal(false);
            loadUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user.');
        } finally {
            setProcessing(false);
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
                                        <th>Role</th>
                                        <th>Actions</th>
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
                                                    {user.department || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="user-role">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        className="btn-ghost"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                        onClick={() => handleEditClick(user)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn-danger"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                                        onClick={() => handleDeleteClick(user.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
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

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Edit Employee</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Update employee information and access privileges.</p>
                        </div>

                        <form onSubmit={handleUpdate}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="e.g. john@example.com"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Department</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        placeholder="e.g. Engineering"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        className="form-input"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        required
                                    >
                                        <option value="ROLE_USER">Employee</option>
                                        <option value="ROLE_MANAGER">Manager</option>
                                        <option value="ROLE_ADMIN">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-outline"
                                    onClick={() => setShowEditModal(false)}
                                    style={{ padding: '0.75rem 1.5rem' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={processing}
                                    style={{ padding: '0.75rem 2rem' }}
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
