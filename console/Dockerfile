FROM node:8.9.4

WORKDIR /console
COPY package.json /console/package.json
RUN npm install
COPY . /console

CMD ["npm", "start"]
