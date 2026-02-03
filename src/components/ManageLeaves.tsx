import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaveService, { LeaveRequest } from '../services/leave.service';
import './ManageLeaves.css';

const ManageLeaves: React.FC = () => {
    const navigate = useNavigate();
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
    const [loading, setLoading] = useState(true);
    const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
    const [remarks, setRemarks] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadLeaves();
    }, [filter]);

    const loadLeaves = async () => {
        try {
            setLoading(true);
            const response = filter === 'PENDING'
                ? await LeaveService.getAllPendingLeaves()
                : await LeaveService.getAllLeaves();

            let filteredLeaves = response.data;
            if (filter !== 'ALL' && filter !== 'PENDING') {
                filteredLeaves = response.data.filter(leave => leave.status === filter);
            }

            setLeaves(filteredLeaves);
        } catch (error) {
            console.error('Error loading leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async (leaveId: number, status: 'APPROVED' | 'REJECTED') => {
        if (!remarks.trim()) {
            alert('Please provide remarks');
            return;
        }

        try {
            setProcessing(true);
            await LeaveService.processLeave(leaveId, { status, remarks });
            setSelectedLeave(null);
            setRemarks('');
            loadLeaves();
            alert(`Leave ${status.toLowerCase()} successfully!`);
        } catch (error: any) {
            alert(error.response?.data || 'Failed to process leave');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return '#10b981';
            case 'REJECTED': return '#ef4444';
            case 'CANCELLED': return '#6b7280';
            default: return '#f59e0b';
        }
    };

    return (
        <div className="manage-leaves-container">
            <div className="manage-leaves-content">
                <button className="btn-outline" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>

                <h2 className="page-title">Manage Leave Requests</h2>
                <p className="page-subtitle">Review and process employee leave applications</p>

                <div className="filter-tabs">
                    <button
                        className={filter === 'PENDING' ? 'tab active' : 'tab'}
                        onClick={() => setFilter('PENDING')}
                    >
                        Pending
                    </button>
                    <button
                        className={filter === 'APPROVED' ? 'tab active' : 'tab'}
                        onClick={() => setFilter('APPROVED')}
                    >
                        Approved
                    </button>
                    <button
                        className={filter === 'REJECTED' ? 'tab active' : 'tab'}
                        onClick={() => setFilter('REJECTED')}
                    >
                        Rejected
                    </button>
                    <button
                        className={filter === 'ALL' ? 'tab active' : 'tab'}
                        onClick={() => setFilter('ALL')}
                    >
                        All
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">Loading...</div>
                ) : (
                    <div className="leaves-grid">
                        {leaves.map((leave) => (
                            <div key={leave.id} className="leave-card">
                                <div className="leave-header">
                                    <div className="applicant-info">
                                        <h3>{leave.leaveType.typeName}</h3>
                                        <p className="applicant-name">
                                            {leave.user.fullName} ({leave.user.department})
                                            <span className="user-role-badge">{leave.user.role?.replace('ROLE_', '')}</span>
                                        </p>
                                    </div>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(leave.status) }}
                                    >
                                        {leave.status}
                                    </span>
                                </div>

                                <div className="leave-details">
                                    <div className="detail-row">
                                        <span className="label">Duration:</span>
                                        <span className="value">
                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Total Days:</span>
                                        <span className="value">{leave.totalDays} days</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Applied On:</span>
                                        <span className="value">{new Date(leave.appliedDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="label">Reason:</span>
                                        <span className="value">{leave.reason}</span>
                                    </div>
                                    {leave.remarks && (
                                        <div className="detail-row">
                                            <span className="label">Remarks:</span>
                                            <span className="value">{leave.remarks}</span>
                                        </div>
                                    )}
                                </div>

                                {leave.status === 'PENDING' && (
                                    <div className="leave-actions">
                                        <button
                                            className="btn-primary"
                                            onClick={() => setSelectedLeave(leave)}
                                        >
                                            Review & Process
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {leaves.length === 0 && (
                            <div className="empty-state">No {filter.toLowerCase()} leave requests found</div>
                        )}
                    </div>
                )}

                {/* Process Modal */}
                {selectedLeave && (
                    <div className="modal-overlay" onClick={() => setSelectedLeave(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Process Leave Request</h3>
                            <div className="modal-details">
                                <p><strong>Employee:</strong> {selectedLeave.user.fullName} ({selectedLeave.user.username})</p>
                                <p><strong>User Type:</strong> <span className="user-role-badge">{selectedLeave.user.role?.replace('ROLE_', '')}</span></p>
                                <p><strong>Department:</strong> {selectedLeave.user.department}</p>
                                <p><strong>Leave Type:</strong> {selectedLeave.leaveType.typeName}</p>
                                <p><strong>Duration:</strong> {selectedLeave.totalDays} days</p>
                                <p><strong>Dates:</strong> {new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()}</p>
                                <p><strong>Reason:</strong> {selectedLeave.reason}</p>
                            </div>

                            <div className="form-group">
                                <label>Remarks *</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Enter your remarks..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn-primary"
                                    onClick={() => handleProcess(selectedLeave.id, 'APPROVED')}
                                    disabled={processing}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn-danger"
                                    onClick={() => handleProcess(selectedLeave.id, 'REJECTED')}
                                    disabled={processing}
                                >
                                    Reject
                                </button>
                                <button
                                    className="btn-outline"
                                    onClick={() => setSelectedLeave(null)}
                                    disabled={processing}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageLeaves;
