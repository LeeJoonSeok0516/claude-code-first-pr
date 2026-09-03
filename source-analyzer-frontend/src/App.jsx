import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Class & Method Relationship Diagram Component
function ClassMethodDiagram({ functions }) {
  const classes = functions.filter(f => f.type === 'class');
  const methods = functions.filter(f => f.type === 'method');

  return (
    <div className="diagram-container">
      <svg viewBox="0 0 1000 600" className="relationship-diagram">
        {/* Classes */}
        {classes.map((cls, idx) => (
          <g key={`class-${idx}`}>
            <rect
              x={100}
              y={100 + idx * 150}
              width={180}
              height={80}
              fill="#667eea"
              stroke="#333"
              strokeWidth="2"
              rx="5"
            />
            <text
              x={190}
              y={130 + idx * 150}
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
            >
              📦 {cls.name}
            </text>
            <text
              x={190}
              y={155 + idx * 150}
              textAnchor="middle"
              fill="white"
              fontSize="12"
            >
              Line {cls.lineNo}
            </text>
          </g>
        ))}

        {/* Methods with connections */}
        {methods.map((method, idx) => {
          const classIdx = 0; // Connect to first class for now
          const startX = 280;
          const startY = 130 + classIdx * 150;
          const methodX = 500 + (idx % 2) * 350;
          const methodY = 80 + Math.floor(idx / 2) * 150;

          return (
            <g key={`method-${idx}`}>
              {/* Connection line */}
              <line
                x1={startX}
                y1={startY}
                x2={methodX}
                y2={methodY}
                stroke="#999"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              {/* Method box */}
              <rect
                x={methodX - 80}
                y={methodY - 35}
                width={160}
                height={70}
                fill="#764ba2"
                stroke="#333"
                strokeWidth="2"
                rx="5"
              />
              <text
                x={methodX}
                y={methodY - 10}
                textAnchor="middle"
                fill="white"
                fontSize="13"
                fontWeight="bold"
              >
                ⚙️ {method.name}
              </text>
              <text
                x={methodX}
                y={methodY + 10}
                textAnchor="middle"
                fill="white"
                fontSize="11"
              >
                Line {method.lineNo}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="diagram-legend">
        <div className="legend-item">
          <div className="legend-box" style={{backgroundColor: '#667eea'}}></div>
          <span>Class</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{backgroundColor: '#764ba2'}}></div>
          <span>Method</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [folderPath, setFolderPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const fileInputRef = React.useRef(null);

  const handleAnalyze = async () => {
    if (!folderPath.trim()) {
      setError('Please enter a folder path');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Sending request to:', 'http://localhost:3002/api/analyze');
      console.log('Path:', folderPath);

      const response = await axios.post('http://localhost:3002/api/analyze', {
        path: folderPath
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response received:', response.data);

      if (response.data && response.data.status === 'completed') {
        setResult(response.data);
      } else if (response.data && response.data.error) {
        setError(`Backend Error: ${response.data.error}`);
      } else {
        setError('Analysis failed: Invalid response format');
      }
    } catch (err) {
      console.error('Error details:', err);
      if (err.response) {
        setError(`Server Error: ${err.response.status} - ${err.response.data?.error || 'Unknown error'}`);
      } else if (err.request) {
        setError('❌ Error: Network Error. Make sure backend is running on http://localhost:3002');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePathChange = (e) => {
    setFolderPath(e.target.value);
  };

  const handleSearchFile = () => {
    fileInputRef.current?.click();
  };

  const handleFolderSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const firstFile = files[0];
      const webkitPath = firstFile.webkitRelativePath;

      // Extract folder path from webkitRelativePath
      // Example: "MyProject/src/Main.java" -> "MyProject/src"
      const pathParts = webkitPath.split('/');

      if (pathParts.length > 1) {
        // If there are subdirectories, include the directory structure
        const folderPath = pathParts.slice(0, -1).join('/');
        setFolderPath(folderPath);
      } else {
        // Just the root folder name
        setFolderPath(pathParts[0]);
      }
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🔍 Source Code Analyzer</h1>
        <p>Analyze Java, JSP, and XML source files</p>
      </header>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter full folder path (e.g., C:/Projects/MyApp)"
          value={folderPath}
          onChange={handlePathChange}
          className="input-field"
          disabled={loading}
        />
        <button
          onClick={handleSearchFile}
          disabled={loading}
          className="btn-secondary"
          title="Browse for folder"
        >
          🔍 Search File
        </button>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Analyzing...' : 'Analyze Source'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          webkitdirectory="true"
          onChange={handleFolderSelect}
          style={{ display: 'none' }}
        />
      </div>

      <div className="help-section">
        <p>💡 <strong>How to get Full Path:</strong></p>
        <ol>
          <li>Open Windows File Explorer</li>
          <li>Navigate to your source folder</li>
          <li>Click the address bar and copy the full path (e.g., <code>C:\Users\YourName\Documents\samplesource</code>)</li>
          <li>Paste it into the input field above (Ctrl+V)</li>
          <li>Click "Analyze Source"</li>
        </ol>
      </div>

      {error && (
        <div className="error-box">
          <p>❌ {error}</p>
        </div>
      )}

      {result && (
        <div className="result-section">
          <div className="stats">
            <div className="stat-card">
              <div className="stat-number">{result.files_analyzed}</div>
              <div className="stat-label">Files Analyzed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{result.functions.length}</div>
              <div className="stat-label">Functions/Classes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{result.tables.length}</div>
              <div className="stat-label">Elements/Tables</div>
            </div>
          </div>

          {(result.functions.length > 0 || result.tables.length > 0) && (
            <div className="section">
              <div className="tabs-container">
                <button
                  className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
                  onClick={() => setActiveTab('list')}
                >
                  📋 Analysis List
                </button>
                <button
                  className={`tab-button ${activeTab === 'relationship' ? 'active' : ''}`}
                  onClick={() => setActiveTab('relationship')}
                >
                  🔗 Class & Method Relationship
                </button>
              </div>

              {activeTab === 'list' && result.functions.length > 0 && (
                <div className="tab-content">
                  <h2>📋 Functions & Classes</h2>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Line No</th>
                        <th>Name</th>
                        <th>File</th>
                        <th>Path</th>
                        <th>Language</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.functions.map((func, idx) => (
                        <tr key={idx}>
                          <td className="type-badge">{func.type}</td>
                          <td className="line-no">{func.lineNo}</td>
                          <td className="name">{func.name}</td>
                          <td>{func.file}</td>
                          <td className="path-cell">{func.path}</td>
                          <td><span className="lang-badge">{func.language}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {result.tables.length > 0 && (
                    <div className="section" style={{marginTop: '30px'}}>
                      <h2>📊 XML Elements & Tables</h2>
                      <div className="elements-grid">
                        {result.tables.map((table, idx) => (
                          <div key={idx} className="element-badge">
                            {table}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'relationship' && result.functions.length > 0 && (
                <div className="tab-content">
                  <h2>🔗 Class & Method Relationship</h2>
                  <ClassMethodDiagram functions={result.functions} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && !result && !error && (
        <div className="empty-state">
          <p>📁 Enter a folder path and click "Analyze Source" to begin</p>
        </div>
      )}
    </div>
  );
}

export default App;
