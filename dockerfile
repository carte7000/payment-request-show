FROM node:latest

COPY bobpay /app
WORKDIR /app
RUN npm install
EXPOSE 8080
CMD ["node", "app.js"]