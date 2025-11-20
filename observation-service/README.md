# Observation Service - DeepSea Archives

Service de gestion des observations de créatures abyssales imaginaires pour la plateforme DeepSea Archives.

## Fonctionnalités

- ✅ Gestion des espèces (création, consultation)
- ✅ Gestion des observations (création, consultation, validation, rejet)
- ✅ Authentification JWT
- ✅ Règles métier (validation de l'identité, délai de 5 minutes, dangerLevel)
- ✅ Documentation Swagger
- ✅ Séparation en service layers

## Stack Technique

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Base de données**: PostgreSQL
- **Authentification**: JWT (jsonwebtoken)
- **Documentation**: Swagger/OpenAPI

## Installation

### Prérequis

- Node.js >= 16
- PostgreSQL >= 12
- npm ou yarn

### Étapes

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd ControleBack/observation-service
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec vos valeurs
   ```

4. **Initialiser la base de données**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Générer le client Prisma**
   ```bash
   npm run prisma:generate
   ```

## Lancement

### Mode développement (avec watch)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le service sera accessible sur `http://localhost:3002`

### Documentation Swagger
```
http://localhost:3002/api-docs
```

## Structure du projet

```
src/
├── index.js                 # Point d'entrée
├── config/
│   └── swagger.js          # Configuration Swagger
├── middlewares/
│   └── auth.js             # Middleware JWT
├── routes/
│   ├── species.js          # Routes des espèces
│   └── observations.js     # Routes des observations
├── controllers/
│   ├── speciesController.js      # Logique des espèces
│   └── observationController.js  # Logique des observations
└── services/
    ├── speciesService.js        # Service métier espèces
    └── observationService.js    # Service métier observations
```

## Endpoints

### Health Check
```http
GET /health
```

### Espèces (Species)

#### Créer une espèce
```http
POST /species
Authorization: Bearer <token>

{
  "name": "KRAKEN"
}
```

#### Récupérer toutes les espèces
```http
GET /species
```

#### Récupérer une espèce
```http
GET /species/:id
```

### Observations

#### Créer une observation
```http
POST /observations
Authorization: Bearer <token>

{
  "speciesId": 1,
  "description": "J'ai vu un kraken",
  "dangerLevel": 4
}
```

**Note**: L'`authorId` est extrait du JWT token. `dangerLevel` doit être entre 1 et 5.

#### Récupérer les observations d'une espèce
```http
GET /species/:id/observations
```

#### Valider une observation
```http
POST /observations/:id/validate
Authorization: Bearer <token>
```

**Restrictions**: 
- Seuls les EXPERT et ADMIN peuvent valider
- Un utilisateur ne peut pas valider sa propre observation

#### Rejeter une observation
```http
POST /observations/:id/reject
Authorization: Bearer <token>
```

**Restrictions**: 
- Seuls les EXPERT et ADMIN peuvent rejeter
- Un utilisateur ne peut pas rejeter sa propre observation

## Règles Métier

1. **Unicité des espèces**: Impossible de créer deux espèces du même nom
2. **Délai de soumission**: Impossible de soumettre deux observations de la même espèce dans un délai de 5 minutes
3. **Validation propre**: Impossible de valider/rejeter sa propre observation
4. **DangerLevel**: Doit être compris entre 1 et 5
5. **Description obligatoire**: Tous les champs sont obligatoires

## Variables d'environnement

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/observation_db"

# Port du serveur
PORT=3002

# Secret JWT pour vérifier les tokens
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# URL du service d'authentification (optionnel pour future intégration)
AUTH_SERVICE_URL="http://localhost:3001"
```

## Migration de la base de données

### Créer une migration
```bash
npm run prisma:migrate
```

### Voir l'état des migrations
```bash
npx prisma migrate status
```

### Ouvrir Prisma Studio (UI de la BDD)
```bash
npm run prisma:studio
```

## Exemples de requêtes

### Avec cURL

#### Créer une espèce
```bash
curl -X POST http://localhost:3002/species \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"name": "KRAKEN"}'
```

#### Récupérer toutes les espèces
```bash
curl http://localhost:3002/species
```

#### Créer une observation
```bash
curl -X POST http://localhost:3002/observations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "speciesId": 1,
    "description": "Observation très intéressante",
    "dangerLevel": 3
  }'
```

#### Valider une observation
```bash
curl -X POST http://localhost:3002/observations/1/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Authentification

Tous les endpoints modifiant les données (POST, PATCH, DELETE) nécessitent un token JWT dans le header:

```
Authorization: Bearer <token>
```

Le token est fourni par le service `auth-service` lors du login.

## Erreurs courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| 401 Unauthorized | Token manquant ou invalide | Fournir un token JWT valide |
| 400 Bad Request | Données manquantes ou invalides | Vérifier les champs requis et les validations |
| 403 Forbidden | Rôle insuffisant | Utiliser un compte EXPERT ou ADMIN |
| 404 Not Found | Ressource inexistante | Vérifier l'ID de la ressource |

## Support et Contact

Pour toute question, contacter l'équipe de développement.

## Licence

ISC
