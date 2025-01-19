import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const directoryPath = './'; // Directory to search for .json files

// Recursive function to sort object keys
function sortJsonRecursive(json) {
  const sortedJson = {};
  const sortedKeys = Object.keys(json).sort(); // Sort the keys of the object
  for (const key of sortedKeys) {
    // If the value is an object, recursively sort its keys
    if (typeof json[key] === 'object' && json[key] !== null && !Array.isArray(json[key])) {
      sortedJson[key] = sortJsonRecursive(json[key]);  // Recursively sort nested objects
    } else {
      sortedJson[key] = json[key];  // Copy the value if it's not an object
    }
  }
  return sortedJson;
}

async function processJsonFiles() {
  try {
    // Read all files in the directory
    const files = await readdir(directoryPath);

    // Filter out only .json files
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    // Process each .json file
    for (const file of jsonFiles) {
      const filePath = path.join(directoryPath, file);

      // Read the JSON file
      const data = await readFile(filePath, 'utf8');
      const jsonData = JSON.parse(data);

      console.log(`Processing file: ${filePath}`);
      console.log("Before sorting:", JSON.stringify(jsonData, null, 2));

      // Recursively sort all keys in the JSON object
      const sortedJsonData = sortJsonRecursive(jsonData);

      console.log("After sorting:", JSON.stringify(sortedJsonData, null, 2));

      // Write the updated JSON back to the file with sorted keys
      await writeFile(filePath, JSON.stringify(sortedJsonData, null, 2), 'utf8');
      console.log(`File saved: ${filePath}`);
    }
  } catch (err) {
    // Handle errors (e.g., file not found, invalid JSON)
    console.error('Error:', err);
  }
}

// Execute the function to process all JSON files
processJsonFiles();
