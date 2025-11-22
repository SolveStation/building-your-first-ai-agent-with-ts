export const CONFIG = {
    MODEL_NAME : 'gemini-2.0-flash',
    TEMPERATURE : 0.7,
    MAX_TOKENS: 1000
} as const;


export function validateEnvironment():void{
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("GOOGLE_API_KEY environment variable is required")
        
    }
}