FROM node

RUN mkdir /NetMon/
WORKDIR /NetMon/

COPY package.json /NetMon/
COPY script.js /NetMon/
COPY yarn.lock /NetMon/

RUN yarn install

CMD ["node", "-r", "esm", "/NetMon/script.js"]