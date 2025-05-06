import { Client, ID } from "appwrite";
import { GoogleGenerativeAI } from "@google/generative-ai";

class AiService {
    client = new Client();
    databases;
    bucket;
    genAI;

    constructor() {
        this.client
            .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
            .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
        
        // Initialize Google Generative AI
        this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    }

    async generateSummary(title, content) {
        try {
            console.log('Generating summary for:', title);
            
            // Get the generative model
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            
            const prompt = `Analyze this blog post and provide exactly 5 key bullet points. Each bullet point should be concise and informative. Do not include any additional text or explanations. Just provide the 5 bullet points.

Post title: ${title}
Post content: ${content}

Format the response as:
- First bullet point
- Second bullet point
- Third bullet point
- Fourth bullet point
- Fifth bullet point`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            console.log('Raw Summary Text:', text);
            
            // Split the text into bullet points and clean them up
            const bulletPoints = text
                .split('\n')
                .filter(point => point.trim().startsWith('-') || point.trim().startsWith('•'))
                .map(point => point.replace(/^[-•]\s*/, '').trim())
                .filter(point => point.length > 0)
                .slice(0, 5); // Ensure we only get 5 points

            console.log('Processed Bullet Points:', bulletPoints);
            return bulletPoints;
        } catch (error) {
            console.error('Error in generateSummary:', error);
            throw error;
        }
    }
}

const aiService = new AiService();
export default aiService; 