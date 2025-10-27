// Defines the shape of the objects in the 'cons' array
export interface ConItem {
    nutrient: string;
    level: string;
    source: string;
    reasoning: string;
    value: string;
}

// Defines the shape of the nutrient level objects
export interface NutrientLevel {
    level: string;
    source: string;
    reasoning?: string; // Reasoning is optional here
}

// The main interface for the entire analysis object
export interface AnalysisData {
    product_name?: string;
    summary?: string;
    health_rating?: string;
    pros?: string[];
    cons?: ConItem[]; // Updated from string[] to ConItem[]
    ingredients_analysis?: Record<string, string | null>;
    nutrient_levels?: Record<string, NutrientLevel>;
}
