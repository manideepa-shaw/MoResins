# docker run -it -p 8000:8000 --network=mern manideepa18/moresin_backend

FROM node:16.13.1

WORKDIR /moresin/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

ENTRYPOINT [ "npm","start" ]