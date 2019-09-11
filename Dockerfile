FROM node:10.0

WORKDIR /nodeapp

# Bundle app source
COPY . .

RUN npm install

RUN npm run build

EXPOSE 4200

CMD [ "npm", "start" ]