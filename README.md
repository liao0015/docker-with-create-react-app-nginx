# create-react-app in docker

This test is specifically for whoever is working on 'create-react-app' in docker on Windows 10 using `docker-machine` and `virtual box`

## `docker-compose`

Please check out both `docker-compose.dev` files.  Version 1 is a simplied version and Version 2 contains more structure and both work perfectly in this case with `create-react-app`

```bash
docker-compose -f docker-compose.dev1.yml build
docker-compose -f docker-compose.dev1.yml up
docker-compose -f docker-compose.dev1.yml down
```

```bash
docker-compose -f docker-compose.dev2.yml build
docker-compose -f docker-compose.dev2.yml up
docker-compose -f docker-compose.dev2.yml down
```

For production, we would like to include multiple level build process and ngnix into the picture :)

- We are using a separate Dockerfile for production that handles the multple stage image building process
- The Dockerfile will also include nginx build process
- A much more simplified `docker-compose.prod` file as many features are not needed in production

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
```

Access the web site at `http://192.168.99.100/`

## Dockerfile and `docker run`

```bash
# build the docker image
$ docker build .
# or, this way you specify an image name, easier to call
docker image build -t react:app .

# check Docker image ID
$ docker images
# run the specific image with image id
$ docker container run -p 80:3000 <image-id>

# or with an unique image name, you can
$ docker container run -p 80:3000 react:app

# or with a container name
$ docker container run --name my-react-container -p 80:3000 react:app
```

You will be able to check your react app at `http://192.168.99.100/`, which is the `docker-machine ip <docker-machine name>`, and keep in mind that if you use `docker-machine` and virutalbox,  `localhost` will NOT work.

Now, with the react app running, you will notice that there is NO hot reloading: if you change the app content, the app will NOT update, even by refreshing the browser. So for each chagne you make, you will have to all the followings to reflect the changes:

```bash
docker stop <container>
docker rm <container>
docker build .
docker run -p 80:3000 <image id>
```

Using docker volume to 'bind' the local file dir to docker container

```bash
# remove the previous container
# re-run
$ docker run -p 80:3000 -p 35729:35729 -v ${pwd}:/app <image id>
# or you can do a volumn mount and expose the websocket port 35729 as specified in Dockerfile
docker container run -it -p 3000:3000 -p 35729:35729 --volume ${pwd}:/app <image id>
# unfortunately, this way does NOT work for windows using docker machine & virtualbox :(
```

To bind volume and enable hot-reloading (exposing port 35729 is not necessary either)

```bash
# -e (environment flag)
$ docker run -p 80:3000 -v /c/Path/To/docker-react-app:/app -e CHOKIDAR_USEPOLLING=true <image id>
```

## bonus: react router & nginx

If you are going to use react rouer for client side routing, add the following changes to your `Dockerfile-prod`:

```dockerfile
...
# production environment
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
...
```

Create the following folder along with a `nginx.conf` file-> `nginx/nginx.conf` with the following contents:

```nginx.conf
server {

  listen 80;

  location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  error_page   500 502 503 504  /50x.html;

  location = /50x.html {
    root   /usr/share/nginx/html;
  }

}
```

[An awesome tutorial by Michael Herman](https://mherman.org/blog/dockerizing-a-react-app/)