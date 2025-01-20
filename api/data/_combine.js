import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory from the ES module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the correct path directly
const directoryPath = __dirname;  // This will point to the 'api/data' folder

const combineJSONFiles = async () => {
  try {
    const files = await fs.promises.readdir(directoryPath);
    const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'index.json');

    const combinedData = {};

    for (const file of jsonFiles) {
      const filePath = path.join(directoryPath, file);
      const data = await fs.promises.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(data);

      // Merge the parsed data into the combinedData object
      Object.assign(combinedData, parsedData);
    }

    // Write the combined data into index.json
    const combinedJSON = JSON.stringify(combinedData, null, 2);
    await fs.promises.writeFile(path.join(directoryPath, 'index.json'), combinedJSON, 'utf-8');
    console.log('JSON files combined successfully into index.json');
  } catch (error) {
    console.error('Error combining JSON files:', error);
  }
};

combineJSONFiles();
