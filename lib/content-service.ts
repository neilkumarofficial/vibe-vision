import axios from 'axios';
import { getToken } from './token-manager';
import { BASE_URL } from '@/config';

// const BASE_URL = 'http://localhost:8000';

export const getAllContent = async (): Promise<ContentItem[] | null> => {
    try {
        const url = `${BASE_URL}/api/content/get-all-content`;
        const response = await axios.get(url);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching content data:", error);
        return null;
    }
};

export const getCurrentUserContent = async (): Promise<ContentItem[] | null> => {
    const token = getToken()

    if (!token) {
        return null;
    }

    try {
        const url = `${BASE_URL}/api/content/get-user-content`;
        const response = await axios.get(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching content data:", error);
        return null;
    }
};


