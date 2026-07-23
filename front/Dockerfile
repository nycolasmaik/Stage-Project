# ==========================================
# Estágio 1: Build da aplicação React
# ==========================================
FROM node:20-alpine AS build
WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia todo o código do front e gera a pasta de distribuição (dist ou build)
COPY . .
RUN npm run build

# ==========================================
# Estágio 2: Servir os arquivos com Nginx
# ==========================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Limpa os arquivos padrão do Nginx
RUN rm -rf ./*

# Copia os arquivos compilados do estágio de build para o Nginx
# NOTA: Se o seu projeto usa Vite, a pasta gerada é 'dist'. Se for Create React App, mude para 'build'.
COPY --from=build /app/dist .

# Expõe a porta 80 do container
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]