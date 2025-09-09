const getColumnStats = (data, columnName) => {
  const values = data.map(row => row[columnName]).filter(val => val && val.toString().trim());
  const count = values.length;
  
  if (count === 0) return null;

  // Check if values are numeric
  const numericValues = values.map(v => parseFloat(v)).filter(n => !isNaN(n));
  if (numericValues.length > 0) {
    const sum = numericValues.reduce((a, b) => a + b, 0);
    const avg = sum / numericValues.length;
    const max = Math.max(...numericValues);
    const min = Math.min(...numericValues);
    return { count, sum, avg, max, min };
  }

  // For non-numeric values
  const uniqueValues = [...new Set(values)];
  const frequencies = uniqueValues.map(val => ({
    value: val,
    count: values.filter(v => v === val).length
  })).sort((a, b) => b.count - a.count);

  return { count, uniqueValues: uniqueValues.length, mostCommon: frequencies[0] };
};

const countByColumn = (data, columnName) => {
  const counts = {};
  data.forEach(row => {
    const value = row[columnName];
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  return counts;
};

const processAIQuery = async (text, selectedText = '', csvData = null) => {
  try {
    if (!csvData || csvData.length === 0) {
      return 'Please upload a CSV file first.';
    }

    const query = text.toLowerCase();
    const columns = Object.keys(csvData[0]);
    
    // Handle common queries
    if (query.includes('how many') || query.includes('count')) {
      if (query.includes('project') || query.includes('total')) {
        return `Total number of projects/records: ${csvData.length}`;
      }
      
      // Try to find relevant column for counting
      for (const column of columns) {
        if (query.includes(column.toLowerCase())) {
          const counts = countByColumn(csvData, column);
          const countsStr = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([value, count]) => `${value}: ${count}`)
            .join('\n');
          return `Counts for ${column}:\n${countsStr}`;
        }
      }
    }

    if (query.includes('statistics') || query.includes('analyze')) {
      const stats = columns.map(column => {
        const columnStats = getColumnStats(csvData, column);
        if (!columnStats) return null;
        
        if ('avg' in columnStats) {
          return `${column}:\n` +
            `- Count: ${columnStats.count}\n` +
            `- Average: ${columnStats.avg.toFixed(2)}\n` +
            `- Min: ${columnStats.min}\n` +
            `- Max: ${columnStats.max}`;
        } else {
          return `${column}:\n` +
            `- Total entries: ${columnStats.count}\n` +
            `- Unique values: ${columnStats.uniqueValues}\n` +
            `- Most common: ${columnStats.mostCommon.value} (${columnStats.mostCommon.count} times)`;
        }
      }).filter(Boolean).join('\n\n');
      
      return `Data Analysis:\n${stats}`;
    }

    // Handle status-related queries
    if (query.includes('status')) {
      const statusColumn = columns.find(col => col.toLowerCase().includes('status'));
      if (statusColumn) {
        const stats = countByColumn(csvData, statusColumn);
        const statsStr = Object.entries(stats)
          .sort((a, b) => b[1] - a[1])
          .map(([status, count]) => `${status}: ${count} projects`)
          .join('\n');
        return `Project Status Breakdown:\n${statsStr}`;
      }
    }

    // Handle date-related queries
    if (query.includes('date') || query.includes('when')) {
      const dateColumn = columns.find(col => 
        col.toLowerCase().includes('date') || 
        col.toLowerCase().includes('time') ||
        col.toLowerCase().includes('deadline')
      );
      if (dateColumn) {
        const stats = getColumnStats(csvData, dateColumn);
        return `Date Analysis for ${dateColumn}:\n` +
          `- Earliest: ${stats.min}\n` +
          `- Latest: ${stats.max}\n` +
          `- Total entries: ${stats.count}`;
      }
    }

    // Default response with basic data summary
    return `Data Summary:\n` +
      `- Total records: ${csvData.length}\n` +
      `- Available columns: ${columns.join(', ')}\n\n` +
      `You can ask questions about:\n` +
      `- Counts and totals\n` +
      `- Statistics for specific columns\n` +
      `- Project status\n` +
      `- Dates and deadlines`;

  } catch (error) {
    console.error('Data Analysis Error:', error);
    return `Error analyzing data: ${error.message}`;
  }
};

export { processAIQuery };
