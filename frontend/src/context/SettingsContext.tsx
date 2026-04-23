import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { SystemSettings, SettingsContextType } from '../types';
import { API_BASE_URL } from '../config/api';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SystemSettings = {
    system_name: 'SGC - Gestión de Condominios',
    systemIcon: 'S',
    cameraBackupDays: 7,
    darkMode: true,
    theme: 'dark',
    admin_name: '',
    adminRut: '',
    condo_rut: '',
    condo_address: '',
    adminPhone: '',
    adminSignature: '',
    deletionPassword: '',
    vacationAccrualRate: 1.25
};

const API_URL = `${API_BASE_URL}/system_settings`;

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);

    const fetchSettings = async () => {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    // Always force dark mode even if DB says otherwise
                    setSettings({ ...DEFAULT_SETTINGS, ...data[0], darkMode: true, theme: 'dark' });
                }
            }
        } catch (e) {
            console.error('Error fetching settings:', e);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        document.title = settings.system_name;
        // Forced Night Mode - SGC Final Aesthetics
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('modern');

        if (settings.systemFavicon) {
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = settings.systemFavicon;
        }
    }, [settings]);

    const updateSettings = async (newSettings: SystemSettings) => {
        // Ensure dark mode is persisted
        const forcedSettings = { ...newSettings, darkMode: true, theme: 'dark' as const };
        setSettings(forcedSettings);
        
        try {
            const method = (forcedSettings as any).id ? 'PUT' : 'POST';
            const url = (forcedSettings as any).id ? `${API_URL}/${(forcedSettings as any).id}` : API_URL;
            
            const response = await fetch(url, {
                method,
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token'), 'Content-Type': 'application/json' },
                body: JSON.stringify(forcedSettings)
            });
            
            if (response.ok) {
                const updatedData = await response.json();
                setSettings(prev => ({ ...prev, ...updatedData, darkMode: true, theme: 'dark' }));
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar la configuración');
            }
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    };

    const toggleTheme = () => {
        // Theme toggling disabled by architectural decision
        console.log('Night Mode is forced for premium aesthetics.');
    };

    const setTheme = (theme: 'light' | 'dark' | 'modern') => {
        // Always force dark
        updateSettings({
            ...settings,
            theme: 'dark',
            darkMode: true
        });
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, toggleTheme, setTheme }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
