# Étape 1 : Construction de l'application Angular
FROM node:20-alpine AS build
WORKDIR /app

# Copie des fichiers de configuration des dépendances
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copie du code source et build de production
COPY . .
RUN npm run build -- --configuration production

# Étape 2 : Image de production Nginx légère
FROM nginx:alpine
# Copie de la configuration Nginx optimisée pour SPA Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers générés par Angular
# Angular 19 génère dans dist/<app>/browser (ou dist/<app>)
COPY --from=build /app/dist/businesscenterservice-web/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
