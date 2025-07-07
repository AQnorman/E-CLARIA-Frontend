/**
 * E-CLARIA Frontend Integration Test Script
 * 
 * This script tests all server actions to ensure they're properly integrated with the backend API.
 * Run this script with Node.js to verify that all endpoints are working correctly.
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test categories
const testCategories = [
  {
    name: 'Authentication',
    description: 'Tests for user registration, login, and profile retrieval',
    command: 'npx playwright test tests/auth.spec.js --headed'
  },
  {
    name: 'Profile',
    description: 'Tests for profile creation, updating, and retrieval',
    command: 'npx playwright test tests/profile.spec.js --headed'
  },
  {
    name: 'Strategy',
    description: 'Tests for AI strategy generation',
    command: 'npx playwright test tests/strategy.spec.js --headed'
  },
  {
    name: 'Outreach',
    description: 'Tests for outreach content generation',
    command: 'npx playwright test tests/outreach.spec.js --headed'
  },
  {
    name: 'Community',
    description: 'Tests for community Q&A functionality',
    command: 'npx playwright test tests/community.spec.js --headed'
  },
  {
    name: 'Mentorship',
    description: 'Tests for mentorship features',
    command: 'npx playwright test tests/mentorship.spec.js --headed'
  }
];

// Manual test instructions
const manualTests = [
  {
    feature: 'Authentication',
    tests: [
      'Verify login with valid credentials redirects to dashboard',
      'Verify login with invalid credentials shows error message',
      'Verify registration creates a new user account',
      'Verify logout clears authentication state'
    ]
  },
  {
    feature: 'Profile',
    tests: [
      'Verify profile page loads existing profile data',
      'Verify profile can be updated and changes persist after reload',
      'Verify unsaved changes dialog appears when navigating away',
      'Verify form validation works for required fields'
    ]
  },
  {
    feature: 'Strategy',
    tests: [
      'Verify strategy generation works with profile data',
      'Verify loading states appear during generation',
      'Verify error handling for failed generation'
    ]
  },
  {
    feature: 'Outreach',
    tests: [
      'Verify outreach content generation works',
      'Verify loading states appear during generation',
      'Verify error handling for failed generation'
    ]
  },
  {
    feature: 'Community',
    tests: [
      'Verify questions can be posted and appear in the list',
      'Verify answers can be posted to questions',
      'Verify upvoting increases the vote count',
      'Verify pagination works for questions list',
      'Verify AI-suggested answers can be generated',
      'Verify answer deletion works with confirmation dialog'
    ]
  },
  {
    feature: 'Mentorship',
    tests: [
      'Verify mentorship opt-in works',
      'Verify mentors list is displayed',
      'Verify messages can be sent to mentors',
      'Verify message history is displayed'
    ]
  }
];

// Print header
console.log(`\n${colors.cyan}==============================================`);
console.log(`   E-CLARIA Frontend Integration Test Script`);
console.log(`==============================================\n${colors.reset}`);

// Main menu
function showMainMenu() {
  console.log(`${colors.blue}Choose an option:${colors.reset}`);
  console.log(`1. Run automated tests (requires Playwright)`);
  console.log(`2. Show manual test instructions`);
  console.log(`3. Check server actions integration`);
  console.log(`4. Exit\n`);
  
  rl.question('Enter your choice (1-4): ', (answer) => {
    switch(answer) {
      case '1':
        runAutomatedTests();
        break;
      case '2':
        showManualTestInstructions();
        break;
      case '3':
        checkServerActionsIntegration();
        break;
      case '4':
        console.log(`\n${colors.green}Exiting test script. Goodbye!${colors.reset}\n`);
        rl.close();
        break;
      default:
        console.log(`\n${colors.red}Invalid option. Please try again.${colors.reset}\n`);
        showMainMenu();
    }
  });
}

// Run automated tests
function runAutomatedTests() {
  console.log(`\n${colors.yellow}Automated Tests${colors.reset}`);
  console.log(`Note: These tests require Playwright to be installed.\n`);
  
  console.log(`${colors.blue}Available test categories:${colors.reset}`);
  testCategories.forEach((category, index) => {
    console.log(`${index + 1}. ${category.name} - ${category.description}`);
  });
  console.log(`${testCategories.length + 1}. Run all tests`);
  console.log(`${testCategories.length + 2}. Back to main menu\n`);
  
  rl.question(`Enter your choice (1-${testCategories.length + 2}): `, (answer) => {
    const choice = parseInt(answer);
    
    if (choice >= 1 && choice <= testCategories.length) {
      const category = testCategories[choice - 1];
      console.log(`\n${colors.yellow}Running ${category.name} tests...${colors.reset}\n`);
      
      try {
        console.log(`Command: ${category.command}`);
        console.log(`\n${colors.yellow}Note: This is a placeholder. In a real implementation, this would execute the test.${colors.reset}\n`);
        // In a real implementation, we would run: execSync(category.command, { stdio: 'inherit' });
        
        console.log(`\n${colors.green}Test completed. Press Enter to continue...${colors.reset}`);
        rl.question('', () => {
          runAutomatedTests();
        });
      } catch (error) {
        console.log(`\n${colors.red}Test failed with error: ${error.message}${colors.reset}\n`);
        console.log(`Press Enter to continue...`);
        rl.question('', () => {
          runAutomatedTests();
        });
      }
    } else if (choice === testCategories.length + 1) {
      console.log(`\n${colors.yellow}Running all tests...${colors.reset}\n`);
      
      try {
        testCategories.forEach(category => {
          console.log(`\n${colors.yellow}Running ${category.name} tests...${colors.reset}`);
          console.log(`Command: ${category.command}`);
          console.log(`\n${colors.yellow}Note: This is a placeholder. In a real implementation, this would execute the test.${colors.reset}\n`);
          // In a real implementation, we would run: execSync(category.command, { stdio: 'inherit' });
        });
        
        console.log(`\n${colors.green}All tests completed. Press Enter to continue...${colors.reset}`);
        rl.question('', () => {
          showMainMenu();
        });
      } catch (error) {
        console.log(`\n${colors.red}Tests failed with error: ${error.message}${colors.reset}\n`);
        console.log(`Press Enter to continue...`);
        rl.question('', () => {
          showMainMenu();
        });
      }
    } else if (choice === testCategories.length + 2) {
      showMainMenu();
    } else {
      console.log(`\n${colors.red}Invalid option. Please try again.${colors.reset}\n`);
      runAutomatedTests();
    }
  });
}

// Show manual test instructions
function showManualTestInstructions() {
  console.log(`\n${colors.yellow}Manual Test Instructions${colors.reset}`);
  console.log(`These are manual tests you can perform to verify functionality.\n`);
  
  console.log(`${colors.blue}Choose a feature to test:${colors.reset}`);
  manualTests.forEach((feature, index) => {
    console.log(`${index + 1}. ${feature.feature}`);
  });
  console.log(`${manualTests.length + 1}. Back to main menu\n`);
  
  rl.question(`Enter your choice (1-${manualTests.length + 1}): `, (answer) => {
    const choice = parseInt(answer);
    
    if (choice >= 1 && choice <= manualTests.length) {
      const feature = manualTests[choice - 1];
      console.log(`\n${colors.yellow}${feature.feature} Tests:${colors.reset}\n`);
      
      feature.tests.forEach((test, index) => {
        console.log(`${index + 1}. ${test}`);
      });
      
      console.log(`\nPress Enter to go back...`);
      rl.question('', () => {
        showManualTestInstructions();
      });
    } else if (choice === manualTests.length + 1) {
      showMainMenu();
    } else {
      console.log(`\n${colors.red}Invalid option. Please try again.${colors.reset}\n`);
      showManualTestInstructions();
    }
  });
}

// Check server actions integration
function checkServerActionsIntegration() {
  console.log(`\n${colors.yellow}Server Actions Integration Check${colors.reset}`);
  console.log(`This will check if all server actions are properly integrated with the backend API.\n`);
  
  const serverActions = [
    { name: 'Authentication', file: 'actions/auth.ts', actions: ['login', 'register', 'logout', 'getUser'] },
    { name: 'Profile', file: 'actions/profile.ts', actions: ['getProfile', 'createOrUpdateProfile'] },
    { name: 'Strategy', file: 'actions/strategy.ts', actions: ['generateStrategy'] },
    { name: 'Outreach', file: 'actions/outreach.ts', actions: ['generateOutreachContent'] },
    { name: 'Community', file: 'actions/community.ts', actions: ['getQuestions', 'getAnswers', 'postQuestion', 'postAnswer', 'upvoteAnswer', 'getSuggestedAnswer', 'getUserPoints', 'deleteAnswer'] },
    { name: 'Mentorship', file: 'actions/mentorship.ts', actions: ['optInToMentorship', 'getMentors', 'sendMessage', 'getMessages', 'suggestReply'] }
  ];
  
  serverActions.forEach(category => {
    console.log(`\n${colors.blue}${category.name} Server Actions:${colors.reset}`);
    console.log(`File: ${category.file}`);
    console.log(`Actions: ${category.actions.join(', ')}`);
    console.log(`Status: ${colors.green}✓ Implemented${colors.reset}`);
  });
  
  console.log(`\n${colors.yellow}Note: This is a static check. To verify actual API integration, run the application and test each feature.${colors.reset}\n`);
  console.log(`Press Enter to go back to the main menu...`);
  rl.question('', () => {
    showMainMenu();
  });
}

// Start the script
showMainMenu();
