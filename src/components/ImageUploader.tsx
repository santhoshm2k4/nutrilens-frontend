"use client";

import { useRef, useState } from 'react';

interface ImageUploaderProps {
    onAnalyze: (file: File) => void;
    isLoading: boolean;
    disabled: boolean;
}

export default function ImageUploader({ onAnalyze, isLoading, disabled }: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAnalyzeClick = () => {
        if (selectedFile) {
            onAnalyze(selectedFile);
        }
    };

    return (
        <div className={`w-full max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg transition-all ${disabled ? 'bg-gray-200' : ''}`}>
            {imagePreview ? (
                // View when an image is selected
                <div className="text-center">
                    <img src={imagePreview} alt="Selected preview" className="max-h-60 mx-auto rounded-lg border border-gray-200" />
                    <div className="mt-6 flex justify-center gap-4">
                        <button
                            onClick={handleUploadClick}
                            disabled={isLoading || disabled}
                            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 disabled:bg-gray-300"
                        >
                            Change Image
                        </button>
                        <button
                            onClick={handleAnalyzeClick}
                            disabled={isLoading || disabled}
                            className="flex items-center justify-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : (
                                '✨ Analyze Now'
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                // Initial view before an image is selected
                <div
                    onClick={handleUploadClick}
                    className={`flex justify-center rounded-lg border-2 border-dashed ${disabled ? 'border-gray-300 cursor-not-allowed' : 'border-gray-400 hover:border-indigo-500 cursor-pointer'} px-6 py-10 transition-colors`}
                >
                    <div className="text-center">
                        {/* SVG Icon */}
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-4 text-sm font-semibold text-gray-700">
                            Click to upload an image
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, or WEBP
                        </p>
                        {disabled && (
                            <p className="mt-4 text-sm font-medium text-red-600">
                                Please log in to enable analysis.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                disabled={disabled}
            />
        </div>
    );
}