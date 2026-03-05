# Fluxe — Frontend

Application web de micro-blogging développée dans le cadre du projet React (ESIMED).

> **Ce dépôt est le frontend. Il nécessite que le backend soit démarré.**
> Backend : [Fluxe-Backend](https://github.com/Ayzem-13/Fluxe-Bakcend)

---

## Stack technique

| Outil | Rôle |
|---|---|
| React 19 + TypeScript | Framework UI |
| Vite | Bundler / Dev server |
| Tailwind CSS v4 | Styles + Dark mode |
| shadcn/ui | Composants UI |
| Redux Toolkit | Gestion d'état global |
| React Router v7 | Routing + routes protégées |
| Axios | Requêtes HTTP vers l'API |
| Framer Motion | Animations |
| Sonner | Notifications toast |

---

## Prérequis

- [Bun](https://bun.sh) ≥ 1.2 (ou npm / pnpm)
- Le [backend Fluxe](https://github.com/Ayzem-13/Fluxe-Bakcend) démarré sur le port `3000`

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Ayzem-13/Fluxe-Frontend.git
cd Fluxe-Frontend
```

### 2. Installer les dépendances

Avec Bun :
```bash
bun install
```

Avec Node.js :
```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Le fichier `.env` contient uniquement :

```env
VITE_API_URL=http://localhost:3000
```

### 4. Démarrer le serveur de développement

Avec Bun :
```bash
bun run dev
```

Avec Node.js :
```bash
npm run dev
```

L'application est disponible sur **http://localhost:5173**

---

## Scripts

| Commande | Bun | Node.js |
|---|---|---|
| Développement | `bun run dev` | `npm run dev` |
| Build | `bun run build` | `npm run build` |
| Prévisualisation | `bun run preview` | `npm run preview` |
| Lint | `bun run lint` | `npm run lint` |

---

## Structure du projet

```
src/
├── app/               # Store Redux + routes
├── components/
│   ├── layout/        # Sidebar, MobileNav, ComposerModal
│   └── ui/            # Composants shadcn/ui
├── domains/           # Logique métier par domaine (DDD)
│   ├── auth/          # Authentification (slice, api, types)
│   ├── tweets/        # Tweets (slice, api, types, components)
│   ├── comments/      # Commentaires (slice, api, types, components)
│   ├── users/         # Profils utilisateurs
│   └── notifications/ # Notifications (slice, api, types, components)
├── hooks/             # Hooks React personnalisés
├── pages/             # Pages de l'application
└── utils/             # Helpers (timeAgo, etc.)
```

---

## Dépendance avec le backend

Ce frontend est conçu pour fonctionner avec [Fluxe-Backend](https://github.com/Ayzem-13/Fluxe-Bakcend).

**Ordre de démarrage :**

1. Démarrer le backend (port `3000`)
2. Démarrer le frontend (port `5173`)

L'authentification utilise des cookies `httpOnly` pour le refresh token. En développement, le backend autorise toutes les origines CORS.
