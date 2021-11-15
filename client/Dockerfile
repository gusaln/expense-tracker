FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm i

COPY . ./
ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 3000

CMD [ "npm", "run", "dev" ]