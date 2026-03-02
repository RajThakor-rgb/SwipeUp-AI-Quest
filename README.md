# SwipeUp AI Quest 🎮

An interactive educational game designed for **business students** at the University of Law to learn about Artificial Intelligence fundamentals, tools, ethics, and practical applications.

![SwipeUp AI Quest](public/swipeup-logo.jpeg)

## 🎯 Overview

SwipeUp AI Quest is a gamified learning experience that teaches business students how to:
- Understand AI fundamentals and limitations
- Use AI tools effectively in business contexts
- Write effective prompts for business tasks
- Navigate ethical considerations in AI use
- Apply AI to marketing, finance, HR, and operations

## 🚀 Features

- **6 Interactive Missions** covering AI literacy topics
- **XP System** to track progress and engagement
- **Scenario-Based Learning** with real-world business examples
- **Certificate Generation** upon completion
- **Progress Persistence** using localStorage

## 📚 Missions

| # | Mission | Focus Area |
|---|---------|------------|
| 1 | AI Fundamentals | Understanding AI, ML, and hallucinations |
| 2 | AI Tools for Business | ChatGPT, Claude, specialized tools |
| 3 | Prompt Engineering | Writing effective business prompts |
| 4 | AI Ethics in Business | Privacy, bias, regulations |
| 5 | AI in Business Operations | Market analysis, customer insights |
| 6 | Final Challenge | Comprehensive assessment |

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React hooks with localStorage

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/swipeup-ai-quest.git

# Navigate to the project
cd swipeup-ai-quest

# Install dependencies
bun install

# Run development server
bun run dev
```

## 🌐 Deploy to GitHub Pages

### Step 1: Update Configuration

In `next.config.ts`, update the `basePath` to match your repository name:

```typescript
basePath: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME' : '',
```

### Step 2: Build and Export

```bash
bun run build
```

This creates an `out/` folder with static files.

### Step 3: Deploy

1. Push your code to GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose `gh-pages` branch (create it first) or use GitHub Actions

### Using GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
      
      - run: bun install
      
      - run: bun run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## 📄 License

This project is for educational purposes at the University of Law.

---

Created by **SwipeUp AI Society** 🚀
