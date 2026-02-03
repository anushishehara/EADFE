import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaveService, { LeaveType } from '../services/leave.service';
import './ApplyLeave.css';

const ApplyLeave: React.FC = () => {
    const navigate = useNavigate();
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [formData, setFormData] = useState({
        leaveTypeId: '',
        startDate: '',
        endDate: '',
        reason: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadLeaveTypes();
    }, []);

    const loadLeaveTypes = async () => {
        try {
            const response = await LeaveService.getAllLeaveTypes();
            setLeaveTypes(response.data);
        } catch (error) {
            console.error('Error loading leave types:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setSuccess(false);
        setLoading(true);

        try {
            await LeaveService.applyLeave({
                leaveTypeId: parseInt(formData.leaveTypeId),
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason,
            });
            setSuccess(true);
            setMessage('Leave application submitted successfully!');
            setFormData({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error: any) {
            setMessage(error.response?.data || 'Failed to apply for leave');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="apply-leave-container">
            <div className="apply-leave-card">
                <button className="btn-outline" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>

                <h2 className="page-title">Apply for Leave</h2>
                <p className="page-subtitle">Submit your leave request for approval</p>

                {message && (
                    <div className={success ? 'success-message' : 'error-message'}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="leave-form">
                    <div className="form-group">
                        <label htmlFor="leaveType">Leave Type *</label>
                        <select
                            id="leaveType"
                            className="form-input"
                            value={formData.leaveTypeId}
                            onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
                            required
                        >
                            <option value="">Select leave type</option>
                            {leaveTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.typeName} ({type.maxDays} days max)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date *</label>
                            <input
                                type="date"
                                id="startDate"
                                className="form-input"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate">End Date *</label>
                            <input
                                type="date"
                                id="endDate"
                                className="form-input"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                min={formData.startDate || new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="reason">Reason *</label>
                        <textarea
                            id="reason"
                            className="form-input"
                            rows={4}
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder="Please provide a reason for your leave request..."
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Leave Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyLeave;
