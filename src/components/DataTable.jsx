import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DataTable = ({ data, onExport }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);

  const sortedData = [...data];
  if (sortColumn) {
    sortedData.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      // Try numeric sort first
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // Fallback to string sort
      const comparison = (aVal || '').toString().localeCompare((bVal || '').toString());
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const getSortIndicator = (column) => {
    if (sortColumn !== column) return ' ⇅';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="subsection-title">Filtered Results ({data.length} rows)</h3>
        <button
          onClick={onExport}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium"
        >
          📥 Export to CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((header) => (
                <th
                  key={header}
                  onClick={() => handleSort(header)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b dark:text-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {header}
                  <span className="text-gray-400">{getSortIndicator(header)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {columns.map((column, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                    title={row[column]}
                  >
                    {row[column] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  onExport: PropTypes.func.isRequired,
};

export default DataTable;
