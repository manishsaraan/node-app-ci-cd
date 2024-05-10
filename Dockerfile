FROM node:20-alpine

WORKDIR /app

COPY package* .
COPY prisma .

RUN npm install -g pm2

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "dist/index.js"]
