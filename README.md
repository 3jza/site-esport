# Section eSport Lycée - Plateforme Éducative Gaming

## 🎓 Description

Cette plateforme est dédiée à la section eSport d'un lycée. Elle permet aux élèves de :
- Se créer un profil étudiant avec un simple pseudo (sans email)
- Participer à des défis pédagogiques sur leurs jeux favoris
- Gagner de l'XP et débloquer des badges de progression
- Intégrer des équipes et participer aux compétitions inter-lycées
- Suivre leur progression académique gaming et développer leurs compétences

## 🚀 Technologies Utilisées

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS avec thème personnalisé
- **Animations** : Framer Motion
- **Base de données** : Supabase
- **Authentification** : Système personnalisé par pseudo
- **Gestion d'état** : Zustand
- **Icons** : Lucide React
- **Notifications** : React Hot Toast

## 🎨 Design & Features

### Thème Visuel
- **Couleurs principales** : Noir (#000), Violet (#7C3AED), Blanc (#FFF)
- **Style** : Dark mode avec effets de brillance et particules animées
- **Responsive** : Optimisé pour mobile, tablette et desktop

### Fonctionnalités Pédagogiques
- ✅ Authentification simplifiée par pseudo étudiant
- ✅ Système de défis éducatifs par jeu (LoL, Valorant, Rocket League, etc.)
- ✅ Progression par badges et XP pédagogiques
- ✅ Profils étudiants avec suivi des performances
- ✅ Équipes inter-classes et compétitions lycée
- ✅ Interface d'administration pour les professeurs
- ✅ Interface moderne et engageante pour les élèves

## 🛠 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [repo-url]
cd sitev2

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

### Configuration Supabase
1. Créer un projet sur [supabase.com](https://supabase.com)
2. Copier le fichier `.env.example` vers `.env`
3. Remplir les variables d'environnement :
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Exécuter le script SQL dans `supabase/schema.sql` pour créer les tables

## 🗄 Base de Données

### Tables Principales
- **profiles** : Profils des utilisateurs
- **badges** : Badges disponibles
- **user_badges** : Badges obtenus par les utilisateurs
- **defis** : Défis par jeu
- **defi_completions** : Défis complétés
- **teams** : Équipes de joueurs
- **tournois** : Tournois organisés
- **logs** : Logs système

### Système d'Authentification
L'authentification se base sur un pseudo unique :
- Pas d'email ni de mot de passe requis
- Création automatique du profil si le pseudo n'existe pas
- Persistance via localStorage
- Système de rôles (visiteur, joueur, admin)

## 🎯 Jeux Supportés

- **League of Legends** 🏆
- **Valorant** 🎯
- **Rocket League** ⚽
- **Mario Kart 8** 🏎️
- **Super Smash Bros** 👊
- **FC26** ⚽

## 📱 Pages Principales

### Pages Publiques
- **/** : Page d'accueil avec hero section animée
- **/defis** : Liste des défis par jeu
- **/equipes** : Équipes de joueurs
- **/recompenses** : Récompenses et classements
- **/tournois** : Tournois à venir et en cours
- **/profil/:pseudo** : Profil public d'un joueur

### Pages Privées
- **/admin** : Panel d'administration (admin seulement)

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint
```

## 🏗 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Navbar.tsx      # Navigation principale
│   ├── Footer.tsx      # Pied de page
│   ├── Layout.tsx      # Layout principal
│   ├── Loader.tsx      # Composants de chargement
│   └── LoginModal.tsx  # Modal de connexion
├── pages/              # Pages de l'application
│   ├── Home.tsx        # Page d'accueil
│   ├── Login.tsx       # Page de connexion
│   ├── Profil.tsx      # Page de profil
│   ├── Defis.tsx       # Page des défis
│   ├── Equipes.tsx     # Page des équipes
│   ├── Tournois.tsx    # Page des tournois
│   ├── Recompenses.tsx # Page des récompenses
│   ├── Admin.tsx       # Panel d'administration
│   └── NotFound.tsx    # Page 404
├── stores/             # Gestion d'état
│   └── authStore.ts    # Store d'authentification
├── lib/                # Utilities et configuration
│   └── supabase.ts     # Client et helpers Supabase
├── types/              # Types TypeScript
│   └── database.types.ts # Types de la base de données
└── App.tsx             # Composant racine
```

## 🎨 Animations & UX

### Framer Motion
- Animations d'entrée sur toutes les pages
- Transitions fluides entre les états
- Effets de hover interactifs
- Particules animées en arrière-plan

### Interactions
- Feedback visuel sur toutes les actions
- Loading states avec skeletons
- Notifications toast personnalisées
- Responsive design mobile-first

## 🔐 Sécurité & Permissions

### Row Level Security (RLS)
- Politiques Supabase pour sécuriser les données
- Contrôle d'accès basé sur les rôles
- Validation côté serveur

### Rôles Utilisateurs
- **Visiteur** : Lecture seule
- **Joueur** : Participation aux défis et équipes
- **Admin** : Gestion complète de la plateforme

## 📈 Roadmap

### Features à venir
- [ ] Chat en temps réel entre équipiers
- [ ] Système de notifications push
- [ ] Intégration APIs des jeux (stats)
- [ ] Système de streaming intégré
- [ ] Mobile app avec React Native
- [ ] Système de parrainage
- [ ] Marketplace de skins/items

### Améliorations techniques
- [ ] Tests unitaires et e2e
- [ ] CI/CD avec GitHub Actions
- [ ] Monitoring avec Sentry
- [ ] Analytics avec Google Analytics
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Offline support (PWA)

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Développé avec ❤️ par la communauté EducArma Esport

---

**Rejoignez-nous et montrez vos compétences gaming ! 🎮**# site-esport
