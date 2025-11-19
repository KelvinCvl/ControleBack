PORT=3001
DATABASE_URL="postgresql://postgres:root@localhost:5432/backauth"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"
NODE_ENV="development"

# Dépendances
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build
dist/
build/

# Variables d'environnement
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Prisma
.prisma/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
