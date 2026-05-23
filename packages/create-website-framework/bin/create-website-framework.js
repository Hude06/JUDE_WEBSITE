#!/usr/bin/env node

'use strict';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const DEFAULT_REPO = 'https://github.com/Hude06/website-framework.git';
const CONTENT_CONTRACT_VERSION = 1;
const EXCLUDED_ROOT_ENTRIES = new Set([
  '.git',
  'node_modules',
  '.next',
  '.npm-cache',
  'coverage',
  'dist',
]);

function info(message) {
  console.log(`→ ${message}`);
}

function ok(message) {
  console.log(`✓ ${message}`);
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function printHelp() {
  console.log(`
create-website-framework

Usage:
  npm create @judemakesthings/website-framework <directory> [-- --ref <ref>]
  npx @judemakesthings/create-website-framework <directory> [--ref <ref>]

Options:
  --ref <git-ref>               Framework branch or tag to scaffold from (default: main)
  --framework-repo <git-url>    Framework repository URL override
  --no-install                  Skip npm install after scaffold
  -h, --help                    Show this help
`);
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
  });

  if (result.error) {
    fail(`failed to run ${command}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    fail(`${command} ${args.join(' ')} exited with status ${result.status}`);
  }
}

function parseArgs(argv) {
  const options = {
    targetDir: null,
    ref: process.env.FRAMEWORK_REF || 'main',
    frameworkRepo: process.env.FRAMEWORK_REPO || DEFAULT_REPO,
    install: true,
    help: false,
  };

  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '-h' || arg === '--help') {
      options.help = true;
      continue;
    }

    if (arg === '--no-install') {
      options.install = false;
      continue;
    }

    if (arg === '--ref') {
      const value = argv[i + 1];
      if (!value) fail('missing value for --ref');
      options.ref = value;
      i += 1;
      continue;
    }

    if (arg.startsWith('--ref=')) {
      options.ref = arg.slice('--ref='.length);
      continue;
    }

    if (arg === '--framework-repo') {
      const value = argv[i + 1];
      if (!value) fail('missing value for --framework-repo');
      options.frameworkRepo = value;
      i += 1;
      continue;
    }

    if (arg.startsWith('--framework-repo=')) {
      options.frameworkRepo = arg.slice('--framework-repo='.length);
      continue;
    }

    if (arg.startsWith('-')) {
      fail(`unknown option: ${arg}`);
    }

    positional.push(arg);
  }

  options.targetDir = positional[0] || '.';

  if (positional.length > 1) {
    fail('only one target directory argument is supported');
  }

  return options;
}

function ensureEmptyOrMissingDirectory(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return;
  }

  const entries = fs.readdirSync(targetPath);
  if (entries.length > 0) {
    fail(`target directory is not empty: ${targetPath}`);
  }
}

function copyTemplate(sourceDir, targetDir) {
  fs.cpSync(sourceDir, targetDir, {
    recursive: true,
    filter(src) {
      const rel = path.relative(sourceDir, src);
      if (!rel) return true;
      const rootName = rel.split(path.sep)[0];
      return !EXCLUDED_ROOT_ENTRIES.has(rootName);
    },
  });
}

function writeContractVersion(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    fail(`invalid JSON object in ${filePath}`);
  }

  const json = parsed;
  const changed = json.contractVersion !== CONTENT_CONTRACT_VERSION;
  if (!changed) return false;

  json.contractVersion = CONTENT_CONTRACT_VERSION;
  fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
  return true;
}

function stampContentContractVersion(targetDir) {
  const contentDir = path.join(targetDir, 'content');
  const pagesDir = path.join(contentDir, 'pages');
  const candidates = [path.join(contentDir, 'site.json')];

  if (fs.existsSync(pagesDir)) {
    for (const entry of fs.readdirSync(pagesDir)) {
      if (!entry.endsWith('.json')) continue;
      candidates.push(path.join(pagesDir, entry));
    }
  }

  let changedCount = 0;
  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;
    if (writeContractVersion(filePath)) changedCount += 1;
  }

  if (changedCount > 0) {
    ok(`stamped contractVersion=${CONTENT_CONTRACT_VERSION} in ${changedCount} content file(s)`);
  } else {
    info('content contractVersion already current');
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const targetPath = path.resolve(process.cwd(), options.targetDir);
  ensureEmptyOrMissingDirectory(targetPath);

  info(`scaffolding in ${targetPath}`);

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'website-framework-'));
  const cloneDir = path.join(tempRoot, 'framework');

  try {
    info(`cloning framework (${options.ref})`);
    run('git', ['clone', '--depth', '1', '--branch', options.ref, options.frameworkRepo, cloneDir], process.cwd());

    const gitDir = path.join(cloneDir, '.git');
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }

    fs.mkdirSync(targetPath, { recursive: true });
    info('copying template files');
    copyTemplate(cloneDir, targetPath);
    stampContentContractVersion(targetPath);

    fs.closeSync(fs.openSync(path.join(targetPath, '.client-site'), 'w'));
    ok('created .client-site marker');

    info('initializing git repository');
    run('git', ['init'], targetPath);
    run('git', ['remote', 'add', 'framework', options.frameworkRepo], targetPath);
    ok('configured framework remote');

    if (options.install) {
      info('installing dependencies');
      run('npm', ['install'], targetPath);
      ok('dependencies installed');
    } else {
      info('skipping npm install (--no-install)');
    }

    const relTarget = path.relative(process.cwd(), targetPath);
    const displayTarget = !relTarget || relTarget.startsWith('..') ? targetPath : relTarget;

    console.log('\nNext steps:');
    console.log(`  cd ${displayTarget}`);
    console.log('  npm run verify');
    console.log('  npm run dev');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

main();
