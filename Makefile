all:

jshint:
	find lib/ -name '*.js' | xargs ./node_modules/.bin/jshint
	find examples/ -name '*.js' | xargs ./node_modules/.bin/jshint

test: clean
	./node_modules/.bin/tap test/

clean:
	find . -name '*~' -exec rm {} ';'

.PHONY: test clean
