FROM nginx:1.17.4-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY static/ /static/
RUN tar -zxf *.tar.gz
RUN rm *.tar.gz

CMD ["nginx", "-g", "daemon off;"]