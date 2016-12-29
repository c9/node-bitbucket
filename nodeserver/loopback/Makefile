test:
	@NODE_TLS_REJECT_UNAUTHORIZED=0 ./node_modules/mocha/bin/mocha \
		--require should \
        --require cookie
		--reporter spec \
		--check-leaks

.PHONY: test