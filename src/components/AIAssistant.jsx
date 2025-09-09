import React, { useState } from 'react';
import { processAIQuery } from '../services/ai';

const AIAssistant = ({ selectedText, csvData }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug information
  console.log('AIAssistant props:', { 
    hasSelectedText: !!selectedText, 
    selectedTextLength: selectedText?.length,
    hasCsvData: !!csvData,
    csvDataLength: csvData?.length 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!csvData) {
        throw new Error('Please upload a CSV file first');
      }
      console.log('Submitting query with data:', {
        queryLength: query.length,
        csvDataRows: csvData?.length,
        selectedTextLength: selectedText?.length
      });
      const result = await processAIQuery(query, selectedText, csvData);
      setResponse(result);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error.message);
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white shadow-lg rounded-lg p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about the selected text..."
            className="w-full p-2 border rounded-md"
            rows="3"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Ask AI'}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}
      {response && !error && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
