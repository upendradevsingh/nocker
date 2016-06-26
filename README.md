#nockr

nockr is a command line tool to run a docker container.

 Usage: nockr [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -v, --volume <volume>  application root directory to be mounted on docker i.e. /opt/apps/hello-world
    -p, --port <port>      port to be opened i.e. 80:80 1337:1337
    -n, --name <name>      container name
    -i, --image <image>    docker image

## With mounting volume explicitlty 

$ nockr -v /opt/projects/dev-app -p 8888 -n my_test_container -i upendradevsingh/noresadegn:2.0 .

## Starting container from app root

$ nockr -p 8888 -n my_test_container -i upendradevsingh/noresadegn:2.0 .

## Watch change in applications

$ nockr watch <container_id>

This command will run the gulp internally to watch the file changes and restart the server in the given docker container.