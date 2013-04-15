# You can set these variables from the command line.
SPHINXOPTS    =
SPHINXBUILD   = sphinx-build
PAPER         =
BUILDDIR      = build

# Internal variables.
PAPEROPT_a4     = -D latex_paper_size=a4
PAPEROPT_letter = -D latex_paper_size=letter
ALLSPHINXOPTS   = -d $(BUILDDIR)/doctrees $(PAPEROPT_$(PAPER)) $(SPHINXOPTS) guides

json:
	$(SPHINXBUILD) -b json $(ALLSPHINXOPTS) $(BUILDDIR)/json
	@rm -rf $(BUILDDIR)/json/_sources/
	@rm -rf $(BUILDDIR)/json/*.pickle
	@rm -rf $(BUILDDIR)/json/*.inv
	@rm -rf $(BUILDDIR)/doctrees/
	@rm -rf $(BUILDDIR)/json/_images/
	@for file in `find $(BUILDDIR)/json/ -name "*.fjson"`; do \
		sed -i 's/..\/..\/_images/\/img/g' $${file} ; \
		done;
	@echo
	@echo "Build finished. The JSON pages are in $(BUILDDIR)/json."

tests:
	expresso

deploy: tests
	git push origin master

refresh:
	git pull

dev: json
	node app.js

clean:
	@rm -rf $(BUILDDIR)/*

prod: refresh json
	node server.js

env:
	@virtualenv env && \
		. env/bin/activate && \
		pip install nodeenv && \
		nodeenv --node=0.4.12 --npm=1.0.106 -p && \
		npm install
