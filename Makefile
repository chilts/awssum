all:

clean:
	find . -name '*~' -exec rm {} ';'

.PHONY: clean
