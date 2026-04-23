import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { SystemMessage, SystemMessageContextType } from '../types';
import { API_BASE_URL } from '../config/api';

const SystemMessageContext = createContext<SystemMessageContextType | undefined>(undefined);

const API_URL = `${API_BASE_URL}/mensajes`;

/** Safely parse a Response that may or may not be JSON */
const safeParseError = async (response: Response): Promise<string> => {
    try {
        const text = await response.text();
        const json = JSON.parse(text);
        return json.error || json.message || `Error ${response.status}`;
    } catch {
        return `Error del servidor (${response.status})`;
    }
};

export const SystemMessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<SystemMessage[]>([]);

    const getAuthHeaders = (): Record<string, string> => ({
        'Authorization': 'Bearer ' + (localStorage.getItem('token') ?? ''),
        'Content-Type': 'application/json'
    });

    const fetchMessages = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(Array.isArray(data) ? data : []);
            } else {
                console.warn('[Mensajes] GET failed:', response.status);
            }
        } catch (error) {
            console.error('[Mensajes] Network error on fetch:', error);
        }
    };

    useEffect(() => {
        // Fetch on mount if a token already exists (persisted session)
        fetchMessages();
        // Re-fetch when the auth-ready event fires (after successful login)
        const handler = () => {
            // Small delay to ensure localStorage.token is already set
            setTimeout(fetchMessages, 100);
        };
        window.addEventListener('auth-ready', handler);
        return () => window.removeEventListener('auth-ready', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addMessage = async (message: Omit<SystemMessage, 'id' | 'created_at'>) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ ...message, created_at: new Date().toISOString() })
        });
        if (!response.ok) {
            throw new Error(await safeParseError(response));
        }
        await fetchMessages();
    };

    const updateMessage = async (message: SystemMessage) => {
        const response = await fetch(`${API_URL}/${message.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(message)
        });
        if (!response.ok) {
            throw new Error(await safeParseError(response));
        }
        await fetchMessages();
    };

    const deleteMessage = async (id: string) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error(await safeParseError(response));
        }
        await fetchMessages();
    };

    const toggleMessageStatus = async (id: string) => {
        const msg = messages.find(m => m.id === id);
        if (msg) {
            await updateMessage({ ...msg, is_active: !msg.is_active });
        }
    };

    return (
        <SystemMessageContext.Provider value={{ messages, addMessage, updateMessage, deleteMessage, toggleMessageStatus, refreshMessages: fetchMessages }}>
            {children}
        </SystemMessageContext.Provider>
    );
};

export const useSystemMessages = () => {
    const context = useContext(SystemMessageContext);
    if (!context) throw new Error('useSystemMessages must be used within SystemMessageProvider');
    return context;
};
