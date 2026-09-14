FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
COPY shared/package.json shared/package.json
RUN npm install
COPY . .
RUN npm run prisma:generate && npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app ./
ENV NODE_ENV=production
EXPOSE 3000 4000
CMD ["npm", "run", "dev"]
