import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const directoryPath = './'; // Directory to search for .json files

async function processJsonFiles() {
  try {
    // Read all files in the directory
    const files = await readdir(directoryPath);

    // Filter out only .json files
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // Process each .json file
    for (const file of jsonFiles) {
      const filePath = path.join(directoryPath, file);

      // Read the input JSON file
      const data = await readFile(filePath, 'utf8');
      const jsonData = JSON.parse(data);

      // Rename the specified fields in each object
      const oldKey = 'req';
      const newKey = 'key';

      for (const key in jsonData) {
        if (jsonData[key] && oldKey in jsonData[key]) {
          // Rename 'key' to 'endpoint'
          jsonData[key][newKey] = jsonData[key][oldKey];
          // Delete the old key
          delete jsonData[key][oldKey];
        }
      }

      // Write the updated JSON back to the original file
      await writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8');
      console.log(`File saved: ${filePath}`);
    }
  } catch (err) {
    // Handle errors (e.g., file not found, invalid JSON)
    console.error('Error:', err);
  }
}

// Execute the function to process all JSON files
processJsonFiles();
