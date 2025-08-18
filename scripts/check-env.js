#!/usr/bin/env node

require('dotenv').config();

console.log('🔍 Environment Check');
console.log('===================\n');

const privateKey = process.env.PRIVATE_KEY;
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

console.log('📋 Current Configuration:');
console.log(`Alchemy API Key: ${alchemyKey ? '✅ Set' : '❌ Missing'}`);
console.log(`Private Key: ${privateKey ? '✅ Set' : '❌ Missing'}`);

if (privateKey) {
  console.log('\n🔐 Private Key Analysis:');
  console.log(`Length: ${privateKey.length} characters`);
  console.log(`Format: ${privateKey.startsWith('0x') ? '✅ Starts with 0x' : '❌ Should start with 0x'}`);
  
  if (privateKey.length === 42) {
    console.log('❌ ERROR: This looks like a wallet ADDRESS, not a private key!');
    console.log('   Private keys should be 66 characters (0x + 64 hex chars)');
    console.log('   Addresses are 42 characters (0x + 40 hex chars)');
  } else if (privateKey.length === 66) {
    console.log('✅ Correct length for private key');
  } else {
    console.log(`❌ Invalid length: Expected 66 characters, got ${privateKey.length}`);
  }
}

console.log('\n📝 How to get your TESTNET private key:');
console.log('1. Open MetaMask or Coinbase Wallet');
console.log('2. Create a NEW wallet (for testing only!)');
console.log('3. Click on Account Details → Export Private Key');
console.log('4. Copy the private key (starts with 0x, 66 characters total)');
console.log('5. Add testnet ETH from https://bridge.base.org/deposit');
console.log('\n⚠️  NEVER use your main wallet private key for development!');

if (alchemyKey === 'your_alchemy_api_key_here') {
  console.log('\n🔑 You also need an Alchemy API key:');
  console.log('1. Go to https://www.alchemy.com/');
  console.log('2. Sign up for free');
  console.log('3. Create a new app on Base Sepolia network');
  console.log('4. Copy the API key');
}
