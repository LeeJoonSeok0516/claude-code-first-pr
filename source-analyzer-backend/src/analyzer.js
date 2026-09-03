const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class SourceAnalyzer {
  constructor() {
    this.supportedExtensions = ['.java', '.jsp', '.xml'];
    this.functions = [];
    this.tables = new Set();
    this.visitedFiles = new Set();
  }

  analyzeDirectory(rootPath) {
    this.visitedFiles = new Set();
    this.functions = [];
    this.tables = new Set();

    const result = {
      id: uuidv4(),
      root_path: rootPath,
      functions: [],
      tables: [],
      files_analyzed: 0,
      status: 'analyzing'
    };

    try {
      const files = this.getSourceFiles(rootPath);
      result.files_analyzed = files.length;

      files.forEach(file => {
        this.analyzeFile(file);
      });

      result.functions = this.functions.slice(0, 50);
      result.tables = Array.from(this.tables).sort();
      result.status = 'completed';
    } catch (error) {
      result.status = 'error';
      result.error = error.message;
    }

    return result;
  }

  getSourceFiles(rootPath) {
    const files = [];
    try {
      const walkDir = (dir) => {
        if (!fs.existsSync(dir)) return;

        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            walkDir(fullPath);
          } else if (this.supportedExtensions.some(ext => fullPath.endsWith(ext))) {
            files.push(fullPath);
          }
        });
      };
      walkDir(rootPath);
    } catch (error) {
      console.error(`Error reading directory: ${error.message}`);
    }
    return files;
  }

  analyzeFile(filePath) {
    if (this.visitedFiles.has(filePath)) return;
    this.visitedFiles.add(filePath);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      if (filePath.endsWith('.java')) {
        this.analyzeJava(content, filePath);
      } else if (filePath.endsWith('.jsp')) {
        this.analyzeJsp(content, filePath);
      } else if (filePath.endsWith('.xml')) {
        this.analyzeXml(content, filePath);
      }
    } catch (error) {
      console.error(`Error analyzing ${filePath}: ${error.message}`);
    }
  }

  analyzeJava(content, filePath) {
    // Remove single-line comments while preserving line structure
    const contentWithoutComments = content.split('\n').map(line => {
      const commentIndex = line.indexOf('//');
      return commentIndex === -1 ? line : line.substring(0, commentIndex);
    }).join('\n');

    const classRegex = /(?:public\s+)?(?:class|interface)\s+(\w+)/g;
    const methodRegex = /(?:public|private|protected)?\s*(?:static\s+)?\w+\s+(\w+)\s*\(/g;
    const fileName = path.basename(filePath);

    // Calculate line number helper (using original content for correct line numbers)
    const getLineNumber = (pos) => {
      return contentWithoutComments.substring(0, pos).split('\n').length;
    };

    let match;
    while ((match = classRegex.exec(contentWithoutComments)) !== null) {
      const lineNo = getLineNumber(match.index);
      this.functions.push({
        type: 'class',
        lineNo: lineNo,
        name: match[1],
        file: fileName,
        path: filePath,
        language: 'Java'
      });
    }

    while ((match = methodRegex.exec(contentWithoutComments)) !== null) {
      // Skip if matched text starts with "new" keyword (e.g., new String(), new ArrayList())
      if (/^new\s+/.test(match[0])) continue;

      if (!match[1]) continue; // Safety check for captured group

      // Skip if method name starts with capital letter (likely a class/constructor call)
      if (/^[A-Z]/.test(match[1])) {
        const looksLikeClass = /^[A-Z][a-zA-Z]*$/.test(match[1]);
        if (looksLikeClass || match[1] === 'String') continue;
      }

      const lineNo = getLineNumber(match.index);
      this.functions.push({
        type: 'method',
        lineNo: lineNo,
        name: match[1],
        file: fileName,
        path: filePath,
        language: 'Java'
      });
    }
  }

  analyzeJsp(content, filePath) {
    const varRegex = /var\s+(\w+)\s*=/g;
    const funcRegex = /function\s+(\w+)\s*\(/g;
    const fileName = path.basename(filePath);

    const getLineNumber = (pos) => {
      return content.substring(0, pos).split('\n').length;
    };

    let match;
    let count = 0;
    while ((match = varRegex.exec(content)) !== null && count < 5) {
      const lineNo = getLineNumber(match.index);
      this.functions.push({
        type: 'variable',
        lineNo: lineNo,
        name: match[1],
        file: fileName,
        path: filePath,
        language: 'JSP'
      });
      count++;
    }

    while ((match = funcRegex.exec(content)) !== null) {
      const lineNo = getLineNumber(match.index);
      this.functions.push({
        type: 'function',
        lineNo: lineNo,
        name: match[1],
        file: fileName,
        path: filePath,
        language: 'JSP'
      });
    }
  }

  analyzeXml(content, filePath) {
    const elementRegex = /<\s*(\w+)[^>]*>/g;
    let match;
    let count = 0;

    while ((match = elementRegex.exec(content)) !== null && count < 10) {
      const elem = match[1];
      if (!['!DOCTYPE', '?xml', 'beans'].includes(elem)) {
        this.tables.add(elem);
        count++;
      }
    }
  }
}

module.exports = SourceAnalyzer;
