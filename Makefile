default: dev

dev: dev_client dev_server

dev_client:
	cd client && npm start

dev_server:
	gin run main.go

build:
	cd client && npm run build && cd .. && \
	go build && ./server

setup: 
	cd client && npm i && cd ..

clean: 
	rm -rf www && mkdir www && rm tumblr-lite && rm gin-bin

kill: 
	killall -9 gin-bin & killall -9 gin
