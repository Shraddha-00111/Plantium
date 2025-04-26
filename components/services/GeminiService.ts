import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import * as FileSystem from 'expo-file-system';

// Replace with your actual Gemini API key 
const API_KEY = "AIzaSyBbjfVgY_c913_Gh5KLsFDCVNjk1C8tBcQ";
const MODEL_NAME = "gemini-2.0-flash";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);

export interface DiagnosisResult {
  diseaseName: string;
  description: string;
  treatments: string[];
  isError: boolean;
}

// Utility function to convert image to base64
async function getImageBase64(imageUri: string): Promise<string> {
  try {
    // If the URI is already a base64 string, return it
    if (imageUri.startsWith('data:image')) {
      return imageUri.split(',')[1];
    }

    // For local file URIs, read and convert to base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

// Helper function to extract JSON from text that might include other content
function extractJsonFromText(text: string): any {
  try {
    // First try direct parsing
    return JSON.parse(text);
  } catch (e) {
    // Look for JSON-like structure in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        // Still couldn't parse
        return null;
      }
    }
    return null;
  }
}

// Real implementation that sends the image to Gemini API
export const analyzePlantImage = async (imageUri: string): Promise<DiagnosisResult> => {
  try {
    // Convert image to base64
    const base64Image = await getImageBase64(imageUri);
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // Create prompt with plant diagnosis instructions - make it extremely clear about JSON format
    const prompt = `
    You are a plant disease identification expert. Analyze this plant image and provide a detailed diagnosis.
    
    You MUST respond in VALID JSON format with the following structure:
    {
      "diseaseName": "Name of the disease or issue",
      "description": "Detailed description of the disease or issue, including symptoms visible in the image",
      "treatments": ["Treatment suggestion 1", "Treatment suggestion 2", "Treatment suggestion 3", "Treatment suggestion 4"]
    }

    If the plant appears healthy or you can't identify any disease, use:
    {
      "diseaseName": "Healthy Plant" or "Unidentified Plant",
      "description": "This plant appears healthy with no visible disease symptoms" or "Insufficient information to identify the plant or disease",
      "treatments": ["Regular watering", "Standard fertilization", "Normal care recommendations"]
    }

    IMPORTANT: Your response MUST be a VALID JSON object ONLY. Do not include any additional text, code blocks, or formatting.
    `;
    
    // Prepare image for the API
    const imagePart: Part = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };
    
    // Make the API call
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text().trim();
    
    console.log('Raw Gemini response:', text);
    
    // Try to extract JSON from the response
    const jsonResponse = extractJsonFromText(text);
    
    if (jsonResponse && jsonResponse.diseaseName && jsonResponse.description && Array.isArray(jsonResponse.treatments)) {
      // Successfully extracted valid JSON with all required fields
      return {
        diseaseName: jsonResponse.diseaseName,
        description: jsonResponse.description,
        treatments: jsonResponse.treatments,
        isError: false
      };
    } else {
      // Extract information from the text response in a more forgiving way
      console.log('Could not parse JSON response, attempting to extract information from text');
      
      // Try to extract disease name
      let diseaseName = "Analysis Result";
      if (text.includes("diseaseName") && text.includes(":")) {
        const diseaseNameMatch = text.match(/"diseaseName"\s*:\s*"([^"]+)"/);
        if (diseaseNameMatch && diseaseNameMatch[1]) {
          diseaseName = diseaseNameMatch[1];
        }
      }
      
      // Try to extract description
      let description = text.substring(0, 300) + (text.length > 300 ? "..." : "");
      if (text.includes("description") && text.includes(":")) {
        const descriptionMatch = text.match(/"description"\s*:\s*"([^"]+)"/);
        if (descriptionMatch && descriptionMatch[1]) {
          description = descriptionMatch[1];
        }
      }
      
      // Try to extract treatments
      let treatments = ["Contact a plant specialist for more information"];
      if (text.includes("treatments") && text.includes("[")) {
        const treatmentsSection = text.match(/"treatments"\s*:\s*\[(.*?)\]/s);
        if (treatmentsSection && treatmentsSection[1]) {
          const treatmentItems = treatmentsSection[1].match(/"([^"]+)"/g);
          if (treatmentItems && treatmentItems.length > 0) {
            treatments = treatmentItems.map(item => item.replace(/"/g, ''));
          }
        }
      }
      
      return {
        diseaseName,
        description,
        treatments,
        isError: false
      };
    }
  } catch (error) {
    console.error('Error analyzing image with Gemini API:', error);
    return {
      diseaseName: 'Error',
      description: 'Could not analyze the image. Please check your internet connection and try again.',
      treatments: [],
      isError: true
    };
  }
};

// Function to return mock data for testing without API key
function getMockResult(): DiagnosisResult {
  // Simulate API latency
  const mockResults = [
    {
      diseaseName: 'Powdery Mildew',
      description: 'A fungal disease that affects a wide range of plants, appearing as a white to gray powdery growth on leaves, stems, and flowers.',
      treatments: [
        'Apply a fungicide specifically labeled for powdery mildew.',
        'Prune affected areas to improve air circulation.',
        'Avoid overhead watering which can spread spores.',
        'Ensure plants have adequate spacing for airflow.'
      ],
      isError: false
    },
    {
      diseaseName: 'Leaf Spot',
      description: 'A common plant disease characterized by brown or black spots on leaves, caused by various fungi and bacteria.',
      treatments: [
        'Remove and dispose of affected leaves.',
        'Apply a copper-based fungicide.',
        'Improve air circulation around plants.',
        'Avoid wetting leaves when watering.'
      ],
      isError: false
    },
    {
      diseaseName: 'Root Rot',
      description: 'A condition that causes the roots to decay due to poor drainage or overwatering, leading to yellowing leaves and wilting.',
      treatments: [
        'Repot plant in fresh, well-draining soil.',
        'Reduce watering frequency.',
        'Ensure the pot has adequate drainage holes.',
        'Trim any damaged or rotting roots when repotting.'
      ],
      isError: false
    }
  ];
  
  // Return a random result for demonstration
  const randomIndex = Math.floor(Math.random() * mockResults.length);
  return mockResults[randomIndex];
} 