all:
	node bin/compileShaders.js
	tsc --outDir dist --module amd --noImplicitAny src/base.ts