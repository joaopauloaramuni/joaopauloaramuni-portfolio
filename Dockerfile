# ----------------------------
# Stage 1: Build da aplicação
# ----------------------------
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json e package-lock.json (ou yarn.lock/pnpm-lock.yaml)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código
COPY . .

# Build do Vite (gera arquivos estáticos em /dist)
RUN npm run build


# ----------------------------
# Stage 2: Servir com Nginx
# ----------------------------
FROM nginx:stable-alpine

# Remover arquivos default do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar build do Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta padrão do Nginx
EXPOSE 80

# Comando de inicialização do Nginx
CMD ["nginx", "-g", "daemon off;"]
