import { readFile, writeFile } from 'fs/promises';

const inputFilePath = './finance.json';
const outputFilePath = './finance.json';

async function processJson() {
  try {
    // Read the input JSON file
    const data = await readFile(inputFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    // Remove the specified fields from each object
    for (const key in jsonData) {
      delete jsonData[key].headers;
      // delete jsonData[key].logo;
      // delete jsonData[key].favicon;
    }

    // Write the updated JSON to the output file
    await writeFile(outputFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`File saved: ${outputFilePath}`);
  } catch (err) {
    // Handle errors (e.g., file not found, invalid JSON)
    console.error('Error:', err);
  }
}

// Execute the function to process the JSON
processJson();
