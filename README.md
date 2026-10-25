# Yene Typing ⌨️

<p align="center">
  <strong>Build speed. Improve accuracy. Enjoy every keystroke.</strong>
  <br />
  An interactive typing-practice app with classic exercises, arcade-style challenges, Amharic typing, and code practice.
</p>

<p align="center">
  <a href="https://quick-type-tally.vercel.app/"><strong>🚀 Open Yene Typing</strong></a>
  ·
  <a href="https://github.com/Menelik2/quick-type-tally/issues">Report an issue</a>
  ·
  <a href="https://github.com/Menelik2/quick-type-tally/pulls">Contribute</a>
</p>

---

## About

**Yene Typing** helps learners practise typing in a focused, engaging environment. Choose a practice mode, type at your own pace, and use live feedback to notice mistakes and track progress through a session.

The interface is designed to work across desktop and mobile screens, with a desktop-friendly practice layout and distinct game modes for different styles of practice.

## ✨ Highlights

- **10 practice modes** for focused exercises and game-inspired challenges.
- **Live character feedback** to distinguish correct and incorrect input.
- **Current-word highlighting** to help keep attention on the text being typed.
- **Session progress indicators** with completion percentage and character progress.
- **Streak and motivational feedback** to make practice feel rewarding.
- **Amharic typing practice** alongside English-oriented exercises.
- **Code Typer** for programming-text typing practice.
- **Responsive UI** for desktop and mobile layouts.

## 🎮 Choose a mode

| Mode | What to expect |
| --- | --- |
| **Classic** | Focused word-by-word typing practice with live feedback |
| **Sprint** | A speed-focused typing challenge |
| **Falling Words** | Type words as they appear in the play area |
| **Bubbles** | A playful word-typing challenge |
| **Defense** | A defense-themed typing game |
| **Car Race** | Race-inspired typing practice |
| **Monkey** | A game-style typing challenge |
| **Amharic** | Practise typing Amharic text |
| **Code Typer** | Practise typing code-oriented text |
| **Ninja** | An action-inspired typing challenge |

*Game mechanics and options may change as the project develops.*

## 🖥️ Preview the app

Visit the live application to explore the current interface and available modes:

**[quick-type-tally.vercel.app](https://quick-type-tally.vercel.app/)**

## 🧱 Built with

| Technology | Role |
| --- | --- |
| React 18 | UI components |
| TypeScript | Typed application code |
| Vite | Local development and production builds |
| Tailwind CSS | Styling and responsive layout |
| shadcn/ui + Radix UI | Reusable interface primitives |
| Lucide React | Icons |
| React Router | Client-side navigation |
| TanStack Query | Data-fetching and asynchronous state utilities |
| Supabase JS | Client library available for Supabase integration |

## 🚀 Get started locally

### Prerequisites

- [Node.js](https://nodejs.org/) — preferably a current LTS version
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Menelik2/quick-type-tally.git
cd quick-type-tally
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal (commonly `http://localhost:5173`).

## 📜 Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run build:dev` | Build using development mode |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

Before opening a pull request, it is recommended to run:

```bash
npm run lint
npm run build
```

## 🌐 Deploy

Yene Typing is a Vite frontend and can be deployed on platforms that support static frontend builds, including [Vercel](https://vercel.com/).

Typical Vercel settings:

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`

Connect the GitHub repository to enable automatic deployments. Configure any environment variables required by the code in the hosting provider's project settings.

## 🔐 Environment and security notes

- Check the repository for an `.env.example` file and inspect the code to confirm the exact environment variable names.
- Do not commit local `.env` files, credentials, or private API keys.
- Never expose Supabase service-role keys or other privileged secrets in browser code.
- Only use public client-side configuration values in frontend environment variables.

## 🤝 Contributing

Suggestions, bug reports, and improvements are welcome.

1. Fork this repository or create a feature branch.
2. Keep changes focused and consistent with the existing code style.
3. Run lint and build checks where possible.
4. Open a pull request with a clear summary and testing notes.

For bugs, include steps to reproduce the problem and describe what you expected to happen.

## 🧭 Ideas for future improvements

Possible next steps include richer typing statistics, personal-best records, configurable practice text, more language exercises, accessibility refinements, and additional game options.

## 📄 License

A license is not specified in this README. Check the repository for a `LICENSE` file before reusing or redistributing this project.

---

<p align="center">
  <strong>Small daily practice. Better typing over time.</strong>
  <br />
  Made for learners who want to make every keystroke count.
</p>
