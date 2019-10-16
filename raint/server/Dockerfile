FROM node:12.12-alpine
RUN curl https://git.snt.utwente.nl/raint/server/-/archive/master/server-master.tar /raint.tar
RUN tar -xzf /raint.tar -C /raint/
WORKDIR /raint/
RUN yarn install
CMD yarn run start