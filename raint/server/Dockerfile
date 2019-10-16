FROM node:12.12-alpine
WORKDIR /raint/
RUN apk update
RUN apk add curl
RUN curl https://git.snt.utwente.nl/raint/server/-/archive/master/server-master.tar -o /raint.tar
RUN tar -xf /raint.tar -C /raint/
RUN yarn install
CMD yarn run start