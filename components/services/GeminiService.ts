import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import * as FileSystem from 'expo-file-system';

// Replace with your actual Gemini API key 
const API_KEY = "AIzaSyBbjfVgY_c913_Gh5KLsFDCVNjk1C8tBcQ";
const MODEL_NAME = "gemini-2.0-flash";
const IMAGE_MODEL_NAME = "gemini-1.5-pro-vision";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(API_KEY);

export interface DiagnosisResult {
  diseaseName: string;
  description: string;
  treatments: string[];
  isError: boolean;
  plantName?: string;
  scientificName?: string;
  genus?: string;
  family?: string;
  careInstructions?: {
    watering?: string;
    light?: string;
    soil?: string;
    temperature?: string;
    humidity?: string;
  };
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
        console.log("Found JSON-like structure but couldn't parse it:", jsonMatch[0]);
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
    You are a plant disease identification expert. Analyze this plant image and provide a concise diagnosis.
    
    You MUST respond in VALID JSON format with the following structure and BE VERY CONCISE:
    I need the following information in JSON format:
    1. Plant identification (name, scientific name, genus, family)
    2. If there is any disease, identify it and provide:
       - Disease name
       - Symptoms (2-3 sentences max)
       - Causes (1-2 sentences max)
       - Treatment/Cure (brief bullet points, 5-10 words each)
    3. General care information for this plant (1-2 sentences per category max)
    
    Format your response like this (valid JSON without markdown decorations):
    {
      "plant": {
        "name": "Plant common name",
        "scientificName": "Scientific name",
        "genus": "Genus",
        "family": "Family name"
      },
      "isHealthy": true/false,
      "disease": {
        "name": "Disease name (if any)",
        "symptoms": "Brief list of symptoms (2-3 sentences max)",
        "causes": "Brief causes (1-2 sentences max)",
        "treatment": "Brief treatment steps"
      },
      "care": {
        "watering": "Brief watering instructions (1-2 sentences)",
        "light": "Brief light requirements (1-2 sentences)",
        "soil": "Brief soil preference (1-2 sentences)",
        "temperature": "Temperature range (1 sentence)",
        "humidity": "Humidity level (1 sentence)",
        "fertilizing": "Brief fertilizing instructions (1 sentence)"
      }
    }

    IMPORTANT: Your response MUST be a VALID JSON object ONLY. All descriptions should be very concise and to the point. Avoid long, detailed explanations. Keep all text fields short and focused on key information only.
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
    
    if (jsonResponse) {
      console.log('Successfully parsed JSON response');
      
      // Convert the new JSON structure to our DiagnosisResult interface
      const disease = jsonResponse.disease || {};
      const plant = jsonResponse.plant || {};
      const care = jsonResponse.care || {};
      
      // Extract treatments from the disease treatment field
      let treatments: string[] = [];
      if (disease.treatment) {
        // If treatment is a string, split it into an array
        if (typeof disease.treatment === 'string') {
          treatments = disease.treatment
            .split(/[.;\n]/) // Split by periods, semicolons, or new lines
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0);
        } else if (Array.isArray(disease.treatment)) {
          treatments = disease.treatment;
        }
      }
      
      // Ensure we have at least one treatment
      if (treatments.length === 0) {
        treatments = ["Follow general plant care guidelines"];
      }
      
      // Create a comprehensive description combining disease info and health status
      let description = '';
      if (jsonResponse.isHealthy === false && disease.symptoms) {
        description = `${disease.symptoms}\n\nCauses: ${disease.causes || 'Unknown'}`;
      } else if (jsonResponse.isHealthy === true) {
        description = "This plant appears to be healthy with no visible disease symptoms.";
      } else {
        description = disease.symptoms || "Unable to determine detailed plant health status.";
      }
      
