import axios from 'axios';

export const fixGrammar = async (text: string): Promise<string> => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_GRAMMAR_API_URL || '',
      {
        inputs: {
          manuscript: text
        },
        version: "^1.0"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GRAMMAR_API_KEY}`
        }
      }
    );
    return response.data.outputs.improved_text;
  } catch (error) {
    console.error('Error fixing grammar:', error);
    throw error;
  }
};