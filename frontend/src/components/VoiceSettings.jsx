import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const VoiceSettings = ({ onSettingsChange, initialSettings = {} }) => {
    const [settings, setSettings] = useState({
        language: initialSettings.language || 'en',
        voiceGender: initialSettings.voiceGender || 'female',
        style: initialSettings.style || 'calm'
    });

    const [availableLanguages, setAvailableLanguages] = useState({});
    const [availableStyles, setAvailableStyles] = useState({});

    useEffect(() => {
        // Fetch available languages and styles
        const fetchSettings = async () => {
            try {
                const [languagesResponse, stylesResponse] = await Promise.all([
                    fetch('/api/voice/supported-languages'),
                    fetch('/api/voice/voice-styles')
                ]);

                if (!languagesResponse.ok || !stylesResponse.ok) {
                    throw new Error('Failed to fetch voice settings');
                }

                const languages = await languagesResponse.json();
                const styles = await stylesResponse.json();

                setAvailableLanguages(languages);
                setAvailableStyles(styles);
            } catch (error) {
                console.error('Error fetching voice settings:', error);
                toast.error('Failed to load voice settings');
            }
        };

        fetchSettings();
    }, []);

    const handleSettingChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        if (onSettingsChange) {
            onSettingsChange(newSettings);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Voice Settings</h3>
            
            {/* Language Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Language
                </label>
                <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    {Object.entries(availableLanguages).map(([code, voices]) => (
                        <option key={code} value={code}>
                            {code === 'en' ? 'English' : code === 'hi' ? 'Hindi' : 'Telugu'}
                        </option>
                    ))}
                </select>
            </div>

            {/* Voice Gender Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Voice Gender
                </label>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value="female"
                            checked={settings.voiceGender === 'female'}
                            onChange={(e) => handleSettingChange('voiceGender', e.target.value)}
                            className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Female</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value="male"
                            checked={settings.voiceGender === 'male'}
                            onChange={(e) => handleSettingChange('voiceGender', e.target.value)}
                            className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Male</span>
                    </label>
                </div>
            </div>

            {/* Voice Style Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Voice Style
                </label>
                <select
                    value={settings.style}
                    onChange={(e) => handleSettingChange('style', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    {Object.keys(availableStyles).map((style) => (
                        <option key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default VoiceSettings; 