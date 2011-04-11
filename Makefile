SRC    			= guides/src
BUILD  			= guides/build
PANDOC_OPT 		= --toc 

GUIDES = $(notdir $(wildcard $(SRC)/*.pdc))
HTML_GUIDES = $(addprefix $(BUILD)/, $(GUIDES:.pdc=.html))

html: $(HTML_GUIDES)

guides/build/%.html : guides/src/%.pdc
	@pandoc \
		$(PANDOC_OPT) \
		$< \
		-o $@

deploy: html
	git push nodester master
	git push origin master

dev: html
	node app.js

clean:
	@rm -rf $(BUILD)/*

