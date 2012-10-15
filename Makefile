all:

jshint:
	git ls-tree --name-only -r HEAD | grep \.js$ | xargs ./node_modules/.bin/jshint 

test: clean
	./node_modules/.bin/tap test/*.js test/integration/*.js

contributors:
	echo "# Contributors #" > CONTRIBUTORS.md
	echo                   >> CONTRIBUTORS.md
	echo '```'             >> CONTRIBUTORS.md
	git log --pretty=format:"%an <%ae>" | sort | uniq -c | sort -n -r >> CONTRIBUTORS.md
	echo '```'             >> CONTRIBUTORS.md
	echo                   >> CONTRIBUTORS.md
	echo "(Ends)"          >> CONTRIBUTORS.md

clean:
	find . -name '*~' -exec rm {} ';'

.PHONY: test clean
