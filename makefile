SHELL := /bin/sh
FLAGS := --lib es2022,dom

TS_SRCS := $(shell find src/ -type f -name '*.ts')
HTML_BLOBS := $(shell find src/blobs/ -type f)
OUT = dist/scripts.js
TEST_IN = test/test.ts
TEST_OUT = test/test.js
TEST_HTML = index-test.html
TEST_HELP = 'please check browser console for test output'

.PHONY: all watch clean deploy test test-watch
all: $(OUT) index.html

index.html: src/index.html.m4 $(HTML_BLOBS)
	m4 --prefix-builtins --include src/blobs/ $< > $@

$(OUT): $(TS_SRCS)
	tsc $(FLAGS) --project .

watch: $(TS_SRCS)
	tsc $(FLAGS) --watch --project .

clean:
	rm -r dist/ > /dev/null 2>&1 || true
	$(RM) index.html
	rm $(TEST_OUT) $(TEST_HTML) > /dev/null 2>&1 || true

deploy: all
	scp -r index.html styles.css dist/ dansohost:/var/www/dragon-scales

$(TEST_OUT): $(TEST_IN) $(TS_SRCS)
	tsc $(FLAGS) test/test.ts

$(TEST_HTML): $(TEST_IN) $(TS_SRCS) index.html
	sed 's_</body>_<script src="$(TEST_OUT)"></script>\n</body>_' index.html > $(TEST_HTML)

test: $(TEST_OUT) $(TEST_HTML)
	echo $(TEST_HELP)
	xdg-open $(TEST_HTML)

test-watch: $(TEST_IN)
	tsc $(FLAGS) --watch
