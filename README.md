# DeepSea Archives

Une app sympa pour partager et valider des observations de créatures du fond de l'eau. 

## Explication

Exemple: tu vois une créature bizarre en plongée, tu veux la signaler. Mais comment savoir si c'est réel? Des experts doivent vérifier avant de dire "oui, c'est une vraie créature".

Ce qui se passe:
- Les utilisateurs créent des créatures et signalent les observations
- Les experts vérifient ou rejettent ces observations
- On gère tout ça avec deux applications qui communique entre elle. 

## Ce qu'il faut installer

- **Node.js** → https://nodejs.org/ 
- **PostgreSQL** → bdd
- **Git** → pour télécharger / partager le projet


## Mise en route 

### Étape 1: Récupérer le code
Ouvre un terminal et fais:
```bash
git clone https://github.com/KelvinCvl/ControleBack.git
cd ControleBack
```

### Étape 2: Lance auth-service
Ouvre un terminal et fais:
```bash
cd auth-service
npm install
npm run dev
```

### Étape 3: Lances observation-service
Ouvre un autre terminal et fais:
```bash
cd observation-service
npm install
npm run dev
```

Et voilà!


## Configuration (FICHIER .ENV)

C'est juste un fichier avec les choses importante de l'application comme des identifiants.

**Attention:** Le `JWT_SECRET` doit être exactement le même dans les deux applications! Sinon ça marche pas.


## Tester l'appli avec swagger

Ouvre ces liens dans ton navigateur:
- **Pour auth:** http://localhost:3001/api-docs
- **Pour observation:** http://localhost:3002/api-docs


## Tutoriel exemple

Suis ces étapes pour tester:

