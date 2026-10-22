@echo off
echo Rebuilding remotion-master.skill for Claude Skill Manager...
node -e "
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const tempDir = path.join(__dirname, '../temp_build');
const skillDir = path.join(tempDir, 'remotion-master');
const assetsDir = path.join(skillDir, 'assets');
const refsDir = path.join(skillDir, 'references');

if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(assetsDir, { recursive: true });
fs.mkdirSync(refsDir, { recursive: true });

const src = path.join(__dirname, '../.agents/skills/remotion-master');
fs.copyFileSync(path.join(src, 'SKILL.md'), path.join(skillDir, 'SKILL.md'));
fs.copyFileSync(path.join(src, 'assets/theme.ts'), path.join(assetsDir, 'theme.ts'));
fs.copyFileSync(path.join(src, 'references/design-rules.md'), path.join(refsDir, 'design-rules.md'));
fs.copyFileSync(path.join(src, 'references/motion-patterns.md'), path.join(refsDir, 'motion-patterns.md'));

const zipDest = path.join(__dirname, '../remotion-master.skill');
execSync(`powershell -Command \"Compress-Archive -Path '${skillDir}' -DestinationPath '${tempDir}/out.zip' -Force; Move-Item '${tempDir}/out.zip' '${zipDest}' -Force\"`);
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('Successfully rebuilt remotion-master.skill!');
"
