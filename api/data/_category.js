import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const inputFilePath = './funny.json';
const outputDir = './categories';

async function createCategoryFiles() {
  try {
    // Read and parse the input JSON file
    const data = await readFile(inputFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    // Prepare an object to group entries by category
    const categorizedData = {};

    for (const key in jsonData) {
      const entry = jsonData[key];
      const category = entry.category || 'Uncategorized';

      // Initialize the category if it doesn't exist
      if (!categorizedData[category]) {
        categorizedData[category] = {};
      }

      // Add the current entry to the appropriate category
      categorizedData[category][key] = entry;
    }

    // Ensure the output directory exists
    await mkdir(outputDir, { recursive: true });

    // Write each category to its own JSON file
    for (const category in categorizedData) {
      const categoryFilePath = path.join(outputDir, `${category.replace(/[\s/]/g, '-').toLowerCase()}.json`);
      const categoryData = categorizedData[category];
      await writeFile(categoryFilePath, JSON.stringify(categoryData, null, 2), 'utf8');
      console.log(`File created: ${categoryFilePath}`);
    }

    console.log('All category files created successfully.');
  } catch (err) {
    // Handle any errors that occur
    console.error('Error:', err);
  }
}

// Execute the function
createCategoryFiles();
