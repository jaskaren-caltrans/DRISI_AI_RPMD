import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { processAIQuery } from '../services/ai';

const AIAssistant = ({ selectedText, csvData }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('enhanced'); // 'enhanced' or 'classic'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!csvData) {
        throw new Error('Please upload a CSV file first');
      }
      console.log('CSV Data:', csvData);
      console.log('Query:', query);
      const result = await processAIQuery(query, selectedText, csvData);
      console.log('AI Response:', result);
      setResponse(result);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error.message);
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Convert response text to structured data when possible
  const parseResponse = (text) => {
    const lines = text.split('\n');
    const data = [];
    let currentSection = null;

    for (const line of lines) {
      if (line.endsWith(':')) {
        currentSection = {
          title: line.slice(0, -1),
          items: []
        };
        data.push(currentSection);
      } else if (line.startsWith('- ') && currentSection) {
        const [key, ...valueParts] = line.slice(2).split(':');
        const value = valueParts.join(':').trim();
        currentSection.items.push({ key, value });
      } else if (line.trim() && !currentSection) {
        data.push({ title: 'Results', items: [{ key: '', value: line }] });
      }
    }

    return data;
  };

  const renderEnhancedView = () => {
    if (!response) return null;
    
    const parsedData = parseResponse(response);
    
    return (
      <div className="mt-4 space-y-4">
        {parsedData.map((section, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="px-4 py-3 flex justify-between items-start">
                  <span className="text-sm text-gray-600">{item.key}</span>
                  <span className="text-sm font-medium text-gray-900 ml-4">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderClassicView = () => {
    if (!response) return null;
    
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <pre className="whitespace-pre-wrap text-sm">{response}</pre>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 w-[28rem] bg-white shadow-xl rounded-lg p-4 border border-gray-200 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10">
        <h2 className="text-lg font-semibold text-gray-700">AI Assistant</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('enhanced')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === 'enhanced'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Enhanced
          </button>
          <button
            onClick={() => setActiveTab('classic')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === 'classic'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Classic
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={selectedText ? "Ask about the selected text..." : "Ask about the data..."}
            className="w-full p-3 border rounded-lg pr-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 bottom-2 bg-blue-500 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Ask AI'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {response && !error && (
        <div className="mt-4 max-h-[400px] overflow-y-auto">
          {activeTab === 'enhanced' ? renderEnhancedView() : renderClassicView()}
        </div>
      )}
    </div>
  );
};

AIAssistant.propTypes = {
  selectedText: PropTypes.string,
  csvData: PropTypes.arrayOf(PropTypes.object),
};

AIAssistant.defaultProps = {
  selectedText: '',
  csvData: null,
};

export default AIAssistant;
