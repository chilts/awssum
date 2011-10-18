test:
	./node_modules/tap/bin/tap.js ./test

clean:
	find . -name '*~' -exec rm {} ';'

.PHONY: test clean
