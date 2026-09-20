# 🔥 Daily Backend Interview Practice

[![Daily Backend Interview Practice](https://github.com/kunj-21/backend-interview-daily/actions/workflows/daily-challenge.yml/badge.svg)](https://github.com/kunj-21/backend-interview-daily/actions/workflows/daily-challenge.yml)

A fully automated daily backend engineering interview preparation system. Every day at **8:30 AM IST (03:00 UTC)**, a GitHub Action automatically creates a new practice Issue in this repository featuring real-world backend engineering challenges, architecture questions, starter code, collapsible hints, and evaluation rubrics.

---

## 🎯 Focus Tracks

1. **Node.js & Express Internals**: Libuv Event Loop phases, Microtasks vs Macrotasks, Memory Leak Profiling, Streams & Backpressure, Worker Threads & Clustering, Graceful Shutdown.
2. **Redis & Caching Patterns**: Sliding Window Rate Limiters, Token Bucket with Lua, Distributed Locks (Redlock), Cache Stampede/Penetration/Avalanche, Redis Streams & Consumer Groups, Bitmaps & HyperLogLog.
3. **Databases & Data Modeling**: MongoDB Aggregation Pipelines, Compound B-Tree Indexing (ESR Rule), SQL ACID Isolation Levels, Optimistic vs Pessimistic Locking, Sharding & Replication Lag.
4. **System Design & Scalability**: Idempotent APIs, Webhook Delivery Engines with DLQ, Notification Services, Rate Limiting, High-Throughput URL Shorteners.

---

## 🚀 How It Works

```
⏰ GitHub Actions Daily Cron (03:00 UTC / 8:30 AM IST)
   ↓
📥 Picks next sequential challenge from challenges.json
   ↓
🏷️ Creates GitHub Issue labeled `daily-practice`, `topic:*`, `difficulty:*`
   ↓
💻 You write solutions / code in the Issue Comments & check off the rubric!
```

### Daily Issue Format
Each practice issue includes:
- 📌 **Topic & Difficulty Badge** (Easy / Medium / Hard)
- ⏱️ **Estimated Completion Time**
- 📖 **Real-World Problem Scenario** (e.g. production incident or scaling bottleneck)
- ⚙️ **Core Requirements & Constraints**
- 💻 **Starter Code Snippet**
- 💡 **Collapsible Hints** (click to reveal if stuck)
- ✅ **Self-Assessment Rubric Checkboxes**

---

## 📅 Curriculum Roadmap

| Day | Topic | Challenge Title | Difficulty | Est. Time |
| :---: | :--- | :--- | :---: | :---: |
| **01** | Node.js & Express | Mastering the Node.js Event Loop & Microtask Execution Order | 🟡 Medium | 30m |
| **02** | Redis & Caching | Sliding Window Log Rate Limiter using Redis Sorted Sets (ZSET) | 🟡 Medium | 40m |
| **03** | System Design | Designing an Idempotent Payment & Order API | 🔴 Hard | 45m |
| **04** | Databases & Modeling | Database Indexing & The ESR (Equality, Sort, Range) Rule | 🟡 Medium | 35m |
| **05** | Node.js & Express | Debugging Node.js Memory Leaks & V8 Heap Profiling | 🔴 Hard | 45m |
| **06** | Redis & Caching | Distributed Locking with Redis (Redlock Algorithm & Fencing Tokens) | 🔴 Hard | 45m |
| **07** | Redis & Caching | Secure OTP Generation, TTL Caching & Brute-Force Rate Limiting | 🟡 Medium | 35m |
| **08** | Node.js & Express | Streaming Massive Datasets in Node.js without High Memory Usage | 🟡 Medium | 35m |
| **09** | Redis & Caching | Cache Invalidation: Cache-Aside vs Write-Through vs Write-Behind | 🔴 Hard | 40m |
| **10** | System Design | Designing a Webhook Delivery Engine with Exponential Backoff & DLQ | 🔴 Hard | 45m |
| **11** | Databases & Modeling | Complex MongoDB Aggregation Pipelines: $facet, $lookup, and Performance | 🟡 Medium | 35m |
| **12** | Node.js & Express | Graceful Shutdown in Node.js (Zero-Downtime Deployments & Signal Trapping) | 🟡 Medium | 30m |
| **13** | Redis & Caching | Redis Pub/Sub vs Redis Streams vs Consumer Groups | 🔴 Hard | 45m |
| **14** | Databases & Modeling | SQL ACID Isolation Levels & Preventing Race Conditions | 🔴 Hard | 45m |
| **15** | Node.js & Express | Building an Async Concurrency Limiter (p-limit) from Scratch | 🟡 Medium | 35m |
| **16** | Redis & Caching | Counting Billions of Unique Users with Redis HyperLogLog & Bitmaps | 🟡 Medium | 35m |
| **17** | System Design | Designing a Multi-Channel Notification Service (Email, SMS, Push) | 🔴 Hard | 45m |
| **18** | Databases & Modeling | Scaling Databases: Sharding vs Partitioning vs Read Replicas | 🔴 Hard | 45m |
| **19** | Node.js & Express | Worker Threads & Clustering in Node.js for CPU-Intensive Tasks | 🟡 Medium | 35m |
| **20** | Redis & Caching | Token Bucket Rate Limiter with Atomic Redis Lua Scripts | 🔴 Hard | 45m |

---

## 🛠️ Local Development & Testing

You can preview challenges or test issue generation locally without waiting for the cron schedule:

```bash
# Clone the repository
git clone https://github.com/kunj-21/backend-interview-daily.git
cd backend-interview-daily

# Dry-run preview of the next daily issue in console
npm run dry-run

# Preview a specific day's challenge
node scripts/post-challenge.js --dry-run --day 7

# Validate the JSON schema of all challenges
npm run validate
```

### Manual Trigger on GitHub
To trigger a new challenge anytime directly on GitHub:
1. Go to **Actions** tab in this repository.
2. Select **Daily Backend Interview Practice**.
3. Click **Run workflow** (optionally input a specific Day number).
