# Imagem única com a interface já construída e o servidor de partidas.
# Serve para qualquer hospedagem que aceite Docker (Render, Koyeb,
# Fly, Railway, um Raspberry Pi em casa).

FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run check && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# Só as dependências de produção: o servidor precisa apenas do `ws`.
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server ./server
COPY src ./src
EXPOSE 8787
CMD ["node", "server/index.js"]
