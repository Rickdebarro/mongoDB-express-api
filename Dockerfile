# ---- Estágio 1: Build ----
# Usamos uma imagem Node.js oficial como base. 'alpine' é uma versão leve.
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de gerenciamento de pacotes
COPY package*.json ./

# Instala as dependências de produção
RUN npm install

# Copia todo o resto do código-fonte para o contêiner
COPY . .

# Compila o código TypeScript para JavaScript
RUN npm run build

# ---- Estágio 2: Produção ----
# Começamos de uma nova imagem limpa para ter uma imagem final menor
FROM node:18-alpine

WORKDIR /app

# Copia apenas os arquivos de dependência e o código compilado do estágio de build
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist

# Expõe a porta que a aplicação vai rodar
EXPOSE 3000

# O comando para iniciar a aplicação quando o contêiner rodar
CMD [ "node", "dist/index.js" ]