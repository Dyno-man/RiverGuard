#!/usr/bin/env node

/**
 * Deploy Firestore Rules Script
 * 
 * This script helps deploy Firestore security rules to your Firebase project.
 * Make sure you have Firebase CLI installed and are authenticated.
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

async function deployFirestoreRules() {
  log(`${colors.bold}${colors.blue}🚀 Deploying Firestore Rules${colors.reset}`)
  log('='.repeat(50))
  
  try {
    // Check if Firebase CLI is installed
    logInfo('Checking Firebase CLI installation...')
    execSync('firebase --version', { stdio: 'pipe' })
    logSuccess('Firebase CLI is installed')
    
    // Check if firebase.json exists
    if (!existsSync('firebase.json')) {
      logError('firebase.json not found! Make sure you have the Firebase configuration file.')
      return false
    }
    
    // Check if firestore.rules exists
    if (!existsSync('firestore.rules')) {
      logError('firestore.rules not found! Make sure you have the security rules file.')
      return false
    }
    
    logInfo('Deploying Firestore rules...')
    
    // Deploy Firestore rules
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' })
    
    logSuccess('Firestore rules deployed successfully!')
    logInfo('Your new collections (videos, outputData) should now be accessible.')
    
    return true
    
  } catch (error) {
    if (error.message.includes('command not found')) {
      logError('Firebase CLI is not installed!')
      logInfo('Install it with: npm install -g firebase-tools')
      logInfo('Then authenticate with: firebase login')
    } else if (error.message.includes('not authenticated')) {
      logError('You are not authenticated with Firebase!')
      logInfo('Run: firebase login')
    } else {
      logError(`Deployment failed: ${error.message}`)
    }
    return false
  }
}

// Alternative: Manual deployment instructions
function showManualInstructions() {
  log(`\n${colors.bold}📋 Manual Deployment Instructions${colors.reset}`)
  log('─'.repeat(50))
  
  logInfo('If automatic deployment fails, you can deploy manually:')
  log('')
  log('1. Install Firebase CLI:')
  log('   npm install -g firebase-tools')
  log('')
  log('2. Login to Firebase:')
  log('   firebase login')
  log('')
  log('3. Initialize Firebase in your project:')
  log('   firebase init firestore')
  log('')
  log('4. Deploy the rules:')
  log('   firebase deploy --only firestore:rules')
  log('')
  logInfo('Or update rules directly in Firebase Console:')
  log('1. Go to https://console.firebase.google.com/')
  log('2. Select your project (trashapi-6eced)')
  log('3. Go to Firestore Database > Rules')
  log('4. Copy the contents of firestore.rules')
  log('5. Paste and publish the rules')
}

// Main execution
async function main() {
  const success = await deployFirestoreRules()
  
  if (!success) {
    showManualInstructions()
  }
}

main().catch(console.error)
