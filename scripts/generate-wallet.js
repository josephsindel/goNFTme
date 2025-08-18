#!/usr/bin/env node

const { ethers } = require('ethers');

console.log('🔐 Generating Fresh Testnet Wallet');
console.log('===================================\n');

// Generate a random wallet
const wallet = ethers.Wallet.createRandom();

console.log('✅ New testnet wallet generated!');
console.log('\n📋 Wallet Details:');
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);

console.log('\n⚠️  SECURITY WARNINGS:');
console.log('• This is for TESTNET ONLY!');
console.log('• Never use this for real funds!');
console.log('• Store the private key securely!');
console.log('• Add this to your .env.local file');

console.log('\n🚀 Next Steps:');
console.log('1. Copy the private key above');
console.log('2. Update .env.local with:');
console.log(`   PRIVATE_KEY=${wallet.privateKey}`);
console.log('3. Get testnet ETH from https://bridge.base.org/deposit');
console.log(`4. Send testnet ETH to: ${wallet.address}`);
console.log('5. Run: npm run deploy:base-sepolia');

console.log('\n💡 Or run: make setup-env (and paste the private key when prompted)');
