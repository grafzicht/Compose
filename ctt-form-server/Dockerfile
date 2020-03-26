FROM node

RUN mkdir /server/
WORKDIR /server/

COPY ./ /server/

RUN yarn install
RUN yarn run compile

EXPOSE 1337

CMD ["node", "./dist/index.js"]