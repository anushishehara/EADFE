import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { AdminDashboardStats as Stats } from '../services/leave.service';

interface Props {
    stats: Stats;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminDashboardStats: React.FC<Props> = ({ stats }) => {
    // Process Type Data
    const typeData = Object.entries(stats.leavesByType).map(([name, value]) => ({
        name,
        count: value
    }));

    // Process Status Data
    const statusData = Object.entries(stats.leavesByStatus).map(([name, value]) => ({
        name,
        value
    }));

    return (
        <div className="admin-stats-container">
            <div className="stats-header-grid">
                <div className="stat-summary-card">
                    <span className="stat-icon">👥</span>
                    <div className="stat-details">
                        <span className="stat-label">Total Employees</span>
                        <span className="stat-value">{stats.totalEmployees}</span>
                    </div>
                </div>
                <div className="stat-summary-card">
                    <span className="stat-icon">⏳</span>
                    <div className="stat-details">
                        <span className="stat-label">Pending Reviews</span>
                        <span className="stat-value" style={{ color: '#f59e0b' }}>{stats.pendingLeaves}</span>
                    </div>
                </div>
                <div className="stat-summary-card">
                    <span className="stat-icon">✅</span>
                    <div className="stat-details">
                        <span className="stat-label">Approved Today</span>
                        <span className="stat-value" style={{ color: '#10b981' }}>{stats.approvedLeavesToday}</span>
                    </div>
                </div>
                <div className="stat-summary-card">
                    <span className="stat-icon">❌</span>
                    <div className="stat-details">
                        <span className="stat-label">Rejected Total</span>
                        <span className="stat-value" style={{ color: '#ef4444' }}>{stats.rejectedLeaves}</span>
                    </div>
                </div>
            </div>

            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div className="chart-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Leaves Applied by Type</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={typeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Application Status Distribution</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <style>{`
                .stats-header-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.25rem;
                }
                .stat-summary-card {
                    background: white;
                    padding: 1.25rem;
                    border-radius: 1rem;
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .stat-icon {
                    font-size: 1.5rem;
                    background: var(--bg-main);
                    width: 48px;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                }
                .stat-details {
                    display: flex;
                    flex-direction: column;
                }
                .stat-label {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--text-main);
                }
            `}</style>
        </div>
    );
};

export default AdminDashboardStats;
