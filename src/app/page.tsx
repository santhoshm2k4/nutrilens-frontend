"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import ResultsDisplay from "@/components/ResultsDisplay";
import type { AnalysisData } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (file: File) => {
    if (!token) {
      setError("You must be logged in to perform an analysis.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/analyze-label/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get a response from the server.');
      }
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <main
      className="flex items-center justify-center bg-gray-50 px-4"
      style={{ minHeight: 'calc(100vh - 4rem)' }}
    >
      {/* This single container holds all content and is centered */}
      <div className="w-full max-w-3xl py-12">
        {/* Conditional rendering for the analysis results */}
        {analysis ? (
          <ResultsDisplay analysisData={analysis} onReset={handleReset} />
        ) : (
          // This div groups the title and uploader together
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Understand Your Food
            </h1>
            {user ? (
              <p className="mt-4 max-w-xl mx-auto text-lg text-gray-600">
                Welcome back! Upload a food label to get your instant, personalized analysis.
              </p>
            ) : (
              <p className="mt-4 max-w-xl mx-auto text-lg text-gray-600">
                Sign up or log in to unlock personalized insights and make healthier choices with confidence.
              </p>
            )}

            {/* The uploader is now nested here */}
            <div className="mt-8 max-w-2xl mx-auto">
              <ImageUploader onAnalyze={handleAnalysis} isLoading={isLoading} disabled={!user} />
            </div>

            {error && (
              <div className="mt-4 p-4 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-semibold">An Error Occurred</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}