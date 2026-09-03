import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [folderPath, setFolderPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!folderPath.trim()) {
      setError('Please enter a folder path');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:3002/api/analyze', {
        path: folderPath
      });

      if (response.data.status === 'completed') {
        setResult(response.data);
      } else {
        setError(response.data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(`Error: ${err.message}. Make sure backend is running on http://localhost:3002`);
    } finally {
      setLoading(false);
    }
  };

  const handlePathChange = (e) => {
    setFolderPath(e.target.value);
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
          placeholder="Enter folder path (e.g., C:/Projects/MyApp)"
          value={folderPath}
          onChange={handlePathChange}
          className="input-field"
          disabled={loading}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Analyzing...' : 'Analyze Source'}
        </button>
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

          {result.functions.length > 0 && (
            <div className="section">
              <h2>📋 Functions & Classes</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Language</th>
                    <th>File</th>
                  </tr>
                </thead>
                <tbody>
                  {result.functions.map((func, idx) => (
                    <tr key={idx}>
                      <td className="type-badge">{func.type}</td>
                      <td className="name">{func.name}</td>
                      <td><span className="lang-badge">{func.language}</span></td>
                      <td>{func.file}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {result.tables.length > 0 && (
            <div className="section">
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

      {!loading && !result && !error && (
        <div className="empty-state">
          <p>📁 Enter a folder path and click "Analyze Source" to begin</p>
        </div>
      )}
    </div>
  );
}

export default App;
