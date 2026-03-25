FROM node:20-alpine
WORKDIR /app
COPY Package*.json ./
RUN nmp ci
COPY . .
EXPOSE 3000
CMD ['node' , '/src/index.js']