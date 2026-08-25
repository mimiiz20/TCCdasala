docker build --no-cache -t tccalmox .
docker run --name almox -p 5000:5000 tccalmox
