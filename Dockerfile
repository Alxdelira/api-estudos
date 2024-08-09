FROM node:alpine

ENV PORT=3030

#WORKDIR /node-app
COPY . /node-app

RUN cd node-app && npm install

CMD ["node", "node-app/server.js"]