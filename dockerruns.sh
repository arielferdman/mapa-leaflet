docker network create mapot-net

docker volume create mapot-volume

docker network delete mapot-net
docker run -d --name python --network mapot-net -h python-backend python:alpine tail -f /dev/null

docker run -it --shm-size=1g \
	  -e PBF_URL=https://download.geofabrik.de/asia/israel-and-palestine.html \
	    -e REPLICATION_URL=https://download.geofabrik.de/asia/israel-and-palestine-updates/ \
	      -e IMPORT_WIKIPEDIA=false \
	        -e NOMINATIM_PASSWORD=sana1984 \
		  -v mapot-volume:/var/lib/postgresql/14/main \
		    -p 8080:8080 \
		      --name nominatim \
		        mediagis/nominatim:4.2

#docker run -d -p 8080:8080 -p 5432:5432 -v mapot-volume:/var/lib/postgresql/11/main arielfe/nominatim-israel:2 tail -f /dev/null

docker run --name some-nginx -v $(pwd):/usr/share/nginx/html -d -p 80:80 nginx:alpine
