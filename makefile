SHELL := /bin/sh
FLAGS := --lib es2020,dom

SRC = src/scripts.ts
OUT = dist/scripts.js
TEST_IN = test/test.ts
TEST_OUT = test/test.js
TEST_HTML = index-test.html
TEST_HELP = 'please check browser console for test output'

.PHONY: all watch clean test test-watch
all: $(OUT)

$(OUT): $(SRC)
	tsc $(FLAGS) --project .

watch: $(SRC)
	tsc $(FLAGS) --watch --project .

clean:
	rm -r dist/ > /dev/null 2>&1 || true
	rm $(TEST_OUT) $(TEST_HTML) > /dev/null 2>&1 || true

$(TEST_OUT): $(TEST_IN) $(SRC)
	tsc $(FLAGS) test/test.ts

$(TEST_HTML): $(TEST_IN) $(SRC) index.html
	sed 's_</body>_<script src="$(TEST_OUT)"></script>\n</body>_' index.html > $(TEST_HTML)

test: $(TEST_OUT) $(TEST_HTML)
	echo $(TEST_HELP)
	xdg-open $(TEST_HTML)

test-watch: $(TEST_IN)
	tsc $(FLAGS) --watch
