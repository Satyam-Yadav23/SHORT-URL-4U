import axiosInstance from "../utils/axiosinstance.js";

export const loginUser = async (email, password) => {
    const { data } = await axiosInstance.post("api/auth/login", {email, password});
    return data;
}

export const registerUser = async (name, email, password) => {
    const { data } = await axiosInstance.post("api/auth/register", {name, email, password});
    return data;
}

export const logoutUser = async () => {
    const { data } = await axiosInstance.post("api/auth/logout");
    return data;
}

export const getCurrentUser = async () => {
    const { data } = await axiosInstance.get('/api/auth/me');
    return data;
}

export const getAllUserUrls = async () =>{
    const {data} = await axiosInstance.post('/api/user/urls');
    return data;
}

export const forgotPassword = async (email) => {
    const { data } = await axiosInstance.post("/api/auth/forgot-password", { email });
    return data;
}

export const resetPassword = async (token, password) => {
    const { data } = await axiosInstance.post(`/api/auth/reset-password/${token}`, { password });
    return data;
}
