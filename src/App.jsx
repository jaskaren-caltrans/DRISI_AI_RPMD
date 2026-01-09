import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import './App.css'
import AIAssistant from './components/AIAssistant'
import FileUploader from './components/FileUploader'
import QueryInput from './components/QueryInput'
import DataTable from './components/DataTable'

function App() {
  const [csvData, setCsvData] = useState(null)
  const [query, setQuery] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [selectedText, setSelectedText] = useState('')

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      const text = selection.toString().trim()
      if (text) {
        setSelectedText(text)
      }
    }

    document.addEventListener('mouseup', handleSelection)
    return () => document.removeEventListener('mouseup', handleSelection)
  }, [])

  const handleExportCSV = () => {
    if (filteredData.length === 0) {
      alert('No data to export. Please filter data first.');
      return;
    }

    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          if (value && (value.toString().includes(',') || value.toString().includes('"'))) {
            return `"${value.toString().replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `filtered-data-${new Date().toISOString().slice(0, 10)}.csv`);
    link.click();
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log('Parsing CSV results:', results);
          const cleanData = results.data.filter(row => {
            if (!row || Object.keys(row).length === 0) return false
            const hasData = Object.values(row).some(value => 
              value && value.toString().trim().length > 0
            )
            const columnNames = Object.keys(row)
            const isHeaderRow = columnNames.every(col => 
              Object.values(row).some(val => 
                val && val.toString().toLowerCase() === col.toLowerCase()
              )
            )
            return hasData && !isHeaderRow
          })
          setCsvData(cleanData)
          setFilteredData([])
        },
        error: (error) => {
          console.error('Error parsing CSV:', error)
          alert('Error parsing CSV file. Please check the file format.')
        }
      })
    } else {
      alert('Please select a valid CSV file.')
    }
  }

  const handleQuerySubmit = () => {
    if (!csvData || !query.trim()) {
      alert('Please upload a CSV file and enter a query.')
      return
    }

    setIsLoading(true)
    const queryLower = query.toLowerCase()
    
    const filtered = csvData.filter(row => {
      const queryWords = queryLower.split(' ').filter(word => word.length > 0)
      
      if (queryWords.length === 2) {
        const [firstWord, secondWord] = queryWords
        const possibleCombinations = [
          { value: firstWord, columnName: secondWord },
          { value: secondWord, columnName: firstWord }
        ]
        
        for (const combo of possibleCombinations) {
          const columnKey = Object.keys(row).find(key => 
            key.toLowerCase().includes(combo.columnName.toLowerCase())
          )
          
          if (columnKey) {
            const columnValue = row[columnKey]
            if (columnValue && columnValue.toString().toLowerCase().includes(combo.value.toLowerCase())) {
              return true
            }
          }
        }
        return false
      }
      
      const hasMatch = Object.values(row).some(value => 
        value && value.toString().toLowerCase().includes(queryLower)
      )
      
      if (queryWords.length > 1) {
        const allWordsFound = queryWords.every(word => 
          Object.values(row).some(value => 
            value && value.toString().toLowerCase().includes(word)
          )
        )
        if (allWordsFound) return true
      }
      
      return hasMatch
    })
    
    setFilteredData(filtered)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7] text-gray-800 dark:bg-[#0B1320] dark:text-gray-100">
      <div className="bg-[#0055A4] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="sticky top-0 z-40 text-xl md:text-2xl font-bold">Division of Research, Innovation, and System Information (DRISI)</h1>
            <p className="text-sm opacity-90">Advancing transportation through research and innovation</p>
          </div>
          <button onClick={toggleTheme} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
            <span aria-hidden>🌓</span>
            <span>{isDark ? 'Light' : 'Dark'} mode</span>
          </button>
        </div>
      </div>

      <center>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0055A4] dark:text-white">
            RPMD Data Analysis Tool - Powered by AI
          </h1>
          <h2 className="text-lg md:text-xl font-medium text-gray-600 mt-1 dark:text-gray-300"></h2>
        </div>
      </center>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-8">
              <FileUploader 
                onUpload={handleFileUpload} 
                data={csvData}
                columns={csvData ? Object.keys(csvData[0]) : []}
              />
              
              {csvData && csvData.length > 0 && (
                <>
                  <div className="h-px bg-gray-200/80 dark:bg-gray-700/50" />
                  
                  <div>
                    <h3 className="subsection-title">Enter Query</h3>
                    <QueryInput
                      value={query}
                      onChange={setQuery}
                      onSubmit={handleQuerySubmit}
                      isLoading={isLoading}
                      disabled={!csvData || !query.trim()}
                    />
                  </div>
                  
                  <div className="h-px bg-gray-200/80 dark:bg-gray-700/50" />
                  
                  {filteredData.length > 0 && (
                    <DataTable data={filteredData} onExport={handleExportCSV} />
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      
      {/* AI Assistant */}
      <AIAssistant selectedText={selectedText} csvData={csvData} />
    </div>
  )
}

export default App