### Étape 1: Créer un compte
1. Va sur http://localhost:3001/api-docs
2. Cherche `POST /auth/register` (c'est pour créer un compte)
3. Clique sur "Try it out"
4. Remplis les champs:
```
Email: test@example.com
Username: testuser
Password: Password123
```
5. Clique sur "Execute"

Tu devrais voir une réponse avec tes infos. Parfait! 

### Étape 2: Te connecter (pour récupérer ton badge d'accès)
1. Dans Swagger (http://localhost:3001/api-docs), cherche `POST /auth/login`
2. Clique sur "Try it out"
3. Remplis:
```
Email: test@example.com
Password: Password123
```
4. Clique sur "Execute"

Tu vas recevoir un long code (le token). Copie-le (c'est ton badge pour accéder à l'appli).

### Étape 3: Créer une créature
1. Va sur http://localhost:3002/api-docs (l'appli des observations)
2. En haut à droite, tu vois un cadenas. Clique dessus.
3. Sélectionne "BearerAuth"
4. Colle le token que tu viens de copier
5. Cherche `POST /species` (pour créer une créature)
6. Clique sur "Try it out"
7. Remplis:
```
name: Kraken
```
8. Clique sur "Execute"

Première créature créer.

### Étape 4: Signaler une observation
1. Cherche `POST /observations`
2. Clique sur "Try it out"
3. Remplis:
```
speciesId: 1
description: J'ai vu quelque chose d'étrange
dangerLevel: 4
```
4. Clique sur "Execute"

Tu viens de signaler que tu as vu la créature! 

### Étape 5: Voir ce que tu as signalé
1. Cherche `GET /species/{id}/observations`
2. Clique sur "Try it out"
3. Mets `1` dans le champ `id`
4. Clique sur "Execute"

Si tu vois ton observation! Elle est en attente de validation.


## Fonctionnalités

### La partie créatures
- Créer une créature → Tu dis "j'ai vu un Kraken"
- Voir toutes les créatures → Liste de tous les monstres
- Voir une créature spécifique → Les détails d'un monstre

### La partie observations (Observations)
- Signaler une observation → "J'ai vu LE Kraken!"
- Voir les observations → Qui a vu quoi?
- Valider une observation → Un expert dit "oui c'est vrai"
- Rejeter une observation → Un expert dit "non c'est faux"

### Les règles du jeu
- Tu ne peux pas valider ta propre observation
- Tu ne peux pas signaler la même créature deux fois en 5 minutes
- Tu ne peux pas créer deux créatures avec le même nom
- Tu dois écrire une description
- Le niveau de danger doit être entre 1 et 5
- Tu dois être connecté pour signaler quelque chose

## Problèmes Courants

### "Le port 3002 est déjà utilisé"
Quelque chose d'autre utilise ce port. Essaie de fermer tous les terminals et de recommencer.

### "Connection refused PostgreSQL"
PostgreSQL n'est pas lancé. Ouvre ton application PostgreSQL ou relance le service.

### "JWT_SECRET invalide"
Assure-toi que le JWT_SECRET dans les deux `.env` est exactement pareil.

### "Je ne vois rien de bizarre"
C'est normal au début. Vérifie dans les logs du terminal s'il y a un message d'erreur.

## Liens Rapides

- **Tester observation:** http://localhost:3002/api-docs
- **Tester auth:** http://localhost:3001/api-docs
- **Vérifier que ça marche:** http://localhost:3002/health


## L'équipe

- Dorian MILLION-BRODAZ 
- Kelvin CHAUVEL


## Fonctionnalités Implémentées - Niveau 13 (Intermédiaire)

### 1. Indice de Rareté Automatique
Chaque créature a un indice de rareté qui évolue avec les observations:
- **Formule:** `rarityScore = 1 + (observations validées / 5)`
- Les créatures très observées sont moins rares
- **Tri par rareté:** `GET /species?sort=rarity`

**Exemple:** 10 observations validées = rareté de 3.0

### 2. Validation des Observations
- Seuls les utilisateurs avec le rôle **EXPERT** ou **ADMIN** peuvent valider/rejeter
- Impossible de valider sa propre observation
- La rareté se met à jour automatiquement après validation

### 3. Endpoints Disponibles
- `POST /species` - Créer une créature (JWT requis)
- `GET /species` - Lister toutes les créatures
- `GET /species?sort=rarity` - Lister triées par rareté
- `GET /species/:id` - Détails d'une créature
- `POST /observations` - Soumettre une observation (JWT requis)
- `POST /observations/:id/validate` - Valider une observation (EXPERT/ADMIN)
- `POST /observations/:id/reject` - Rejeter une observation (EXPERT/ADMIN)
- `GET /species/:id/observations` - Observations d'une créature

## Règles de Sécurité

**5 minutes obligatoires:** Impossible de soumettre 2 observations de la même espèce en < 5 minutes
**Noms uniques:** Impossible de créer 2 espèces avec le même nom
**Description obligatoire:** Toute observation doit avoir une description
**Danger 1-5:** Le niveau de danger doit être entre 1 et 5
**JWT obligatoire:** Toutes les opérations utilisateur nécessitent une authentification
**Pas d'auto-validation:** Impossible de valider sa propre observation


## Niveau 16 (Avancé) - Microservice de Taxonomie

### 4. Taxonomy Service
Un 3ème microservice qui analyse et classifie les espèces.

**Port:** 3003
**Documentation:** http://localhost:3003/api-docs

#### Endpoints
- `GET /taxonomy/stats` - Retourne les statistiques globales

#### Statistiques Fournies
- Nombre total d'espèces
- Nombre total d'observations
- Observations par espèce
- Moyenne d'observations par espèce
- Persistance des statistiques en base de données

#### Architecture
```
taxonomy-service/
├── src/
│   ├── index.js
│   ├── swagger.js
│   ├── controllers/
│   │   └── taxonomyController.js
│   ├── services/
│   │   ├── fetchdata.js       
│   │   └── taxonomyService.js    
│   └── routes/
│       └── taxonomyRoutes.js
├── prisma/
│   └── schema.prisma
└── package.json
```

#### Comment Tester

1. Lance le taxonomy-service:
```bash
cd taxonomy-service
npm install
npm run dev
```

2. Va sur http://localhost:3003/api-docs

3. Clique sur `GET /taxonomy/stats`

4. Clique sur "Try it out" puis "Execute"

Tu verras les statistiques de toutes les espèces et observations créées.

## Installation Complète (Tous les Services)

### Étape 1: Lancer auth-service
```bash
cd auth-service
npm install
npm run dev
# Sur le port 3001
```

### Étape 2: Lancer observation-service
```bash
cd observation-service
npm install
npm run dev
# Sur le port 3002
```

### Étape 3: Lancer taxonomy-service
```bash
cd taxonomy-service
npm install
npm run dev
# Sur le port 3003
```

## Tous les Services

| Service | Port | URL Swagger | Rôle |
|---------|------|------------|------|
| auth-service | 3001 | http://localhost:3001/api-docs | Authentification & gestion des rôles |
| observation-service | 3002 | http://localhost:3002/api-docs | Gestion des espèces & observations |
| taxonomy-service | 3003 | http://localhost:3003/api-docs | Statistiques et analyse |

## Résumé des Niveaux Implémentés

**Niveau 10 (Base)** - Tous les microservices fonctionnent
**Niveau 13 (Intermédiaire)** - Système de rareté automatique
**Niveau 16 (Avancé)** - Taxonomy service avec statistiques globales

## Architecture Complète du Projet

ControleBack/
│
├── auth-service/                       (Port 3001)
│   ├── src/
│   │   ├── index.js                   ← Point d'entrée Express
│   │   ├── swagger.js                 ← Documentation API
│   │   ├── controllers/
│   │   │   └── authController.js      ← Gère les requêtes HTTP
│   │   ├── services/
│   │   │   ├── authServices.js        ← Logique d'authentification
│   │   │   └── webhookServices.js     ← Communication avec autres services
│   │   ├── routes/
│   │   │   ├── authRoutes.js          ← Endpoints /auth
│   │   │   └── webhookRoutes.js       ← Webhooks entrants
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js      ← Vérification JWT
│   │   └── controllers/
│   │       └── webhookController.js   ← Traite les appels des autres services
│   ├── prisma/
│   │   ├── schema.prisma              ← Model User
│   │   └── migrations/                ← Historique des changements DB
│   ├── .env                           ← Variables d'environnement
│   └── package.json
│
├── observation-service/               (Port 3002)
│   ├── src/
│   │   ├── index.js                   ← Point d'entrée Express
│   │   ├── config/
│   │   │   └── swagger.js             ← Documentation API
│   │   ├── controllers/
│   │   │   ├── speciesController.js   ← Gère les requêtes HTTP (espèces)
│   │   │   └── observationController.js ← Gère les requêtes HTTP (observations)
│   │   ├── services/
│   │   │   ├── speciesService.js      ← Logique métier (espèces + rareté)
│   │   │   └── observationService.js  ← Logique métier (observations + validation)
│   │   ├── routes/
│   │   │   ├── species.js             ← Endpoints /species
│   │   │   └── observations.js        ← Endpoints /observations
│   │   └── middlewares/
│   │       └── auth.js                ← Vérification JWT & rôles
│   ├── prisma/
│   │   ├── schema.prisma              ← Models Species & Observation
│   │   └── migrations/                ← Historique des changements DB
│   ├── .env                           ← Variables d'environnement
│   └── package.json
│
├── taxonomy-service/                  (Port 3003)
│   ├── src/
│   │   ├── index.js                   ← Point d'entrée Express
│   │   ├── swagger.js                 ← Documentation API
│   │   ├── controllers/
│   │   │   └── taxonomyController.js  ← Gère les requêtes HTTP
│   │   ├── services/
│   │   │   ├── fetchdata.js           ← Récupère données du observation-service
│   │   │   └── taxonomyService.js     ← Génère les statistiques
│   │   └── routes/
│   │       └── taxonomyRoutes.js      ← Endpoint /taxonomy/stats
│   ├── prisma/
│   │   ├── schema.prisma              ← Model Stats
│   │   └── migrations/
│   ├── .env                           ← Variables d'environnement
│   └── package.json
│
└── README.md                          ← Ce fichier
