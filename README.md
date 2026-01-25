# Study Tracker - Productivity & Learning Management System

A comprehensive study tracking and productivity management application built with Vue 3. Track your study sessions, manage goals and subjects, monitor progress with visualizations, and get AI-powered assistance through an integrated chatbot.

## Features

- **Study Session Tracking**: Record and manage your study sessions with detailed notes
- **Goal Management**: Set, edit, and track your learning goals
- **Subject Organization**: Organize your studies by subjects
- **Timer**: Built-in study timer for focused sessions
- **Progress Visualization**: Interactive charts and graphs to visualize your progress
- **Dashboard**: Comprehensive dashboard with quick stats, achievements, and daily progress
- **AI Chatbot**: Integrated Gemini AI chatbot for study assistance
- **User Management**: Admin panel for user management (admin only)
- **Achievements System**: Level-based achievements and progress tracking
- **Motivational Quotes**: Daily inspirational quotes to keep you motivated

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management for Vue
- **Tailwind CSS** - Utility-first CSS framework
- **Unovis** - Data visualization library
- **Google Gemini AI** - AI chatbot integration
- **Vitest** - Unit testing framework
- **Biome** - Fast formatter and linter
- **JSON Server** - Mock REST API for development

## Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or bun package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pw-project
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your configuration:
```env
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Configuration

### Environment Variables

- `VITE_API_URL`: Backend API URL (default: `http://localhost:3010`)
- `VITE_GEMINI_API_KEY`: Your Google Gemini API key for chatbot functionality

### JSON Server Setup

The project uses JSON Server for mock API during development.

1. Create a `db.json` file in the root directory with the following structure:

```json
{
  "users": [],
  "sessions": [],
  "goals": [],
  "subjects": [],
  "studySessions": []
}
```

2. Start the server with:

```bash
npm run server
```

This will start the JSON Server on port 3010.

**Note**: The `db.json` file structure includes:
- `users`: Array of user objects with `id`, `name`, `email`, `password`, and `isAdmin` fields
- `sessions`: Array of session objects with `id`, `user_id`, and `secret` fields
- `goals`: Array of goal objects with `id`, `user_id`, `title`, `time_period`, `unit`, and `value` fields
- `subjects`: Array of subject objects with `id`, `user_id`, `name`, and `color` fields
- `studySessions`: Array of study session objects with `id`, `user_id`, `subject`, `duration`, `date`, `time`, and `notes` fields

## Running the Project

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns).

### Production Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check-lint` - Run Biome linter and formatter
- `npm run server` - Start JSON Server (port 3010)
- `npm run test:unit` - Run unit tests with Vitest
- `npm run prepare` - Set up Husky git hooks

## Project Structure

```
src/
├── components/          # Vue components
│   ├── charts/         # Chart components (Bar, Pie)
│   ├── primitives/     # Reusable UI primitives
│   └── ...            # Feature components
├── composables/        # Vue composables (useAuth, useChatbot, etc.)
├── constants/          # Application constants
├── stores/             # Pinia stores
├── utils/              # Utility functions
├── views/              # Route views/pages
├── __tests__/          # Test files
├── App.vue             # Root component
├── main.js             # Application entry point
└── router.js           # Vue Router configuration
```

## Key Features Overview

### Authentication
- User registration and login
- Session management
- Protected routes

### Study Management
- Create and manage study sessions
- Track time spent per subject
- Add session notes

### Goals & Subjects
- Set learning goals with deadlines
- Organize studies by subjects
- Track progress toward goals

### Analytics & Visualization
- Daily progress tracking
- Weekly/monthly statistics
- Interactive bar and pie charts
- Achievement levels

### AI Chatbot
- Powered by Google Gemini AI
- Study assistance and guidance
- Context-aware responses

## Testing

Run unit tests:
```bash
npm run test:unit
```

Tests are located in `src/__tests__/` and use Vitest with Vue Test Utils.

## Code Quality

The project uses Biome for linting and formatting. Run checks with:
```bash
npm run check-lint
```

Git hooks are configured with Husky to ensure code quality before commits.
