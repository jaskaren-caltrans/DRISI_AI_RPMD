import React from 'react';
import PropTypes from 'prop-types';

const QueryInput = ({ value, onChange, onSubmit, isLoading, disabled }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && !isLoading && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your query (e.g., 'find projects with budget > 500000' or 'group by status')"
          className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
          rows="3"
        />
        <button
          onClick={onSubmit}
          disabled={disabled || isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed h-fit"
        >
          {isLoading ? 'Processing...' : 'Filter Data'}
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        💡 Tip: Use Ctrl+Enter to submit
      </p>
    </div>
  );
};

QueryInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

QueryInput.defaultProps = {
  isLoading: false,
  disabled: false,
};

export default QueryInput;
