import { useState, useEffect } from 'react';

// Generic type for persisted state
export function usePersistedState<T>(
    key: string,
    initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    // Try to retrieve the stored value from localStorage
    const readStoredValue = (): T => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading localStorage:', error);
            return initialValue;
        }
    };

    // Initialize state with stored or initial value
    const [state, setState] = useState<T>(() => {
        // Check if we're in a browser environment to avoid SSR issues
        if (typeof window !== 'undefined') {
            return readStoredValue();
        }
        return initialValue;
    });

    // Update localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }, [key, state]);

    // Custom setter that allows both direct values and function updates
    const setPersistedState: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            // Allow function updates like standard setState
            const newValue = value instanceof Function
                ? value(state)
                : value;

            setState(newValue);
        } catch (error) {
            console.error('Error updating persisted state:', error);
            setState(initialValue);
        }
    };

    return [state, setPersistedState];
}

// Optional: Add a clear function for resetting persisted state
export function clearPersistedState(key: string) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}