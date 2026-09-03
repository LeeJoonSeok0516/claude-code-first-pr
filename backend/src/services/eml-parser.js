const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function parseEmlFile(filePath) {
  const source = fs.createReadStream(filePath);

  try {
    const parsed = await simpleParser(source);

    const mainContent = parsed.text?.slice(0, 500) || parsed.html?.slice(0, 500) || '';

    return {
      id: uuidv4(),
      sender: parsed.from?.text || 'Unknown',
      subject: parsed.subject || '(No Subject)',
      date: parsed.date ? new Date(parsed.date).toLocaleDateString() : 'Unknown',
      mainContent: mainContent.trim(),
      fileName: path.basename(filePath),
      fullPath: filePath
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

async function analyzeEmlFolder(folderPath) {
  const results = [];

  try {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      if (file.toLowerCase().endsWith('.eml')) {
        const fullPath = path.join(folderPath, file);
        const parsed = await parseEmlFile(fullPath);

        if (parsed) {
          results.push(parsed);
        }
      }
    }

    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    return results;
  } catch (error) {
    console.error(`Error reading folder ${folderPath}:`, error.message);
    return [];
  }
}

module.exports = {
  parseEmlFile,
  analyzeEmlFolder
};
