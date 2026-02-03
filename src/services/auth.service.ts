import api from './api';
import { SignupRequest, SigninRequest } from '../types/auth'; // We need to define types

const register = (signupRequest: SignupRequest) => {
    return api.post('/auth/signup', signupRequest);
};

const login = (signinRequest: SigninRequest) => {
    return api.post('/auth/signin', signinRequest)
        .then((response) => {
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
