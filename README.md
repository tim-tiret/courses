# Application SvelteKit

Ce dépôt contient le code source d'une application SvelteKit développée dans le cadre d'une série de tutoriels sur YouTube.

## Vidéos disponibles

1. **Création de l'application de base** - [Mise en place du projet SvelteKit et configuration initiale](https://youtu.be/DoJqLnP2Dhsy)
2. **Système d'authentification** - [Implémentation d'un système d'authentification complet](https://youtu.be/g4WZ8TxuJIo)

## Prochainement

- **Système de paiement** - Intégration d'un système de paiement (à venir)

## Installation

```bash
# Cloner le dépôt
git clone <url-du-dépôt>
cd <nom-du-dossier>

# Installer les dépendances
npm i -g pnpm
pnpm i
node db.js

# Lancer le serveur de développement
pnpm run dev
```

## Technologies utilisées

- [SvelteKit](https://svelte.dev/)
- [SQLite](https://www.npmjs.com/package/better-sqlite3)
- [Lucia-Auth](https://lucia-auth.com/)
