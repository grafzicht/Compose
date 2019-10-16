FROM node:12.12-alpine
RUN git clone https://git.snt.utwente.nl/raint/server.git /raint/
WORKDIR /raint/
RUN yarn install
CMD yarn run start