// Simple tokenizer function
const tokenize = (text) => {
  return text.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(token => token.length > 0);
};

// Implement a simple similarity score function
const calculateSimilarity = (str1, str2) => {
  const set1 = new Set(tokenize(str1));
  const set2 = new Set(tokenize(str2));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
};

const getColumnStats = (data, columnName) => {
  const values = data.map(row => row[columnName]).filter(val => val !== null && val !== undefined && val.toString().trim() !== '');
  const count = values.length;
  const emptyCount = data.length - count;
  
  if (count === 0) return null;

  // Check if values are numeric and clean them
  const numericValues = values.map(v => {
    // Remove currency symbols and commas
    const cleaned = v.toString().replace(/[$,]/g, '');
    return parseFloat(cleaned);
  }).filter(n => !isNaN(n));
  if (numericValues.length > 0) {
    const sum = numericValues.reduce((a, b) => a + b, 0);
    const avg = sum / numericValues.length;
    const max = Math.max(...numericValues);
    const min = Math.min(...numericValues);
    return { count, sum, avg, max, min };
  }

  // For non-numeric values, calculate frequencies and patterns
  const uniqueValues = [...new Set(values)];
  const frequencies = uniqueValues.map(val => {
    const count = values.filter(v => v === val).length;
    const frequency = count / values.length;
    return {
      value: val,
      count,
      percentage: (frequency * 100).toFixed(1) + '%'
    };
  }).sort((a, b) => b.count - a.count);

  return { 
    count, 
    uniqueValues: uniqueValues.length, 
    mostCommon: frequencies[0],
    topValues: frequencies.slice(0, 5)
  };
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

const findRelevantColumns = (columns, query) => {
  return columns.map(column => {
    const similarity = calculateSimilarity(query, column);
    return { column, similarity };
  })
  .filter(item => item.similarity > 0.3)  // Lower threshold since we're using a simpler similarity measure
  .sort((a, b) => b.similarity - a.similarity)
  .map(item => item.column);
};

const processDateQuery = (query, data) => {
  const dateColumns = Object.keys(data[0]).filter(col => 
    col.toLowerCase().includes('date') || 
    col.toLowerCase().includes('time') ||
    col.toLowerCase().includes('deadline')
  );

  if (dateColumns.length === 0) return null;

  // Extract date ranges if present in query
  const dateRanges = query.match(/between\s+(\d{4}-\d{2}-\d{2})\s+and\s+(\d{4}-\d{2}-\d{2})/);
  if (dateRanges) {
    const [_, startDate, endDate] = dateRanges;
    const filteredData = data.filter(row => {
      const date = new Date(row[dateColumns[0]]);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
    return `Found ${filteredData.length} entries between ${startDate} and ${endDate}`;
  }

  // Default date analysis
  const stats = dateColumns.map(col => {
    const columnStats = getColumnStats(data, col);
    return `${col}:\n` +
      `- Earliest: ${columnStats.min}\n` +
      `- Latest: ${columnStats.max}\n` +
      `- Total entries: ${columnStats.count}`;
  }).join('\n\n');

  return stats;
};

const processAIQuery = async (text, selectedText = '', csvData = null) => {
  try {
    if (!csvData || csvData.length === 0) {
      return 'Please upload a CSV file first.';
    }

    const query = text.toLowerCase().trim();
    const columns = Object.keys(csvData[0]);

    // Handle range/comparison queries (e.g., "budget > 500000", "projects with budget between X and Y")
    const rangeMatch = query.match(/(?:show|find|list|get).*?(\w+)\s*(?:>|<|>=|<=|between|over|under|more than|less than)\s*([\d,]+)(?:\s*and\s*([\d,]+))?/i);
    if (rangeMatch) {
      const columnName = rangeMatch[1];
      const relevantColumn = columns.find(col => col.toLowerCase().includes(columnName.toLowerCase()));
      
      if (relevantColumn) {
        let filtered = csvData;
        const operator = query.includes('between') ? 'between' : 
                        query.includes('>') ? '>' :
                        query.includes('<') ? '<' :
                        query.includes('>=') ? '>=' :
                        query.includes('<=') ? '<=' :
                        query.includes('over') || query.includes('more than') ? '>' :
                        query.includes('under') || query.includes('less than') ? '<' : '=';
        
        const value1 = parseFloat(rangeMatch[2].replace(/,/g, ''));
        const value2 = rangeMatch[3] ? parseFloat(rangeMatch[3].replace(/,/g, '')) : null;
        
        filtered = csvData.filter(row => {
          const val = parseFloat(row[relevantColumn].toString().replace(/[$,]/g, ''));
          if (isNaN(val)) return false;
          
          if (operator === 'between') return val >= value1 && val <= value2;
          if (operator === '>') return val > value1;
          if (operator === '<') return val < value1;
          if (operator === '>=') return val >= value1;
          if (operator === '<=') return val <= value1;
          return false;
        });
        
        return `Found ${filtered.length} record${filtered.length !== 1 ? 's' : ''} matching criteria:\n` +
          filtered.slice(0, 10).map((row, idx) => 
            `${idx + 1}. ${Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(' | ')}`
          ).join('\n') +
          (filtered.length > 10 ? `\n... and ${filtered.length - 10} more records` : '');
      }
    }

    // Handle grouping queries (e.g., "group by manager", "count by status")
    const groupMatch = query.match(/(?:group|count|tally).*?by\s+(\w+)/i);
    if (groupMatch) {
      const columnName = groupMatch[1];
      const relevantColumn = columns.find(col => col.toLowerCase().includes(columnName.toLowerCase()));
      
      if (relevantColumn) {
        const grouped = {};
        csvData.forEach(row => {
          const key = row[relevantColumn] || 'Unknown';
          grouped[key] = (grouped[key] || 0) + 1;
        });
        
        const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
        return `Grouped by ${relevantColumn}:\n` +
          sorted.map(([key, count]) => `- ${key}: ${count}`).join('\n');
      }
    }

    // List specific column values
    if (query.match(/(?:list|show|get|what|name).*(?:all|the|every)/i)) {
      for (const column of columns) {
        if (query.toLowerCase().includes(column.toLowerCase().replace(/\s+/g, ''))) {
          const uniqueValues = [...new Set(csvData.map(row => row[column]).filter(Boolean))];
          return `${column} List:\n${uniqueValues.map(value => `- ${value}`).join('\n')}`;
        }
      }
      
      // Handle special cases like "managers" matching "Manager" column
      const specialMappings = {
        'managers': 'Manager',
        'projects': 'Project Name',
        'statuses': 'Status',
        'dates': ['Start Date', 'End Date']
      };
      
      for (const [term, columnName] of Object.entries(specialMappings)) {
        if (query.toLowerCase().includes(term)) {
          if (Array.isArray(columnName)) {
            // Handle multiple columns
            return columnName.map(col => {
              const uniqueValues = [...new Set(csvData.map(row => row[col]).filter(Boolean))];
              return `${col}:\n${uniqueValues.map(value => `- ${value}`).join('\n')}`;
            }).join('\n\n');
          } else {
            const uniqueValues = [...new Set(csvData.map(row => row[columnName]).filter(Boolean))];
            return `${columnName} List:\n${uniqueValues.map(value => `- ${value}`).join('\n')}`;
          }
        }
      }
    }

    // Direct budget query
    if (query.includes('budget')) {
      const budgetColumn = columns.find(col => col.toLowerCase() === 'budget');
      if (budgetColumn) {
        const stats = getColumnStats(csvData, budgetColumn);
        if (stats && 'avg' in stats) {
          return `Budget Analysis:\n` +
            `- Average: $${stats.avg.toFixed(2)}\n` +
            `- Total Budget: $${stats.sum.toFixed(2)}\n` +
            `- Minimum: $${stats.min.toFixed(2)}\n` +
            `- Maximum: $${stats.max.toFixed(2)}\n` +
            `- Number of Projects: ${stats.count}`;
        }
      }
    }
    
    // General numeric queries
    if (query.includes('average') || query.includes('mean') || query.includes('sum') || query.includes('total')) {
      const numericColumns = columns.filter(column => {
        const values = csvData.map(row => {
          const value = row[column];
          if (!value) return false;
          // Remove currency symbols and commas
          const cleaned = value.toString().replace(/[$,]/g, '');
          return !isNaN(parseFloat(cleaned));
        });
        return values.some(v => v);
      });

      const relevantColumns = findRelevantColumns(numericColumns, query);
      if (relevantColumns.length > 0) {
        const results = relevantColumns.map(column => {
          const stats = getColumnStats(csvData, column);
          if (stats && 'avg' in stats) {
            return `${column}:\n` +
              `- Average: $${stats.avg.toFixed(2)}\n` +
              `- Sum: $${stats.sum.toFixed(2)}\n` +
              `- Min: $${stats.min.toFixed(2)}\n` +
              `- Max: $${stats.max.toFixed(2)}\n` +
              `- Count: ${stats.count}`;
          }
          return null;
        }).filter(Boolean).join('\n\n');
        
        if (results) return results;
      }
    }
    
    // Handle common query types
    if (query.includes('how many') || query.includes('count')) {
      const relevantColumns = findRelevantColumns(columns, query);
      
      if (query.includes('project') || query.includes('total')) {
        return `Total number of projects/records: ${csvData.length}`;
      }
      
      if (relevantColumns.length > 0) {
        const results = relevantColumns.map(column => {
          const stats = getColumnStats(csvData, column);
          const breakdown = stats.topValues
            .map(term => `  - ${term.value}: ${term.count} (${term.percentage})`)
            .join('\n');
          
          return `${column}:\n` +
            `Total count: ${stats.count}\n` +
            `Unique values: ${stats.uniqueValues}\n` +
            `Most common: ${stats.mostCommon.value} (${stats.mostCommon.count} times)\n` +
            `Top values:\n${breakdown}`;
        }).join('\n\n');
        
        return results;
      }
    }

    // Handle status queries
    if (query.includes('status')) {
      const statusColumn = columns.find(col => col.toLowerCase() === 'status');
      if (statusColumn) {
        const uniqueStatuses = [...new Set(csvData.map(row => row[statusColumn]).filter(Boolean))];
        const statusCounts = uniqueStatuses.map(status => {
          const count = csvData.filter(row => row[statusColumn] === status).length;
          return `- ${status}: ${count} project${count !== 1 ? 's' : ''}`;
        });
        return `Status Distribution:\n${statusCounts.join('\n')}`;
      }
    }

    // Handle date queries
    if (query.includes('date') || query.includes('when')) {
      const dateColumns = columns.filter(col => 
        col.toLowerCase().includes('date') || 
        col.toLowerCase().includes('deadline')
      );
      
      if (dateColumns.length > 0) {
        return dateColumns.map(column => {
          const dates = csvData.map(row => new Date(row[column])).filter(date => !isNaN(date));
          if (dates.length > 0) {
            const earliest = new Date(Math.min(...dates));
            const latest = new Date(Math.max(...dates));
            return `${column}:\n` +
              `- Earliest: ${earliest.toLocaleDateString()}\n` +
              `- Latest: ${latest.toLocaleDateString()}\n` +
              `- Total Entries: ${dates.length}`;
          }
          return `${column}: No valid dates found`;
        }).join('\n\n');
      }
    }

    // Analyze selected text if present
    if (selectedText) {
      const relevantColumns = findRelevantColumns(columns, selectedText);
      if (relevantColumns.length > 0) {
        return `Analysis of selected text "${selectedText}":\n` +
          `Most relevant columns: ${relevantColumns.join(', ')}\n\n` +
          relevantColumns.map(col => {
            const stats = getColumnStats(csvData, col);
            return `${col} statistics:\n` +
              Object.entries(stats)
                .filter(([key]) => key !== 'significantTerms')
                .map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`)
                .join('\n');
          }).join('\n\n');
      }
    }

    // General analysis with semantic search
    const relevantColumns = findRelevantColumns(columns, query);
    if (relevantColumns.length > 0) {
      return `Found relevant columns: ${relevantColumns.join(', ')}\n\n` +
        relevantColumns.map(column => {
          const stats = getColumnStats(csvData, column);
          return `${column} Analysis:\n` +
            Object.entries(stats)
              .filter(([key]) => key !== 'significantTerms')
              .map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`)
              .join('\n');
        }).join('\n\n');
    }

    // Default response with improved suggestions
    return `Data Summary:\n` +
      `- Total records: ${csvData.length}\n` +
      `- Available columns: ${columns.join(', ')}\n\n` +
      `You can try:\n` +
      `- Asking about specific columns\n` +
      `- Counting or analyzing data\n` +
      `- Searching for dates or time periods\n` +
      `- Selecting text in the table to analyze specific values`;
  } catch (error) {
    console.error('Data Analysis Error:', error);
    return `Error analyzing data: ${error.message}`;
  }
};

export { processAIQuery };
