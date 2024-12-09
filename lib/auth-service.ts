// src/services/authService.ts
import axios, { AxiosError } from 'axios';
import { setToken, removeToken, getToken } from './token-manager';

interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

interface CustomError {
    message: string;
    code?: string;
}

// Login Function
export const login = async (
    data: { email: string; password: string },
    setToastMessage: Function,
    showToast?: Function
) => {
    try {
        const url = `/api/auth/login`;
        const response = await axios.post(url, data);
        const { jwtToken, name, email } = response.data;

        setToken(jwtToken);

        // setToastMessage('Logged in successfully!');
        // showToast?.();
        window.location.href = "/entertainment-hub";
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<CustomError>;

            if (axiosError.response) {
                console.error('Response status:', axiosError.response.status);
                console.error('Response data:', axiosError.response.data);
                setToastMessage(axiosError.response.data.message || 'Invalid email or password!');
                showToast?.();
            }
            else if (axiosError.request) { console.error('Request:', axiosError.request); }
            else { console.error('Error:', axiosError.message); }
        }
        else {
            console.error('Non-Axios Error:', error);
            setToastMessage('Something went wrong. Please try again later!');
            showToast?.();
        }

    }
};

// Example from the signup form
// import { useRouter } from "next/router";
// Signup Function with OTP Notification
export const signup = async (
    data: { firstName: string; lastName: string; email: string; password: string },
    setToastMessage: Function,
    showToast?: Function
) => {
    try {
        const url = `/api/auth/signup`;
        await axios.post(url, {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            password: data.password,
        });

        // Notify the user that an OTP has been sent
        // setToastMessage('Account created successfully! Please check your email for the OTP to verify your account.');
        // showToast?.();
        window.location.href = `/verify-email?email=${encodeURIComponent(data.email)}&firstName=${encodeURIComponent(data.firstName)}`;
        // Redirect to OTP verification page
    // } catch (error: any) {
    //     console.error(error);

    //     if (error.response && error.response.status === 409) {
    //         // Handle the 409 conflict specifically
    //         setToastMessage('The email address is already in use. Please use a different one.');
    //     } else {
    //         // Handle other errors
    //         setToastMessage('Something went wrong. Please try again.');
    //     }

    //     showToast();
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<CustomError>;

            if (axiosError.response) {
                console.error('Response status:', axiosError.response.status);
                console.error('Response data:', axiosError.response.data);
                setToastMessage(axiosError.response.data.message || 'Invalid email or password!');
                showToast?.();
            }
            else if (axiosError.request) { console.error('Request:', axiosError.request); }
            else { console.error('Error:', axiosError.message); }
        }
        else {
            console.error('Non-Axios Error:', error);
            setToastMessage('Something went wrong. Please try again later!');
            showToast?.();
        }

    }
};

// OTP Verification Function
export const verifyOtp = async (
    data: { email: string; otp: string },
    setToastMessage: Function,
    showToast?: Function
) => {
    try {
        const url = `/api/auth/verify-otp`;
        await axios.post(url, data);

        // setToastMessage('OTP verified successfully! You can now log in.');
        // showToast?.();
        window.location.href = "/login"; // Redirect to login page
    } catch (error) {
        console.error(error);
        setToastMessage('Invalid OTP or the OTP has expired. Please try again.');
        showToast?.();
    }
};


// Function to handle Google OAuth login
export const googleLogin = () => {
    window.location.href = `/api/auth/google`;
};

// Function to handle logout
export const logout = () => {
    removeToken();
    window.location.href = '/'; // Redirect to login page
};

export const getCurrentUser = async (userId: string | null, token: string | null): Promise<User | null> => {

    if (!userId || !token) return null;

    try {
        const response = await axios.get(`/api/user/current-user/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};