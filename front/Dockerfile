# ==========================================
# Estágio 1: Build da aplicação React
# ==========================================
FROM node:20-alpine AS build
WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia todo o código do front e gera a pasta de distribuição
COPY . .
RUN npm run build

# ==========================================
# Estágio 2: Servir os arquivos com Nginx
# ==========================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Limpa os arquivos padrão do Nginx
RUN rm -rf ./*

# Copia configuração customizada do Nginx (com try_files e proxy da API)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados do estágio de build para o Nginx
COPY --from=build /app/dist .

# Expõe a porta 80 do container
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]