import fs from 'fs-extra';
import path from 'path';

// Define the copyTemplates function
async function copyTemplates() {
  const srcDir = path.join(__dirname, 'templates');
  const destDir = path.join(__dirname, '..', 'dist', 'templates');

  try {
    // Ensure the source directory exists
    if (!fs.existsSync(srcDir)) {
      throw new Error(`Source directory '${srcDir}' does not exist.`);
    }

    // Ensure the destination directory exists (create it if it doesn’t)
    await fs.ensureDir(destDir);

    // Copy the templates directory to the destination
    await fs.copy(srcDir, destDir, { overwrite: true });
    console.log(`Templates copied successfully from '${srcDir}' to '${destDir}'!`);
  } catch (err) {
    console.error('Error copying templates:');
    process.exit(1);
  }
}

// Execute the function and handle top-level async
(async () => {
  try {
    await copyTemplates();
  } catch (err) {
    console.error('Unexpected error:');
    process.exit(1);
  }
})();