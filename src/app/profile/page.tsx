"use client";

const API_BASE = "https://nutrilens-backend-40fc.onrender.com";


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define a type for the profile state for better type-safety
type ProfileState = {
    age: string;
    weight: string;
    height: string;
    gender: string;
    activity_level: string;
    primary_goal: string;
    health_conditions: string;
    allergies: string;
};

export default function ProfilePage() {
    const { token, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<ProfileState>({
        age: '',
        weight: '',
        height: '',
        gender: 'Male',
        activity_level: 'Sedentary',
        primary_goal: 'Maintain Weight',
        health_conditions: '',
        allergies: '',
    });
    const [message, setMessage] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    // This useEffect hook runs when the component loads.
    // It checks if the user is logged in and fetches their profile.
    useEffect(() => {
        if (isAuthLoading) {
            return; // Wait until authentication check is complete
        }
        if (!token) {
            router.push('/login'); // If no token, redirect to login page
            return;
        }

        const fetchProfile = async () => {
            setIsPageLoading(true);
            try {
                const response = await fetch(`${API_BASE}/profile/`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    // Populate form with existing data, handling null values
                    setProfile({
                        age: data.age?.toString() || '',
                        weight: data.weight?.toString() || '',
                        height: data.height?.toString() || '',
                        gender: data.gender || 'Male',
                        activity_level: data.activity_level || 'Sedentary',
                        primary_goal: data.primary_goal || 'Maintain Weight',
                        health_conditions: data.health_conditions || '',
                        allergies: data.allergies || '',
                    });
                } else if (response.status === 404) {
                    // It's a new user, no profile yet. This is fine.
                    console.log("No profile found, user can create a new one.");
                }
            } catch (error) {
                setMessage('Error: Failed to fetch profile data.');
                setIsSuccess(false);
            } finally {
                setIsPageLoading(false);
            }
        };

        fetchProfile();
    }, [token, isAuthLoading, router]);

    // Handles changes in any form input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    // Handles the form submission to save the profile
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('Updating profile...');
        setIsSuccess(false);

        const profileData = {
            age: profile.age ? parseInt(profile.age) : null,
            weight: profile.weight ? parseFloat(profile.weight) : null,
            height: profile.height ? parseFloat(profile.height) : null,
            gender: profile.gender,
            activity_level: profile.activity_level,
            primary_goal: profile.primary_goal,
            health_conditions: profile.health_conditions || null,
            allergies: profile.allergies || null,
        };

        try {
            const response = await fetch(`${API_BASE}/profile/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                setMessage('Profile updated successfully!');
                setIsSuccess(true);
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.detail || 'Failed to update profile.'}`);
            }
        } catch (error) {
            setMessage('Error: Could not connect to the server.');
        }
    };

    if (isAuthLoading || isPageLoading) {
        return <div className="text-center p-10 text-lg font-semibold">Loading...</div>;
    }

    // Common class for all form inputs to ensure dark text
    const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900";

    return (
        <div className="bg-gray-50 py-12">
            <main className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg">
                        <div className="p-6 sm:p-8">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-gray-900">Your Health Profile</h1>
                                <p className="mt-2 text-sm text-gray-600">This information helps us provide a truly personalized analysis.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                                {/* Section 1: Biometrics */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Biometric Details</h2>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                                            <input type="number" name="age" id="age" value={profile.age} onChange={handleChange} className={inputClasses} />
                                        </div>
                                        <div>
                                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                                            <select name="gender" id="gender" value={profile.gender} onChange={handleChange} className={inputClasses}>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                            <input type="number" step="0.1" name="weight" id="weight" value={profile.weight} onChange={handleChange} className={inputClasses} />
                                        </div>
                                        <div>
                                            <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
                                            <input type="number" step="0.1" name="height" id="height" value={profile.height} onChange={handleChange} className={inputClasses} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Goals & Lifestyle */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Goals & Lifestyle</h2>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="activity_level" className="block text-sm font-medium text-gray-700">Activity Level</label>
                                            <select name="activity_level" id="activity_level" value={profile.activity_level} onChange={handleChange} className={inputClasses}>
                                                <option>Sedentary</option>
                                                <option>Light</option>
                                                <option>Moderate</option>
                                                <option>Active</option>
                                                <option>Very Active</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="primary_goal" className="block text-sm font-medium text-gray-700">Primary Goal</label>
                                            <select name="primary_goal" id="primary_goal" value={profile.primary_goal} onChange={handleChange} className={inputClasses}>
                                                <option>Maintain Weight</option>
                                                <option>Lose Weight</option>
                                                <option>Gain Muscle</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Conditions & Allergies */}
                                <div className="space-y-6">
                                    <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Health & Dietary Restrictions</h2>
                                    <div>
                                        <label htmlFor="health_conditions" className="block text-sm font-medium text-gray-700">Health Conditions (comma-separated)</label>
                                        <input type="text" name="health_conditions" id="health_conditions" placeholder="e.g., Hypertension, Diabetes" value={profile.health_conditions} onChange={handleChange} className={inputClasses} />
                                    </div>
                                    <div>
                                        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies (comma-separated)</label>
                                        <input type="text" name="allergies" id="allergies" placeholder="e.g., Peanuts, Gluten" value={profile.allergies} onChange={handleChange} className={inputClasses} />
                                    </div>
                                </div>

                                {/* Submission Section */}
                                <div className="pt-5">
                                    <div className="flex justify-between items-center">
                                        <Link href="/" className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300">
                                            &larr; Back to Home
                                        </Link>
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                        >
                                            Save Profile
                                        </button>
                                    </div>
                                    {message && (
                                        <p className={`mt-4 text-right text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                                            {message}
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

