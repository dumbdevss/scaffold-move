#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import generateProject from '../index.js';

interface Answers {
  language: string;
  framework: string;
  integrations: string[];
  projectName: string;
  projectType: string;
  addMoreIntegrations: boolean;
  customIntegration?: string;
}

// ASCII art for "Scaffold Move"
const displayIntro = (): void => {
  console.log(chalk.cyan('--------------------------------------------------'));
  console.log(chalk.cyan('|                                                      |'));
  console.log(chalk.cyan('|     /\\    /\\    /\\    /\\    /\\    /\\    /\\    |'));
  console.log(chalk.cyan('|    /  \\  /  \\  /  \\  /  \\  /  \\  /  \\  /  \\   |'));
  console.log(chalk.cyan('|   /____\\/____\\/____\\/____\\/____\\/____\\/____\\  |'));
  console.log(chalk.cyan('|   |  Scaffold Move  - Movement Labs DApp Tool |    |'));
  console.log(chalk.cyan('|   \\____/\\____/\\____/\\____/\\____/\\____/\\____/  |'));
  console.log(chalk.cyan('|    \\  /  \\  /  \\  /  \\  /  \\  /  \\  /  \\  /   |'));
  console.log(chalk.cyan('|     \\/    \\/    \\/    \\/    \\/    \\/    \\/    |'));
  console.log(chalk.cyan('|                                                      |'));
  console.log(chalk.cyan('--------------------------------------------------'));
  console.log(chalk.cyan('Welcome to Scaffold Move - Build DApps with Ease!\n'));
};

program
  .version('1.0.0')
  .command('init')
  .description('Initialize a new Movement Labs DApp project')
  .action(async () => {
    // Display intro
    displayIntro();

    // Step 1: Prompt for language
    const languageAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: 'Select your preferred language:',
        choices: ['JavaScript', 'TypeScript'],
      },
    ]);

    // Step 2: Prompt for framework based on language
    const frameworkChoices =
      languageAnswer.language === 'JavaScript'
        ? ['Vite (JavaScript)', 'Create React App']
        : ['Next.js (TypeScript)', 'Vite (TypeScript)'];

    const frameworkAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Select your framework/template:',
        choices: frameworkChoices,
      },
    ]);

    // Step 3: Prompt for project name and type
    const baseAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter your project name:',
        default: 'my-move-dapp',
      },
      {
        type: 'list',
        name: 'projectType',
        message: 'Select project type:',
        choices: ['Plain', 'DeFi', 'DAO'],
      },
    ]);

    // Step 4: Prompt for integrations
    const integrationAnswers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'integrations',
        message: 'Select integrations:',
        choices: [
          'Pyth (Price Feeds)',
          'GraphQL',
          'IPFS/Arweave (Storage)',
          'Supabase (Backend)',
          'Custom (Add your own)',
        ],
      },
      {
        type: 'confirm',
        name: 'addMoreIntegrations',
        message: 'Would you like to add more custom integrations?',
        default: false,
      },
    ]);

    let integrations = integrationAnswers.integrations;
    if (integrationAnswers.addMoreIntegrations) {
      const customAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'customIntegration',
          message: 'Enter the name of your custom integration (e.g., Chainlink):',
        },
      ]);
      integrations.push(customAnswers.customIntegration);
    }

    // Combine all answers into a single config object
    const config: Answers = {
      ...languageAnswer,
      ...frameworkAnswer,
      ...baseAnswers,
      integrations,
      addMoreIntegrations: integrationAnswers.addMoreIntegrations,
    };

    console.log(chalk.green('Generating your Movement Labs DApp...'));
    await generateProject(config);
    console.log(chalk.green('Project scaffolded successfully!'));
  });

program.parse(process.argv);