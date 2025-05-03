// Simple script to create a .env.local file from the env.example template
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the project root
const projectRoot = path.resolve(__dirname, '..');
const exampleEnvPath = path.join(projectRoot, 'env.example');
const localEnvPath = path.join(projectRoot, '.env.local');

// Check if env.example exists
if (!fs.existsSync(exampleEnvPath)) {
  console.error('❌ env.example file not found. Please make sure it exists in the project root.');
  process.exit(1);
}

// Function to copy the env.example to .env.local
function copyEnvFile() {
  try {
    // Read the example env file
    const exampleEnv = fs.readFileSync(exampleEnvPath, 'utf8');
    
    // Write to .env.local
    fs.writeFileSync(localEnvPath, exampleEnv);
    
    console.log('✅ Created .env.local file successfully!');
    console.log('');
    console.log('IMPORTANT: Open the .env.local file and add your actual API keys.');
    console.log('');
    console.log('Required variables:');
    console.log('- VITE_CLERK_PUBLISHABLE_KEY - Get from https://dashboard.clerk.com/');
    console.log('- VITE_CONVEX_URL - Already set to your Convex deployment URL');
  } catch (error) {
    console.error('❌ Error creating .env.local file:', error.message);
    process.exit(1);
  }
}

// Check if .env.local already exists
if (fs.existsSync(localEnvPath)) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('⚠️ .env.local file already exists. Do you want to overwrite it? (y/n)');
  rl.question('> ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      copyEnvFile();
    } else {
      console.log('❌ Operation cancelled. Your .env.local file was not modified.');
    }
    rl.close();
  });
} else {
  // If .env.local doesn't exist, create it
  copyEnvFile();
} 