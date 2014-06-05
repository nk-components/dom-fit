
build: component.json index.js
	@./node_modules/component/bin/component-build --dev

test: build
	@./node_modules/component-test/bin/component-test browser

watch: build
	@./node_modules/rewatch/bin/rewatch index.js test/dom-fit.js -c "make build"

clean:
	rm -fr build components

.PHONY: clean test build

