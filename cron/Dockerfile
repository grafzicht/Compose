FROM docker:19

RUN mkdir /Cron/
WORKDIR /Cron/

RUN apk add nodejs yarn

COPY ./ /Cron/

RUN yarn install

ENTRYPOINT []
CMD ["node", "-r", "esm", "/Cron/daemon.js"]