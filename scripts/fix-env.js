#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log('🔧 Fixing .env.local file...');

// Read current content
let content = fs.readFileSync(envPath, 'utf8');

// Replace the incorrect private key
const oldPrivateKey = '0x11C1717153C36481B824E616Dd44bC362d040f12';
const newPrivateKey = '0xa2be5e25ee88d33d39c6e94afc0a14e445d06226c100d4c966a0baf0b517669e';

content = content.replace(
  `PRIVATE_KEY=${oldPrivateKey}`,
  `PRIVATE_KEY=${newPrivateKey}`
);

// Write back to file
fs.writeFileSync(envPath, content);

console.log('✅ Private key updated!');
console.log('Old (42 chars):', oldPrivateKey);
console.log('New (66 chars):', newPrivateKey);

// Verify the change
require('dotenv').config();
console.log('\n🔍 Verification:');
console.log('Alchemy API Key:', process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? '✅ Found' : '❌ Missing');
console.log('Private Key:', process.env.PRIVATE_KEY ? '✅ Found' : '❌ Missing');
if (process.env.PRIVATE_KEY) {
  console.log('Private Key Length:', process.env.PRIVATE_KEY.length, 'characters');
}
