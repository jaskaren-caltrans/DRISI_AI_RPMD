# AI Assistant Query Reference Guide

This guide shows all the types of queries you can ask the AI Assistant to analyze your CSV data.

---

## 📊 Budget & Cost Analysis Queries

Analyze budget, cost, or financial data in your dataset.

### Examples:
- `What is the average budget?`
- `Show me the total budget`
- `What's the budget breakdown?`
- `Average cost per project`
- `Minimum and maximum budget`

**Returns:**
- Average budget
- Total budget sum
- Minimum budget
- Maximum budget
- Number of projects/records

---

## 🔢 Range & Comparison Queries

Filter data by numeric ranges or comparisons.

### Format:
`[Show/Find/List/Get] [column name] [operator] [number]`

### Operators:
- `>` - Greater than
- `<` - Less than
- `>=` - Greater than or equal to
- `<=` - Less than or equal to
- `between` - Within a range
- `over` - Greater than
- `under` - Less than
- `more than` - Greater than
- `less than` - Less than

### Examples:
- `Show projects with budget > 500000`
- `Find all projects with budget < 100000`
- `List projects between 200000 and 500000`
- `Get records with budget >= 1000000`
- `Show all projects over $750,000`
- `Find projects under $250,000`

**Returns:**
- Number of matching records
- First 10 results (with all columns)
- "... and X more records" if more than 10 results

---

## 📈 Grouping & Aggregation Queries

Group data by a specific column and count occurrences.

### Format:
`[Group/Count/Tally] [data] by [column name]`

### Examples:
- `Group by manager`
- `Group by status`
- `Count by project type`
- `Tally by department`
- `Show count by manager`
- `Group projects by status`

**Returns:**
- Column name followed by grouped values
- Count for each group
- Results sorted by count (highest first)

---

## 📝 List & Enumeration Queries

Get a complete list of unique values in a column.

### Format:
`[List/Show/Get/Name] [all/the/every] [column name]`

### Examples:
- `List all managers`
- `Show all projects`
- `Name all statuses`
- `Get all project types`
- `What are all the departments?`
- `Show every project name`

**Special Mappings:**
- `managers` → finds Manager column
- `projects` → finds Project Name column
- `statuses` → finds Status column
- `dates` → finds Start Date, End Date columns

**Returns:**
- Column name header
- Bullet list of all unique values

---

## 📅 Date & Time Queries

Analyze date-based columns in your data.

### Examples:
- `Show date ranges`
- `What are the dates?`
- `When is the earliest project?`
- `What's the latest deadline?`
- `Projects between 2024-01-01 and 2024-12-31`
- `List all start dates`

**Returns:**
- Earliest date
- Latest date
- Total number of dated entries
- Date analysis by column (Start Date, End Date, etc.)

---

## 📊 Status Distribution Queries

Analyze status values and their distribution.

### Examples:
- `What is the status distribution?`
- `Show status breakdown`
- `How many projects are active?`
- `Count by status`
- `Status summary`

**Returns:**
- Each status value
- Number of projects with that status
- Singular/plural form of "project"

---

## 🔢 Count & Statistics Queries

Get overall statistics and counts.

### Examples:
- `How many projects are there?`
- `How many records in the dataset?`
- `Total count of projects`
- `What's the total number of entries?`
- `How many rows in the data?`

**Returns:**
- Total number of records
- Available columns for further analysis

---

## 📉 Average, Sum & Aggregate Queries

Calculate averages, sums, and other statistics for numeric columns.

### Format:
`[What is/Show/Calculate] the [average/mean/sum/total] [column name]?`

### Examples:
- `What is the average budget?`
- `Show the sum of all budgets`
- `Calculate the mean project cost`
- `Total expenditure`
- `Average timeline days`

**Returns:**
- Column statistics
- Average value
- Sum
- Min/Max values
- Count of entries

---

## 🎯 Column-Specific Analysis

Ask about any column in your dataset.

### Format:
`[Analyze/Show/Tell me about] [column name]`

### Examples:
- `Analyze the Budget column`
- `Show me the Manager column`
- `Tell me about Project Status`
- `What's in the Department column?`

**Returns:**
- Matching column names
- Column analysis:
  - For numeric: average, sum, min, max, count
  - For text: unique values, top values with percentages

---

## 📌 Selected Text Analysis

Select text in the data table and ask about it.

### How to use:
1. Click and drag to select text in the data table
2. Ask a question about the selected text
3. The AI will analyze the relevant columns

### Examples:
- Select "Manager Name" then ask: `Tell me more`
- Select a status value then ask: `How many have this status?`
- Select a budget figure then ask: `What else has this budget?`

**Returns:**
- Most relevant columns to the selected text
- Analysis of those columns

---

## 🔍 General Query Tips

### Best Practices:

1. **Be specific with column names** - Use exact or similar names
   - ✅ `budget` → finds "Budget" column
   - ✅ `manager` → finds "Manager" column
   - ❌ `amount` → may not find specific column

2. **Use natural language** - Queries don't need perfect grammar
   - ✅ `Group by manager`
   - ✅ `What about managers?`
   - ✅ `Show manager breakdown`

3. **Combine operators** - Use `and` for date ranges
   - ✅ `Projects between 2024-01-01 and 2024-12-31`

4. **Use keyboard shortcuts**
   - Press **Ctrl+Enter** to submit query quickly

5. **Two view modes for results**
   - **Enhanced View**: Formatted, structured results
   - **Text View**: Raw text output

---

## ❌ What the AI Cannot Do

- ❌ Create new columns or modify data
- ❌ Perform complex multi-step operations
- ❌ Access data outside the uploaded CSV file
- ❌ Machine learning or predictive analysis
- ❌ Connect to external databases

---

## 📱 Interface Features

### Data Table:
- **Sort**: Click any column header to sort (↑ ascending, ↓ descending)
- **Export**: Download filtered results as CSV
- **Selection**: Select text to get context-aware AI analysis

### AI Assistant:
- **Enhanced View**: Best for reading structured results
- **Text View**: Best for copying raw data
- **Dark Mode**: Toggle theme button in top-right

---

## 🆘 Troubleshooting

**Table not showing?**
- Make sure your CSV file is valid and has at least one row of data
- Check that columns have proper names

**Query returning "No data"?**
- The column name may not match exactly
- Try using a simpler query with fewer terms
- Use the list all queries to see available columns

**Results look wrong?**
- Check your CSV file for formatting issues
- Empty cells or unusual characters may affect results

---

## 📝 Example Workflow

1. **Upload CSV** → Data table appears with all rows
2. **Ask overview question** → `How many projects are there?`
3. **Ask for breakdown** → `Group by status`
4. **Filter specific data** → `Show projects with budget > 500000`
5. **Export results** → Click "Export to CSV" button

---

*Last updated: January 2026*
*For feedback or suggestions, contact your administrator*
