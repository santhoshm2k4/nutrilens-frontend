"use client";

import type { AnalysisData, ConItem } from '@/types';

interface ResultsDisplayProps {
    analysisData: AnalysisData;
    onReset: () => void;
}

const getRatingColor = (rating?: string) => {
    switch (rating?.toUpperCase()) {
        case 'A': return 'bg-green-500 text-white';
        case 'B': return 'bg-lime-500 text-white';
        case 'C': return 'bg-yellow-400 text-black';
        case 'D': return 'bg-orange-500 text-white';
        case 'F': return 'bg-red-500 text-white';
        default: return 'bg-gray-400 text-white';
    }
};

export default function ResultsDisplay({ analysisData, onReset }: ResultsDisplayProps) {
    return (
        // Main container with a wider max-width for the new layout
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 animate-fade-in">

            {/* Header Section */}
            <div className="text-center border-b pb-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{analysisData.product_name || "Product Analysis"}</h2>
                {analysisData.health_rating && (
                    <div className="mt-3">
                        <span className={`inline-block px-4 py-1 font-bold rounded-full text-lg ${getRatingColor(analysisData.health_rating)}`}>
                            Health Rating: {analysisData.health_rating}
                        </span>
                    </div>
                )}
            </div>

            {/* Main Content Grid: 2 columns on medium screens and up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Left Column: Personalized Summary */}
                <div className="space-y-4">
                    {analysisData.summary && (
                        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg h-full">
                            <h3 className="text-md font-semibold text-indigo-800 mb-2">📝 Personalized Summary</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">{analysisData.summary}</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Pros and Cons */}
                <div className="space-y-4">
                    {/* Positive Aspects Card */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-md font-semibold text-green-800 mb-2">✅ Positive Aspects</h3>
                        {analysisData.pros && analysisData.pros.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
                                {analysisData.pros.map((pro, index) => (
                                    <li key={index}>{pro}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-gray-500">No positive aspects identified.</p>
                        )}
                    </div>

                    {/* Points to Consider Card */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h3 className="text-md font-semibold text-red-800 mb-2">❌ Points to Consider</h3>
                        {analysisData.cons && analysisData.cons.length > 0 ? (
                            <ul className="space-y-2">
                                {analysisData.cons.map((con: ConItem, index) => (
                                    <li key={index} className="text-xs text-gray-700">
                                        <span className="font-semibold capitalize">{con.nutrient.replace(/_/g, ' ')} is {con.level} ({con.value})</span>
                                        <p className="italic text-gray-600 mt-1">{con.reasoning}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-gray-500">No points to consider identified.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="pt-6 mt-6 border-t text-center space-y-3">
                <button
                    onClick={onReset}
                    className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                    Analyze Another Image
                </button>
                <p className="text-xs text-gray-400">
                    *Analysis is based on general dietary guidelines from the WHO & FSSAI. This is not medical advice.
                </p>
            </div>
        </div>
    );
}