#Stage 1: Build React App

FROM node:22-alpine AS builder

#working dir
WORKDIR /app

#copy dependences file first
COPY package*.json ./

#install dependencies
RUN npm ci

#copy application source
COPY . .

#Build react application
RUN npm run build


FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80




