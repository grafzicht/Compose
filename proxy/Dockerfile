FROM nginx:1.17.4-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
COPY static/ /static/
RUN [[ $(ls -A /static/) ]] && tar -zxf /static/*.tar.gz -C /static/
RUN [[ $(ls -A /static/) ]] && rm /static/*.tar.gz

CMD ["nginx", "-g", "daemon off;"]