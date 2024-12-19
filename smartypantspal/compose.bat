cd C:/Users/user/Desktop/repository/smartypantspal-docker/smartypantspal/
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker network create webnet
docker-compose up --force-recreate -d 
