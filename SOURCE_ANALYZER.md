# Source Code Analyzer

AI-powered source code analysis tool for Java, JSP, and XML files.

## Overview

Source Code Analyzer helps teams understand and document existing source code by automatically analyzing code structure, identifying functions, classes, and data relationships.

**Features:**
- 📁 Analyze Java, JSP, XML source files
- 🔍 Extract functions, classes, and methods
- 📊 Identify tables and data elements
- 📈 Visual report generation
- ⚡ Real-time analysis

## Project Structure

```
source-analyzer-backend/
├── main.py                 # FastAPI server
├── requirements.txt        # Python dependencies
└── src/
    └── analyzer.py        # Source analysis engine

source-analyzer-frontend/
├── package.json
├── public/
│   └── index.html
└── src/
    ├── index.js           # React entry point
    ├── App.jsx            # Main app component
    └── App.css            # Styles
```

## Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.11)
- **Features:** 
  - RESTful API
  - File pattern matching
  - Code parsing and analysis
  - CORS support

### Frontend
- **Framework:** React 18
- **Features:**
  - Real-time folder analysis
  - Data visualization
  - Responsive UI

## Installation

### Backend Setup

```bash
cd source-analyzer-backend
pip install -r requirements.txt
python main.py
```

Backend runs on `http://localhost:3002`

### Frontend Setup

```bash
cd source-analyzer-frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### POST /api/analyze
Analyze a source code directory.

**Request:**
```json
{
  "path": "/path/to/source/code"
}
```

**Response:**
```json
{
  "id": "uuid",
  "root_path": "/path/to/source/code",
  "files_analyzed": 42,
  "functions": [
    {
      "type": "class",
      "name": "UserController",
      "language": "Java",
      "file": "UserController.java"
    }
  ],
  "tables": ["User", "Order", "Product"],
  "status": "completed"
}
```

### GET /api/health
Health check endpoint.

## Usage

1. **Start Backend:** `python main.py` in `source-analyzer-backend/`
2. **Start Frontend:** `npm start` in `source-analyzer-frontend/`
3. **Enter Folder Path:** e.g., `C:/Projects/MyApplication`
4. **Click Analyze:** Wait for analysis to complete
5. **View Results:** See functions, classes, and elements

## Features

### P0 - MVP (Required)
- ✅ Folder path selection
- ✅ Java, JSP, XML file analysis
- ✅ Function/class extraction
- ✅ Table/element identification
- ✅ Results visualization

### P1 - Nice to Have
- [ ] Hierarchical structure visualization
- [ ] Dependency graph
- [ ] Export to PDF/Excel
- [ ] Recursive analysis visualization

### P2 - Out of Scope
- ❌ Analyze non-Java/JSP/XML files
- ❌ Force method name translation
- ❌ Analyze circular dependencies

## KPI

| Metric | Target |
|--------|--------|
| Analysis Time | ≤ 200ms per file |
| Accuracy | ≥ 85% |
| User Review Rate | ≤ 30% |
| API Response p95 | ≤ 500ms |

## Development Roadmap

- **Phase 1:** Backend scaffolding & API endpoints
- **Phase 2:** Source analysis engine implementation
- **Phase 3:** Frontend integration & visualization
- **Phase 4:** Testing & deployment

## License

MIT
