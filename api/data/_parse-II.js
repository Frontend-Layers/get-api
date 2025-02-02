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

      // Remove the specified fields from each object
      for (const key in jsonData) {
        delete jsonData[key].headers;
        // delete jsonData[key].logo;
        // delete jsonData[key].favicon;
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
