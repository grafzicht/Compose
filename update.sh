git fetch --all
git reset --hard origin/master
docker-compose build --no-cache
docker-compose up -d
docker system prune -f