      return {
        diseaseName: disease.name || (jsonResponse.isHealthy ? "Healthy Plant" : "Unidentified Issue"),
        description: description,
        treatments: treatments,
        isError: false,
        plantName: plant.name,
        scientificName: plant.scientificName,
        genus: plant.genus,
        family: plant.family,
        careInstructions: {
          watering: care.watering,
          light: care.light,
          soil: care.soil,
          temperature: care.temperature,
          humidity: care.humidity
        }
      };
    } else {
      // Extract information from the text response in a more forgiving way
      console.log('Could not parse JSON response, attempting to extract information using regex');
      
      // Try to extract plant name
      let plantName = "Unknown Plant";
      let scientificName = "";
      const plantNameMatch = text.match(/"name"\s*:\s*"([^"]+)"/);
      if (plantNameMatch && plantNameMatch[1]) {
        plantName = plantNameMatch[1];
      }
      
      const scientificNameMatch = text.match(/"scientificName"\s*:\s*"([^"]+)"/);
      if (scientificNameMatch && scientificNameMatch[1]) {
        scientificName = scientificNameMatch[1];
      }
      
      // Try to extract disease name
      let diseaseName = "Analysis Result";
      const diseaseNameMatch = text.match(/"name"\s*:\s*"([^"]+)"/);
      if (diseaseNameMatch && diseaseNameMatch[1] && text.includes("disease")) {
        diseaseName = diseaseNameMatch[1];
      }
      
      // Try to extract disease symptoms/description
      let description = "";
      const symptomsMatch = text.match(/"symptoms"\s*:\s*"([^"]+)"/);
      if (symptomsMatch && symptomsMatch[1]) {
        description = symptomsMatch[1];
      } else {
        // If no symptoms found, extract a portion of the text for description
        description = text.substring(0, 300) + (text.length > 300 ? "..." : "");
      }
      
      // Try to extract treatments
      let treatments: string[] = ["Contact a plant specialist for more information"];
      const treatmentMatch = text.match(/"treatment"\s*:\s*"([^"]+)"/);
      if (treatmentMatch && treatmentMatch[1]) {
        treatments = treatmentMatch[1]
          .split(/[.;\n]/) // Split by periods, semicolons, or new lines
          .map((t: string) => t.trim())
          .filter((t: string) => t.length > 0);
      }
      
      // Try to extract care information
      let careInstructions: any = {};
      
      const wateringMatch = text.match(/"watering"\s*:\s*"([^"]+)"/);
      if (wateringMatch && wateringMatch[1]) {
        careInstructions.watering = wateringMatch[1];
      }
      
      const lightMatch = text.match(/"light"\s*:\s*"([^"]+)"/);
      if (lightMatch && lightMatch[1]) {
        careInstructions.light = lightMatch[1];
      }
      
      return {
        diseaseName,
        description,
        treatments,
        isError: false,
        plantName,
        scientificName,
        genus: undefined,
        family: undefined,
        careInstructions
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
      isError: false,
      plantName: 'Rose',
      scientificName: 'Rosa sp.',
      genus: 'Rosa',
      family: 'Rosaceae',
      careInstructions: {
        watering: 'Water deeply but infrequently',
        light: 'Full sun to partial shade',
        soil: 'Well-draining, rich soil',
        temperature: '65-75°F (18-24°C)',
        humidity: 'Moderate'
      }
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
      isError: false,
      plantName: 'Philodendron',
      scientificName: 'Philodendron sp.',
      genus: 'Philodendron',
      family: 'Araceae',
      careInstructions: {
        watering: 'Allow soil to dry out between waterings',
        light: 'Bright, indirect light',
        soil: 'Well-draining potting mix',
        temperature: '65-80°F (18-27°C)',
        humidity: 'High'
      }
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
      isError: false,
      plantName: 'Snake Plant',
      scientificName: 'Sansevieria trifasciata',
      genus: 'Sansevieria',
      family: 'Asparagaceae',
      careInstructions: {
        watering: 'Allow soil to dry completely between waterings',
        light: 'Low to bright indirect light',
        soil: 'Well-draining, sandy soil',
        temperature: '70-90°F (21-32°C)',
        humidity: 'Low to moderate'
      }
    }
  ];
  
  // Return a random result for demonstration
  const randomIndex = Math.floor(Math.random() * mockResults.length);
  return mockResults[randomIndex];
}

// Function to generate plant image URLs for the carousel
export const generatePlantImageUrls = async (plantName: string, count: number = 3): Promise<string[]> => {
  // Default fallback images if API fails
  const defaultImages = [
    'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGxhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1446071103084-c257b5f70672?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGxhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBsYW50fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  ];

  if (!plantName) return defaultImages;
  
  try {
    // Use the model to generate image URLs
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
      Find ${count} high-quality free stock images of the plant "${plantName}".
      Return ONLY a valid JSON array of image URLs, nothing else.
      Example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
      
      Use high-quality images from sources like Unsplash, Pexels, or Pixabay.
      Ensure the images are:
      1. High resolution
      2. Clear photos of the actual plant
      3. Publicly accessible URLs
      4. Directly link to the image file (.jpg, .png, etc.)
      
      IMPORTANT: Your response must be ONLY a valid JSON array of strings, nothing else.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Try to parse the response as JSON
    try {
      const jsonResponse = JSON.parse(text);
      
      if (Array.isArray(jsonResponse) && jsonResponse.length > 0) {
        return jsonResponse.slice(0, count);
      } else {
        // If we got valid JSON but not an array, or an empty array
        console.log('Invalid image URL format from API:', jsonResponse);
        return defaultImages;
      }
    } catch (error) {
      // If we couldn't parse the JSON, try to extract URLs using regex
      console.log('Error parsing image URLs JSON:', error);
      
      const urlRegex = /(https?:\/\/[^\s"']+\.(jpg|jpeg|png|webp))/g;
      const matches = text.match(urlRegex);
      
      if (matches && matches.length > 0) {
        return matches.slice(0, count);
      } else {
        return defaultImages;
      }
    }
  } catch (error) {
    console.error('Error generating image URLs:', error);
    return defaultImages;
  }
};

// Generate a plant image using Gemini
export const generatePlantImage = async (plantName: string, diseaseDescription?: string): Promise<string> => {
  try {
    // Fallback image in case generation fails
    const fallbackImage = 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?ixlib=rb-4.0.3';
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: IMAGE_MODEL_NAME });
    
    // Create a detailed prompt for realistic plant image
    let prompt = `Generate a realistic, high-quality image of a ${plantName} plant.`;
    
    // If disease info is provided, include it in the prompt
    if (diseaseDescription) {
      prompt += ` Show the plant with signs of ${diseaseDescription}.`;
    } else {
      prompt += ' Show a healthy specimen with clear detail of leaves and overall structure.';
    }
    
    prompt += ' The image should be photorealistic, well-lit, and suitable as a reference image.';
    
    // Make the API call to generate the image
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Extract image data from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          // Return the base64 image data with appropriate prefix
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    // If we couldn't extract an image, return the fallback
    console.log('No image data found in response, using fallback image');
    return fallbackImage;
  } catch (error) {
    console.error('Error generating plant image:', error);
    return 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?ixlib=rb-4.0.3';
  }
}; 