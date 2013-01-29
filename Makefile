.PHONY: all
.DEFAULT: all

all:
	/usr/bin/env npm install

publish: all
	/usr/bin/env npm publish

lint:
	tools/lint.sh

tests: test
check: test
test: all lint
	tools/test.sh
