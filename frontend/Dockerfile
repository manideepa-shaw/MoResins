# docker run -it -p 3000:3000 --network=mern manideepa18/moresin_frontend
FROM node:16.13.1

WORKDIR /moresin/frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm","start" ]