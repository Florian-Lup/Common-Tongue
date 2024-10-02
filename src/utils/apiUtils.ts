import axios from 'axios';

export const fixGrammar = async (text: string): Promise<string> => {
  try {
    const response = await axios.post('/api/fixGrammar', { text });
    return response.data.outputs.improved_text;
  } catch (error) {
    console.error('Error fixing grammar:', error);
    throw error;
  }
};