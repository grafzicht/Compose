#!/bin/bash

# Load certbot recommended params
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "/data/options-ssl-nginx.conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "/data/ssl-dhparams.pem"

# Generate fake certs
mkdir -p /etc/letsencrypt/live/grafzicht.nl/
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
	-keyout '/etc/letsencrypt/live/grafzicht.nl/privkey.pem' \
	-out '/etc/letsencrypt/live/grafzicht.nl/fullchain.pem' \
	-subj '/CN=localhost'

# Start Nginx
nginx -c /nginx.conf

# Clean up trick certificates
rm -rf /etc/letsencrypt/live/grafzicht.nl
rm -rf /etc/letsencrypt/archive/grafzicht.nl
rm -rf /etc/letsencrypt/renewal/grafzicht.nl


# Request new certs
mkdir -p /data/certbot-webroot/
certbot certonly \
	--webroot -w /data/certbot-webroot/ \
	--register-unsafely-without-email \
	-d grafzicht.nl \
	--agree-tos
nginx -s reload

# Periodically renew the certificate
crontab /data/cron.txt
cron -f