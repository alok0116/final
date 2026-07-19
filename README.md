# CivicAI – AI Smart Complaint System

> **Authentication Module** — National Hackathon Project

A complete, premium authentication system for an AI-powered civic issue reporting platform. Built with React, Firebase, and modern glassmorphism UI design.

## Features

- **Full Authentication Flow** — Login, Signup, Forgot Password, Profile Management
- **Google OAuth** — One-click sign in with Google
- **Firebase Integration** — Auth, Firestore profiles, Storage for images
- **Premium UI** — Glassmorphism, dark mode, gradient animations
- **Form Validation** — Real-time validation with React Hook Form
- **Protected Routes** — Auto-login, session persistence, route guards
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Accessibility** — ARIA labels, keyboard navigation, screen reader support

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Splash Screen | `/` | Animated loading screen |
| Landing Page | `/home` | Hero, features, CTA |
| Login | `/login` | Email/password + Google |
| Signup | `/signup` | Registration with validation |
| Forgot Password | `/forgot-password` | Email reset link |
| Profile | `/profile` | Edit profile, stats, logout |
| 404 | `*` | Animated not found page |

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router, Framer Motion, React Hook Form, React Icons, React Hot Toast, Axios

**Backend:** Firebase Authentication, Cloud Firestore, Firebase Storage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project ([Create one](https://console.firebase.google.com))

### Installation

```bash
cd civicai-auth
npm install
cp .env.example .env
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password and Google sign-in
3. Create a **Firestore Database** (start in test mode for development)
4. Enable **Storage** for profile image uploads
5. Copy your Firebase config to `.env`

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/ui/       # Button, Input, Card, Modal, Loader
├── components/layout/   # Navbar, Footer, AuthLayout, ProfileCard
├── pages/               # All route pages
├── layouts/             # MainLayout wrapper
├── hooks/               # useAuth, useTheme
├── services/            # authService (Firebase operations)
├── utils/               # validators, constants
├── context/             # AuthContext, ThemeContext providers
├── firebase/            # Firebase configuration
├── routes/              # AppRoutes, ProtectedRoute
└── styles/              # Additional styles
```

## Design System

| Token | Value |
|-------|-------|
| Primary | `#2563EB` |
| Accent | `#38BDF8` |
| Background | Gradient Black → Blue |
| Cards | Glass effect, blur, 24px radius |

Built for National Hackathon — CivicAI Team
