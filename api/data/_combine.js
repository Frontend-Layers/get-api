import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'lodash-es'; // Для глубокого слияния JSON

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Combines JSON files from the specified directory into a single file.
 * @param {string} inputDir - Directory containing JSON files.
 * @param {string} outputFile - Path to the output file.
 */
export const combineJSONFiles = async (inputDir = __dirname, outputFile = path.join(__dirname, 'index.json')) => {
  try {
    // Read the list of files in the input directory
    const files = await fs.promises.readdir(inputDir);

    // Filter JSON files, excluding the output file
    const jsonFiles = files.filter(file => file.endsWith('.json') && file !== path.basename(outputFile));

    const combinedData = {};

    // Read and merge each JSON file
    for (const file of jsonFiles) {
      const filePath = path.join(inputDir, file);
      try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);
        merge(combinedData, parsedData); // Deep merge
      } catch (error) {
        console.warn(`Skipping invalid or unreadable JSON file: ${file}`, error.message);
      }
    }

    // Write the combined data to the output file
    const combinedJSON = JSON.stringify(combinedData, null, 2);
    await fs.promises.writeFile(outputFile, combinedJSON, 'utf-8');
    console.log(`JSON files combined successfully into ${outputFile}`);
  } catch (error) {
    console.error('Error combining JSON files:', error);
  }
};

// If the script is run directly, execute the function
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  combineJSONFiles();
}