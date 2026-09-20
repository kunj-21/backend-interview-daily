import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const challengesPath = path.join(__dirname, '..', 'challenges', 'challenges.json');
const challenges = JSON.parse(fs.readFileSync(challengesPath, 'utf8'));

console.log(`Validating ${challenges.length} challenges...`);

const requiredFields = ['day', 'title', 'topic', 'difficulty', 'estimatedMinutes', 'tags', 'problemStatement', 'keyRequirements', 'starterCode', 'rubric'];

let errors = 0;
const seenDays = new Set();

challenges.forEach((c, index) => {
  requiredFields.forEach((field) => {
    if (!c[field]) {
      console.error(`❌ Challenge at index ${index} is missing required field: ${field}`);
      errors++;
    }
  });

  if (seenDays.has(c.day)) {
    console.error(`❌ Duplicate day number: ${c.day}`);
    errors++;
  }
  seenDays.add(c.day);
});

if (errors === 0) {
  console.log(`✅ All ${challenges.length} challenges passed validation!`);
  process.exit(0);
} else {
  console.error(`❌ Validation failed with ${errors} errors.`);
  process.exit(1);
}
