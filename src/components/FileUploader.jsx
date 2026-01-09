import React from 'react';
import PropTypes from 'prop-types';

const FileUploader = ({ onUpload, data, columns }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="subsection-title">Upload CSV File</h3>
        <input
          type="file"
          accept=".csv"
          onChange={onUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {data && (
          <p className="text-sm text-green-600 mt-2 dark:text-green-400">
            ✓ CSV file loaded with {data.length} rows
          </p>
        )}
      </div>

      {data && columns && columns.length > 0 && (
        <>
          <div className="h-px bg-gray-200/80 dark:bg-gray-700/50" />
          <div>
            <h3 className="subsection-title">Available Columns</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/30 dark:border-blue-800">
              <p className="text-sm text-blue-800 mb-3 dark:text-blue-200">
                Use these column names in your queries (partial matching supported):
              </p>
              <div className="flex flex-wrap gap-2">
                {columns.map((header, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full border border-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:border-blue-700"
                  >
                    {header}
                  </span>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-3 dark:text-blue-300">
                💡 Tip: Try queries like "find projects with budget &gt; 500000" or "group by status"
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

FileUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.string),
};

export default FileUploader;
