SHELL := /bin/sh
FLAGS := --lib es2020,dom

SRC = src/scripts.ts
OUT = dist/scripts.js

.PHONY: all watch clean
all: $(OUT)

$(OUT): $(SRC)
	tsc $(FLAGS) --project .

watch: $(SRC)
	tsc $(FLAGS) --watch --project .

clean:
	rm -r dist/
