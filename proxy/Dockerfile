FROM nginx:latest

RUN apt-get update
RUN apt-get install -y certbot cron

COPY cron.txt /data/cron.txt
COPY launch.sh /launch.sh
COPY nginx.conf /nginx.conf
COPY /static/ /static/

CMD /bin/sh /launch.sh