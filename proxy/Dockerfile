FROM nginx:1.17.4-alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN nginx
CMD ["nginx", "-g", "daemon off;"]