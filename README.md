# Yene Typing

**Yene Typing** is a modern, interactive typing-practice web app designed to help users build typing speed, accuracy, and confidence through focused exercises and game-style challenges.

🌐 **Live app:** https://quick-type-tally.vercel.app/  
📦 **Repository:** https://github.com/Menelik2/quick-type-tally

## ✨ Features

- **Multiple practice modes** — choose from Classic, Sprint, Falling Words, Bubbles, Defense, Car Race, Monkey, Amharic, Code Typer, and Ninja.
- **Live typing feedback** — see correct and incorrect characters as you type, with the current word highlighted.
- **Progress tracking during a session** — follow character progress, completion percentage, accuracy feedback, and streaks.
- **Typing games** — practise through different challenge styles instead of relying on a single exercise.
- **Amharic practice** — a dedicated mode for typing in Amharic.
- **Code typing practice** — practise typing code snippets.
- **Responsive interface** — designed for desktop and mobile screens.
- **Fast development workflow** — built with Vite, React, and TypeScript.

> The aim is to make regular typing practice clear, rewarding, and enjoyable.

## 🕹️ Practice modes

| Mode | Practice style |
| --- | --- |
| Classic | Focused, word-by-word typing practice |
| Sprint | Short, speed-focused challenges |
| Falling Words | Type words as they appear in the play area |
| Bubbles | A playful word-typing challenge |
| Defense | Type to defend against incoming challenges |
| Car Race | Race-style typing practice |
| Monkey | A game-inspired typing challenge |
| Amharic | Practice typing Amharic text |
| Code Typer | Type programming-oriented text |
| Ninja | An action-style typing challenge |

*Specific mechanics and available settings may vary as the project evolves.*

## 🧰 Tech stack

- **React 18** — user interface
- **TypeScript** — typed application code
- **Vite** — development server and production build
- **Tailwind CSS** — styling and responsive layouts
- **shadcn/ui and Radix UI** — interface components and accessibility primitives
- **Lucide React** — icons
- **React Router** — client-side navigation
- **TanStack Query** — asynchronous state and data-fetching utilities
- **Supabase client** — available for Supabase integration

## 🚀 Run locally

### Requirements

- Node.js (use a current LTS release)
- npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Menelik2/quick-type-tally.git

# Open the project directory
cd quick-type-tally

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Vite will print a local URL in the terminal, commonly `http://localhost:5173`.

### Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run build:dev` | Build using development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

To verify a production build:

```bash
npm run build
npm run preview
```

## 🌍 Deployment

The project can be deployed to platforms that support Vite-based frontend applications, including **Vercel**.

1. Import the GitHub repository into your deployment provider.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Configure any required environment variables in the provider's project settings.
5. Deploy and verify the published app.

For Vercel, automatic deployments can be enabled by connecting the repository. Review the deployment logs if a build fails.

## ⚙️ Environment variables

The app may use environment variables for optional services such as Supabase. Check the source code and any existing `.env.example` file to confirm the exact variable names required by your checkout.

- Never commit API secrets, service-role keys, or private credentials.
- For frontend variables, expose only values intended to be public.
- Add environment variables through your local environment or deployment provider settings.

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make a focused change.
4. Run `npm run lint` and `npm run build`.
5. Open a pull request describing the change and how it was checked.

## 🗺️ Roadmap ideas

Potential improvements for future releases include richer practice statistics, personal bests, additional language exercises, accessibility refinements, and more configurable typing challenges.

## 📄 License

No license information is specified here yet. Check the repository for an existing license before redistributing or reusing the project.

---

**Practice a little. Improve every session.**  
*Yene Typing — make every keystroke count.*
