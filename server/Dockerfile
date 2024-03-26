FROM node:21-alpine

COPY . /app

RUN cd /app && yarn install

WORKDIR /app

CMD ["yarn", "start"]
