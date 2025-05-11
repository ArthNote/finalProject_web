# Project Management Application

A modern project management application built with Next.js that helps users organize and track their projects efficiently.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 16.x or higher)
- pnpm package manager
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finalproject/web
```

### 2. Environment Setup

1. Create a `.env.local` file in the root directory
2. Copy the contents from `.env.example` to `.env.local`
3. Update the environment variables:

```bash
# Development URLs
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Production URLs (update these when deploying)
NEXT_PUBLIC_BACKEND_URL_PROD=your_backend_url_here
NEXT_PUBLIC_FRONTEND_URL_PROD=your_frontend_url_here

# Node environment (development/production)
NEXT_PUBLIC_NODE=development

# Set a secure encryption key
NEXT_PUBLIC_ENCRYPTION_KEY=your_encryption_key_here
```

### 3. Install Dependencies

Choose one of the following package managers:

```bash
pnpm install
```

### 4. Run the Development Server

```bash
pnpm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `dev` - Runs the development server
- `build` - Builds the application for production
- `start` - Starts the production server
- `lint` - Runs ESLint to check code quality

```bash

pnpm run [script-name]
```

## Features

- Project management with status tracking
- Task organization and prioritization
- Team collaboration
- Multilingual support (English and French)
- Dark/Light theme support
- Responsive design

## Project Structure

- `/src` - Application source code
- `/public` - Static assets
- `/messages` - Internationalization files
- `/components` - Reusable React components

## Technologies Used

- Next.js
- React
- TypeScript
- TanStack Table
- Tailwind CSS
- Shadcn Ui
- next-intl for internationalization