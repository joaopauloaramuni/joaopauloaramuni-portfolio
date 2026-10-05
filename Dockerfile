# ----------------------------
# Stage 1: Build da aplicação
# ----------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências exatamente como estão no package-lock.json
RUN npm ci

# Copiar o código (node_modules e dist ficam de fora pelo .dockerignore)
# O .env.local é copiado de propósito: o Vite embute as variáveis VITE_ no build
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

# Proxy de /api/* (o mesmo papel dos rewrites do vercel.json)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta padrão do Nginx
EXPOSE 80

# Comando de inicialização do Nginx
CMD ["nginx", "-g", "daemon off;"]