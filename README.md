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


## Architecture

observation-service/
├── src/
│   ├── index.js              ← Le fichier principal (là où ça démarre)
│   ├── config/
│   │   └── swagger.js        ← La configuration de Swagger
│   ├── controllers/          ← Là où on traite les demandes
│   ├── services/             ← Là où c'est la "vraie logique"
│   ├── routes/               ← Les chemins de l'appli (les URLs)
│   └── middlewares/          ← Des vérifications (genre: "t'es connecté?")
├── prisma/
│   └── schema.prisma         ← Le plan de la base de données
├── .env                      ← Les secrets (ne pas le mettre sur GitHub!)
└── README.md                 ← Ce que tu lis maintenant


## Problèmes Courants

### "Le port 3002 est déjà utilisé"
Quelque chose d'autre utilise ce port. Essaie de fermer tous les terminals et de recommencer.

### "Connection refused PostgreSQL"
PostgreSQL n'est pas lancé. Ouvre ton application PostgreSQL ou relance le service.

### "JWT_SECRET invalide"
Assure-toi que le JWT_SECRET dans les deux `.env` est **exactement pareil**.

### "Je ne vois rien de bizarre"
C'est normal au début. Vérifie dans les logs du terminal s'il y a un message d'erreur.

## Liens Rapides

- **Tester observation:** http://localhost:3002/api-docs
- **Tester auth:** http://localhost:3001/api-docs
- **Vérifier que ça marche:** http://localhost:3002/health


## L'équipe

- Dorian MILLION-BRODAZ 
- Kelvin CHAUVEL


## Niveau Intermédiaire

### Indice de Rareté Automatique
Chaque créature a maintenant un **indice de rareté** qui se calcule automatiquement:
- **Formule:** `rarityScore = 1 + (observations validées / 5)`
- Les créatures avec peu d'observations sont plus rares
- Tu peux trier les créatures par rareté en utilisant: `GET /species?sort=rarity`

**Exemple:** Si une créature a 10 observations validées, sa rareté sera: 1 + (10/5) = **3.0**
