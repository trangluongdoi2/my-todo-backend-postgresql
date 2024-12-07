FROM node:18-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

RUN npm install -g pnpm

COPY . .

EXPOSE 9998

CMD ["pnpm", "start"]
