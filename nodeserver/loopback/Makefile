test:
	@cd "$0" && npm install
	@NODE_ENV=test node ./server/server.js &
	@sleep 2
	@./node_modules/mocha/bin/mocha \
		--reporter spec

.PHONY: test