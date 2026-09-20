import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const challengesPath = path.join(__dirname, '..', 'challenges', 'challenges.json');
const challenges = JSON.parse(fs.readFileSync(challengesPath, 'utf8'));

// Parse command-line args
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const dayArgIndex = args.indexOf('--day');
const forcedDay = dayArgIndex !== -1 ? parseInt(args[dayArgIndex + 1], 10) : null;

/**
 * Format the challenge into an interactive GitHub Issue markdown body
 */
function formatIssueBody(challenge) {
  const difficultyBadge = challenge.difficulty === 'Hard' 
    ? '🔴 **Hard**' 
    : challenge.difficulty === 'Medium' 
      ? '🟡 **Medium**' 
      : '🟢 **Easy**';

  const requirementsList = challenge.keyRequirements
    .map((req) => `- 📌 ${req}`)
    .join('\n');

  const rubricChecklist = challenge.rubric
    .map((item) => `- [ ] ${item}`)
    .join('\n');

  const hintsBlock = challenge.hints && challenge.hints.length > 0
    ? `
<details>
<summary>💡 <b>Click to reveal Hints (Try solving without this first!)</b></summary>

${challenge.hints.map((hint, idx) => `**Hint ${idx + 1}:** ${hint}`).join('\n\n')}

</details>
`
    : '';

  return `
## 🎯 Day ${challenge.day}: ${challenge.title}

| 🏷️ **Topic** | ⚡ **Difficulty** | ⏱️ **Estimated Time** |
| :--- | :--- | :--- |
| \`${challenge.topic}\` | ${difficultyBadge} | **${challenge.estimatedMinutes} mins** |

---

### 📖 Problem Statement & Context
${challenge.problemStatement}

---

### ⚙️ Core Requirements & Constraints
${requirementsList}

---

### 💻 Starter Code
\`\`\`javascript
${challenge.starterCode}
\`\`\`

${hintsBlock}

---

### ✅ Self-Assessment Rubric
When you are ready, check these off as you evaluate your solution:
${rubricChecklist}

---

### 📝 How to complete today's session:
1. Write or think through your solution.
2. Reply directly in the **comments below** with your code or explanation.
3. Check off the self-assessment items above.
4. Close this issue once done, or leave it open to review later!
`;
}

/**
 * Get next day to post by querying existing issues via GitHub API or fallback
 */
async function getNextDayNumber() {
  if (forcedDay) return forcedDay;

  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  if (repo && token) {
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/issues?state=all&labels=daily-practice&per_page=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'Daily-Backend-Practice-Bot',
        },
      });

      if (res.ok) {
        const issues = await res.json();
        let maxDay = 0;
        for (const issue of issues) {
          const match = issue.title.match(/Day\s+(\d+)/i);
          if (match) {
            const dayNum = parseInt(match[1], 10);
            if (dayNum > maxDay) maxDay = dayNum;
          }
        }
        return (maxDay % challenges.length) + 1;
      }
    } catch (err) {
      console.warn('Could not query GitHub API for last issue:', err.message);
    }
  }

  // Local fallback: Day 1
  return 1;
}

/**
 * Post the issue to GitHub
 */
async function postIssue(title, body, labels) {
  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  if (!repo || !token) {
    throw new Error('GITHUB_REPOSITORY and GITHUB_TOKEN environment variables are required to post an issue.');
  }

  const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Daily-Backend-Practice-Bot',
    },
    body: JSON.stringify({
      title,
      body,
      labels,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Failed to create issue (${res.status}): ${errorBody}`);
  }

  const createdIssue = await res.json();
  return createdIssue;
}

async function run() {
  const targetDay = await getNextDayNumber();
  const challenge = challenges.find((c) => c.day === targetDay) || challenges[0];

  const title = `Day ${challenge.day}: ${challenge.title}`;
  const body = formatIssueBody(challenge);
  const labels = [
    'daily-practice',
    `topic:${challenge.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    `difficulty:${challenge.difficulty.toLowerCase()}`,
  ];

  if (isDryRun) {
    console.log('=== [DRY RUN] DAILY PRACTICE ISSUE ===');
    console.log(`Title: ${title}`);
    console.log(`Labels: ${labels.join(', ')}`);
    console.log('\n--- Issue Body ---');
    console.log(body);
    console.log('=== [END DRY RUN] ===');
    return;
  }

  console.log(`Publishing Day ${challenge.day}: "${challenge.title}"...`);
  const issue = await postIssue(title, body, labels);
  console.log(`🚀 Successfully created Issue #${issue.number}: ${issue.html_url}`);
}

run().catch((err) => {
  console.error('Error running daily practice poster:', err);
  process.exit(1);
});
