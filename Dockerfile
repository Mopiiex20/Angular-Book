FROM node:10.9

WORKDIR /nodeapp

# Bundle app source
COPY . .


RUN npm install -g @angular/cli
RUN npm install

RUN npm run build

EXPOSE 4200

CMD [ "npm", "start" ]