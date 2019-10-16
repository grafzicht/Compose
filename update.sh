git fetch --all
git reset --hard origin/master
docker-compose up -d --build
docker system prune -f