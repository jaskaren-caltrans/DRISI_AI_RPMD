import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import './App.css'
import AIAssistant from './components/AIAssistant'

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

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev
      const root = document.documentElement
      if (next) root.classList.add('dark')
      else root.classList.remove('dark')
      return next
    })
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
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
              <div>
                <h3 className="subsection-title">Upload CSV File</h3>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {csvData && (
                  <p className="text-sm text-green-600 mt-2 dark:text-green-400">
                    ✓ CSV file loaded with {csvData.length} rows
                  </p>
                )}
              </div>
              
              <div className="h-px bg-gray-200/80 dark:bg-gray-700/50" />
              
              {csvData && csvData.length > 0 && (
                <div>
                  <h3 className="subsection-title">Available Columns</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/30 dark:border-blue-800">
                    <p className="text-sm text-blue-800 mb-3 dark:text-blue-200">
                      Use these column names in your queries (partial matching supported):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(csvData[0]).map((header, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full border border-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:border-blue-700"
                        >
                          {header}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600 mt-3 dark:text-blue-300">
                      💡 Tip: You can use partial column names. For example, "manager" will match "Project Manager" or "Team Manager"
                    </p>
                  </div>
                </div>
              )}
              
              <div className="h-px bg-gray-200/80 dark:bg-gray-700/50" />
              
              <div>
                <h3 className="subsection-title">Enter Query</h3>
                <div className="flex gap-4">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query (e.g., 'good status between 2024-01-01 and 2024-02-01')"
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows="3"
                  />
                  <button
                    onClick={handleQuerySubmit}
                    disabled={!csvData || !query.trim() || isLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : 'Filter Data'}
                  </button>
                </div>
              </div>
              
              <div className="h-px bg-gray-200/80 dark:bg-gray-700/50" />
              
              {filteredData.length > 0 && (
                <div>
                  <h3 className="subsection-title">Filtered Results ({filteredData.length} rows)</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {Object.keys(filteredData[0] || {}).map((header) => (
                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b dark:text-gray-300 dark:border-gray-600">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredData.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {value || ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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