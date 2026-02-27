# Fluxe — Clone de Twitter

Application web de micro-blogging développée dans le cadre du projet React (ESIMED).

---

## Présentation

Fluxe est un clone de Twitter permettant de gérer des utilisateurs, des tweets, des interactions sociales (follow/unfollow, likes) et des notifications. 

---

## Stack technique

| Outil | Rôle |
|-------|------|
| React 19 + TypeScript | Framework UI + TypeScript |
| Vite | Bundler / Dev server |
| Tailwind CSS v4 | Styles + Dark mode |
| shadcn/ui | Composants UI |
| Redux Toolkit | Gestion d'état global |
| React Router v7 | Routing + routes protégées |
| Axios | Requêtes HTTP vers l'API |
| Framer Motion | Animations |
| Sonner | Notifications toast |

---

## Installation

```bash
git clone https://github.com/Ayzem-13/Fluxe-Frontend.git
cd Fluxe-Frontend
bun install
bun run dev
```

> Le backend doit tourner sur `http://localhost:3000`

---

## Scripts

| Commande | Description |
|----------|-------------|
| `bun run dev` | Serveur de développement |
| `bun run build` | Build de production |
| `bun run preview` | Prévisualisation du build |
| `bun run lint` | Analyse ESLint |

---

## Fonctionnalités

### 1. Authentification
- ✅ Inscription et connexion avec base de données
- ✅ Validation des champs + gestion des erreurs via toasts (email, mot de passe, confirmation)
- ✅ Option "Rester connecté" — persistance via `localStorage`
- ✅ Accès restreint aux utilisateurs connectés — redirection automatique vers `/login`

### 2. Fil d'actualité
- ⏳ Affichage des tweets par ordre chronologique
- ⏳ Affichage par popularité (tendance — basé sur les likes des 3 derniers jours)
- ⏳ Affichage des tweets des utilisateurs suivis

### 3. Page Profil
- ⏳ Affichage des tweets de l'utilisateur par ordre chronologique
- ⏳ Fonctionnalité Follow / Unfollow
- ⏳ Affichage uniquement du nombre de followers sur les profils tiers

### 4. CRUD sur les tweets
- ⏳ Création de tweets
- ⏳ Lecture des tweets
- ⏳ Modification de tweets
- ⏳ Suppression de tweets

### 5. Follow / Followers
- ⏳ Suivre un utilisateur depuis sa page de profil
- ⏳ Recevoir un follow d'un autre utilisateur

### 6. Notifications
- ⏳ Notification lors d'un follow
- ⏳ Notification lors d'un like sur un tweet

### Bonus
- ⏳ Retweet (sans retweet d'un retweet)
- ⏳ Commentaires et likes sur commentaires
- ⏳ TypeScript strict sur l'ensemble du projet

---

## UX/UI

- Interface responsive : sidebar desktop + navigation mobile
- Dark mode automatique basé sur la préférence système
- Toasts pour les retours utilisateur (succès, erreurs, confirmations)
- Animations fluides avec Framer Motion
- Design soigné inspiré de Twitter avec composants shadcn/ui et autres personnalisés
