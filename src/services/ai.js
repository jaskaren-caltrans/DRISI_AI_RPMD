import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.VITE_HUGGINGFACE_TOKEN || 'hf_dummy_token');

export const processAIQuery = async (text, selectedText = '') => {
  try {
    const prompt = `Context: ${selectedText}\nQuestion: ${text}\nAnswer:`;
    
    const response = await hf.textGeneration({
      model: 'meta-llama/Llama-2-7b-chat-hf',
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.15
      }
    });

    return response.generated_text;
  } catch (error) {
    console.error('AI Processing Error:', error);
    return 'Sorry, I encountered an error processing your request.';
  }
};
