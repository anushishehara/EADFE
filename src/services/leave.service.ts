import api from './api';

export interface LeaveType {
    id: number;
    typeName: string;
    maxDays: number;
    description: string;
}

export interface LeaveBalance {
    id: number;
    leaveType: LeaveType;
    totalDays: number;
    usedDays: number;
    remainingDays: number;
}

export interface LeaveRequest {
    id: number;
    user: {
        id: number;
        username: string;
        fullName: string;
        department: string;
        role: string;
    };
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    totalDays: number;
    appliedDate: string;
    processedDate?: string;
    remarks?: string;
}

const getAllLeaveTypes = () => {
    return api.get<LeaveType[]>('/leave-types');
};

const createLeaveType = (data: { typeName: string; maxDays: number; description: string }) => {
    return api.post('/leave-types', data);
};

const getMyLeaveBalances = () => {
    return api.get<LeaveBalance[]>('/leave-balances/my-balances');
};

export interface AdminDashboardStats {
    totalEmployees: number;
    pendingLeaves: number;
    approvedLeavesToday: number;
    rejectedLeaves: number;
    leavesByType: { [key: string]: number };
    leavesByStatus: { [key: string]: number };
}

export interface User {
    id: number;
    username: string;
    fullName: string;
    email: string;
    department: string;
    role: string;
}

// Note: The original file uses 'api' from './api' for all requests.
// The provided Code Edit introduces 'axios', 'authHeader()', and specific URLs.
// To maintain consistency and syntactic correctness without introducing new dependencies,
// these new methods will use the existing 'api' client and relative paths,
// assuming 'api' is configured to handle the base URL.
// If 'axios' and 'authHeader()' are intended, they would need to be imported/defined.

const applyLeave = (data: { leaveTypeId: number; startDate: string; endDate: string; reason: string }) => {
    return api.post('/leaves/apply', data);
};

const getMyLeaves = () => {
    return api.get<LeaveRequest[]>('/leaves/my-leaves');
};

const getAllPendingLeaves = () => {
    return api.get<LeaveRequest[]>('/leaves/pending');
};

const getAllLeaves = () => {
    return api.get<LeaveRequest[]>('/leaves');
};

const processLeave = (id: number, data: { status: string; remarks: string }) => {
    return api.put(`/leaves/${id}/process`, data);
};

const cancelLeave = (id: number) => {
    return api.delete(`/leaves/${id}/cancel`);
};

const getAdminDashboardStats = () => {
    return api.get<AdminDashboardStats>('/statistics/admin-dashboard');
};

const getAllUsers = () => {
    return api.get<User[]>('/users');
};

const updateUser = (id: number, data: Partial<User>) => {
    return api.put(`/users/${id}`, data);
};

const deleteUser = (id: number) => {
    return api.delete(`/users/${id}`);
};

const LeaveService = {
    getAllLeaveTypes,
    createLeaveType,
    getMyLeaveBalances,
    applyLeave,
    getMyLeaves,
    getAllPendingLeaves,
    getAllLeaves,
    processLeave,
    cancelLeave,
    getAdminDashboardStats,
    getAllUsers,
    updateUser,
    deleteUser,
};

export default LeaveService;
