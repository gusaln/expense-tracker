FROM node:16-alpine

WORKDIR /var/www

COPY package.json ./
COPY package-lock.json ./
RUN npm i --omit dev

COPY . .

ENV PATH /var/www/node_modules/.bin:$PATH

EXPOSE 5000

CMD [ "npm", "run", "start" ]