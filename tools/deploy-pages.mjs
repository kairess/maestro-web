// Publishes dist/ to the gh-pages branch of origin (GitHub Pages "deploy from branch").
// Usage: npm run deploy
import { execSync } from 'node:child_process';
import { mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const sh = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });
const remote = execSync('git remote get-url origin').toString().trim();
const dir = mkdtempSync(join(tmpdir(), 'maestro-pages-'));
try {
  cpSync('dist', dir, { recursive: true });
  writeFileSync(join(dir, '.nojekyll'), ''); // serve files starting with "_" as-is
  sh('git init -q -b gh-pages', dir);
  sh('git add -A', dir);
  sh('git commit -q -m "Deploy to GitHub Pages"', dir);
  sh(`git push -f ${remote} gh-pages`, dir);
  console.log('deployed to gh-pages');
} finally {
  rmSync(dir, { recursive: true, force: true });
}
