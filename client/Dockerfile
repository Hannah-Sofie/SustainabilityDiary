FROM node:18-alpine

WORKDIR /client

COPY . .

RUN npm i

EXPOSE 8083

CMD ["npm", "start"]