docker run -d --name python --network mapot-net -h python-backend python:alpine tail -f /dev/null

docker run -d -p 8080:8080 --expose=5432 -v mapot-volume:/var/lib/postgresql/11/main arielfe/nominatim-israel

docker run --name some-nginx -v /home/ubuntu/mapa-leaflet:/usr/share/nginx/html -d -p 80:80 nginx:alpine
