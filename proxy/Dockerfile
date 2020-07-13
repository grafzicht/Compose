FROM nginx:1.17.4-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
COPY static/ /static/

CMD ["nginx", "-g", "daemon off;"]