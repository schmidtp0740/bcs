FROM node:carbon

WORKDIR /code

RUN npm install -g nodemon@1.11.0

COPY package*.json ./

RUN npm install && npm ls
COPY . .


CMD ["npm", "start"]

