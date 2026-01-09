# DRISI AI Data Analysis Tool - User Guide

## Getting Started

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## How to Use

### 1. Upload CSV File
- Click on the file input field
- Select a `.csv` file from your computer
- The app will display the number of rows loaded and available columns

### 2. Available Columns
After uploading, you'll see all column names displayed as blue tags. Use these in your queries!

### 3. Query the Data

#### Simple Queries
- **"How many projects are there?"**
  - Returns total record count

- **"What is the average budget?"**
  - Calculates average of Budget column
  - Shows: Average, Total, Min, Max, Count

- **"Name all the managers"**
  - Lists all unique managers in the data

#### Advanced Queries

##### Range & Comparison
- **"Find projects with budget > 500000"**
- **"Show projects with cost between 100000 and 300000"**
- **"Find items with price under 50000"**

Supported operators:
- `>` greater than
- `<` less than
- `>=` greater than or equal
- `<=` less than or equal
- `between X and Y`
- Natural language: "over", "under", "more than", "less than"

##### Grouping
- **"Group by status"**
- **"Count by manager"**
- **"Tally by project type"**

Shows count for each group, sorted by frequency.

##### Categorical Analysis
- **"Show all projects"**
- **"List all statuses"**
- **"What are the managers?"**

##### Date Analysis
- **"What dates are in the data?"**
- **"Show me date ranges"**
- **"When did projects start?"**

---

## Features

### Filter Results
- Type your query in the text box
- Click "Filter Data" or press **Ctrl+Enter**
- Results appear in the table below

### Sort Results
- Click on any column header to sort
- Click again to reverse sort direction
- ↑ = ascending, ↓ = descending
- Numeric columns sort numerically
- Text columns sort alphabetically

### Export Results
- After filtering, click "📥 Export to CSV" button
- File downloads with name: `filtered-data-YYYY-MM-DD.csv`
- Can be opened in Excel or any spreadsheet app

### AI Assistant
- **Floating panel** in bottom-right corner
- Provides intelligent analysis of your data
- Supports both table-based and text responses
- Select text in table to analyze specific values

**View Modes:**
- **Enhanced**: Structured card-based display
- **Classic**: Original text format

---

## Query Tips & Tricks

### 1. Partial Column Matching
Don't need exact column names!
- Column: "Project Manager"
- You can type: "manager", "project", "proj manager"
- All will match!

### 2. Case Insensitive
All queries are case-insensitive
- "BUDGET", "budget", "Budget" all work

### 3. Keyboard Shortcuts
- **Ctrl+Enter** in query box = Submit query
- Makes filtering faster!

### 4. Empty Values
Missing/empty values display as **—** in tables
- Not filtered out, just displayed clearly

### 5. Large Numbers
Format: Can include commas, $ signs
- "1,000,000" or "$1,000,000" both work
- Automatically parsed correctly

---

## Example Workflow

### Scenario: Analyzing Project Data

```
1. Upload your project CSV file
   ✓ Shows "8 rows loaded"
   
2. See available columns
   ✓ Project Name, Status, Start Date, End Date, Budget, Manager

3. Ask questions:
   Q: "What is the average budget?"
   A: Displays all budget statistics
   
4. Filter data:
   Q: "Find projects with budget > 500000"
   Displays: Highway Safety Research ($500,000), Environmental Impact Study ($600,000)
   
5. Group and analyze:
   Q: "Group by status"
   A: Shows breakdown of each status type
   
6. Export results:
   Click "Export to CSV" button
   ✓ Downloads filtered results as CSV file
```

---

## Troubleshooting

### File won't upload
- **Issue**: "Please select a valid CSV file"
- **Solution**: 
  - Check file format is `.csv` (not `.xlsx` or `.xls`)
  - Try opening and re-saving as CSV in Excel
  - Check for special characters in filenames

### Query returns no results
- **Issue**: Query shows "Data Summary" instead of results
- **Solution**:
  - Check column names in blue tags
  - Try simpler query: "How many records?"
  - Verify data contains expected values

### AI Assistant not responding
- **Issue**: No response or "error analyzing data"
- **Solution**:
  - Ensure CSV file is fully loaded
  - Try a simpler query first
  - Check browser console (F12) for errors

### Export button missing
- **Issue**: Can't see "Export to CSV" button
- **Solution**:
  - Filter data first (button only appears with results)
  - Scroll right if on mobile
  - Try resizing window

---

## Data Quality Considerations

### Best Practices
✅ Use clear column headers
✅ Keep consistent data formats
✅ Use standard date formats (YYYY-MM-DD)
✅ Numbers without currency symbols for calculations
✅ Remove extra spaces in data

### Avoid
❌ Merged cells
❌ Multiple header rows
❌ Special characters in column names
❌ Mixed data types in columns

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Submit query |
| Click column header | Sort column |
| Click "Export to CSV" | Download results |

---

## Data Privacy

- ✅ All data stays in your browser
- ✅ No data sent to servers
- ✅ No tracking or analytics
- ✅ Works offline (after initial load)

---

## Support

For issues or feature requests, contact:
- Email: support@caltrans.gov
- GitHub: github.com/jaskaren-caltrans/DRISI_AI_RPMD

---

## Version Info

- **Current Version**: 1.0.0
- **Framework**: React 18.2
- **Build Tool**: Vite 7.1
- **Last Updated**: January 2026

---

Happy analyzing! 📊🚀
