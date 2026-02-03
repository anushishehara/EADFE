import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeaveService, { LeaveType } from '../services/leave.service';
import './LeaveTypes.css';

const LeaveTypes: React.FC = () => {
    const navigate = useNavigate();
    const [types, setTypes] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        typeName: '',
        maxDays: '',
        description: '',
    });

    useEffect(() => {
        loadTypes();
    }, []);

    const loadTypes = async () => {
        try {
            setLoading(true);
            const response = await LeaveService.getAllLeaveTypes();
            setTypes(response.data);
        } catch (error) {
            console.error('Error loading types:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await LeaveService.createLeaveType({
                typeName: formData.typeName,
                maxDays: parseInt(formData.maxDays),
                description: formData.description,
            });
            setShowModal(false);
            setFormData({ typeName: '', maxDays: '', description: '' });
            loadTypes();
            alert('Leave type created successfully!');
        } catch (error: any) {
            alert(error.response?.data || 'Failed to create leave type');
        }
    };

    return (
        <div className="leave-types-container">
            <div className="leave-types-content">
                <button className="btn-back" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>

                <div className="header-actions">
                    <div className="title-group">
                        <h2 className="page-title">Manage Leave Types</h2>
                        <p className="page-subtitle">Configure available leave categories and their limits</p>
                    </div>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        <span>+</span> Add New Type
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">Loading...</div>
                ) : (
                    <div className="types-grid">
                        {types.map((type) => (
                            <div key={type.id} className="type-card">
                                <div className="type-info">
                                    <h3>{type.typeName}</h3>
                                    <div className="max-days-badge">{type.maxDays} Days Max</div>
                                    <p className="description">{type.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Add New Leave Type</h3>
                            <form onSubmit={handleSubmit} className="type-form">
                                <div className="form-group">
                                    <label>Type Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.typeName}
                                        onChange={(e) => setFormData({ ...formData, typeName: e.target.value })}
                                        placeholder="e.g. Annual Leave"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Max Days *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.maxDays}
                                        onChange={(e) => setFormData({ ...formData, maxDays: e.target.value })}
                                        placeholder="e.g. 14"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        className="form-input"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of this leave type..."
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="submit" className="btn-primary">Create Type</button>
                                    <button type="button" className="btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveTypes;
