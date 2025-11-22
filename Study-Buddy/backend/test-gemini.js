// Quick Gemini API test
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('Testing Gemini API...');
  console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
  console.log('API Key (first 10 chars):', process.env.GEMINI_API_KEY?.substring(0, 10));

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    console.log('\nSending test request...');
    const result = await model.generateContent('Say hello');
    const response = await result.response;
    const text = response.text();

    console.log('\nSUCCESS!');
    console.log('Response:', text);
  } catch (error) {
    console.log('\nFAILED!');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

testGemini();
