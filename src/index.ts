import fs from 'fs-extra';
import path from 'path';
import Handlebars from 'handlebars';

interface ProjectConfig {
  projectName: string;
  language: string;
  framework: string;
  integrations: string[];
  projectType: string;
}

async function generateProject({
  projectName,
  language,
  framework,
  integrations,
  projectType,
}: ProjectConfig): Promise<void> {
  const projectDir = path.join(process.cwd(), projectName);

  // Base template directory, adjusted by language
  const baseTemplateDir = path.join(__dirname, 'templates', language.toLowerCase());
  let frameworkDir: string;

  // Map framework to specific sub-directory
  if (framework === 'Vite (JavaScript)') frameworkDir = 'vite-js';
  else if (framework === 'Vite (TypeScript)') frameworkDir = 'vite-ts';
  else if (framework === 'Create React App') frameworkDir = 'create-react';
  else if (framework === 'Next.js (TypeScript)') frameworkDir = 'nextjs';
  else throw new Error('Unsupported framework');

  const templateDir = path.join(baseTemplateDir, frameworkDir);

  // Create project directory
  await fs.ensureDir(projectDir);

  // Copy base framework template
  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template directory ${templateDir} does not exist.`);
  }
  await fs.copy(templateDir, projectDir);

  // Apply project type-specific files (language-agnostic shared templates)
  if (projectType !== 'Plain') {
    const projectTypeDir = path.join(__dirname, 'templates', 'shared', projectType.toLowerCase());
    if (fs.existsSync(projectTypeDir)) {
      await fs.copy(projectTypeDir, projectDir, { overwrite: true });
    }
  }

  // Add integrations
  for (const integration of integrations) {
    await addIntegration(projectDir, integration.toLowerCase(), language);
  }

  // Update package.json with dependencies
  await updatePackageJson(projectDir, integrations);
}

async function addIntegration(projectDir: string, integration: string, language: string): Promise<void> {
  const integrationsDir = path.join(__dirname, 'integrations');
  const integrationFile = path.join(integrationsDir, `${integration}.ts.hbs`); // Assuming Handlebars templates

  if (fs.existsSync(integrationFile)) {
    const source = await fs.readFile(integrationFile, 'utf-8');
    const template = Handlebars.compile(source);
    const content = template({}); // Add dynamic vars if needed
    const ext = language === 'TypeScript' ? 'ts' : 'js';
    await fs.writeFile(path.join(projectDir, 'src', `${integration}.${ext}`), content);
  }
}

async function updatePackageJson(projectDir: string, integrations: string[]): Promise<void> {
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);

  const deps: { [key: string]: { [key: string]: string } } = {
    'pyth (price feeds)': { 'pyth-sdk-js': '^1.0.0' },
    'graphql': { 'graphql': '^16.0.0', '@apollo/client': '^3.0.0' },
    'ipfs/arweave (storage)': { 'ipfs-http-client': '^60.0.0', 'arweave': '^1.0.0' },
    'supabase (backend)': { '@supabase/supabase-js': '^2.0.0' },
  };

  packageJson.dependencies = packageJson.dependencies || {};

  for (const integration of integrations) {
    if (deps[integration.toLowerCase()]) {
      Object.assign(packageJson.dependencies, deps[integration.toLowerCase()]);
    }
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

export default generateProject;