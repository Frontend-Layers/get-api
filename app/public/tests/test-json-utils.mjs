import { combineJSONFiles } from '../../../api/data/_combine.js';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('combineJSONFiles', () => {
  let testDataDir; // Temporary directory for test data
  let outputFile;  // Path to the output file (index.json)

  before(async () => {
    // Create a unique name for the temporary directory using the current timestamp
    testDataDir = path.join(__dirname, `test-data-${Date.now()}`);
    outputFile = path.join(testDataDir, 'index.json');

    // Create the temporary directory if it doesn't exist
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }

    // Create test JSON files in the temporary directory
    fs.writeFileSync(path.join(testDataDir, 'file1.json'), JSON.stringify({ a: 1 }));
    fs.writeFileSync(path.join(testDataDir, 'file2.json'), JSON.stringify({ b: 2 }));
  });

  after(async () => {
    // Clean up: delete the temporary files and directory
    if (fs.existsSync(path.join(testDataDir, 'file1.json'))) {
      fs.unlinkSync(path.join(testDataDir, 'file1.json'));
    }
    if (fs.existsSync(path.join(testDataDir, 'file2.json'))) {
      fs.unlinkSync(path.join(testDataDir, 'file2.json'));
    }
    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }
    if (fs.existsSync(testDataDir)) {
      fs.rmdirSync(testDataDir);
    }
  });

  it('should combine JSON files into index.json', async () => {
    // Call the function to combine JSON files in the temporary directory
    await combineJSONFiles(testDataDir, outputFile);

    // Check if the output file (index.json) was created
    expect(fs.existsSync(outputFile)).to.be.true;

    // Read and parse the output file to verify its content
    const combinedData = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));

    // Verify that the combined data matches the expected result
    expect(combinedData).to.deep.equal({ a: 1, b: 2 });
  });
});