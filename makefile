SHELL := /bin/sh
FLAGS = --outDir dist/ --outFile $(OUT) --lib es2020,dom

SRC = scripts.ts
OUT = dist/scripts.js

# --strict
#  
#

.PHONY: all watch clean
all: $(OUT)

$(OUT): $(SRC)
	tsc $(FLAGS) $(SRC)

watch: .$(SRC)
	tsc --watch $(FLAGS) $(SRC)

clean:
	rm dist/scripts.js
