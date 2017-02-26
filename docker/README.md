==Build docker-compose==
* docker-compose build
* docker-compose up -d
* docker exec -it app_web_1 /bin/bash

==Rebuild docker-compose==
* docker-compose build
* docker exec -it app_web_1 /bin/bash

==windows shared folder==
docker run -it --rm -v /c/Users/Username:/mnt coderuss /bin/bash