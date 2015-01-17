VERSION:= $(shell date +%Y%m%d%H%M%S)
HOST:=orienteer-1.orienteer.io
SITE:= orienteer.io
DIR:= /www/sites/$(SITE)/releases/$(VERSION)
LINK:= /www/sites/$(SITE)/current

FORCE:

build: FORCE
	echo "building"
	gulp build

push: FORCE
	echo "pushing..."
	ssh deploy@orienteer-1.orienteer.io "mkdir $(DIR) && cp -r $(LINK)/* $(DIR)/" 
	rsync -rv --delete dist/* deploy@$(HOST):$(DIR)

launch: FORCE
	echo "launching..."
	ssh deploy@orienteer-1.orienteer.io "rm -f $(LINK) ; ln -s $(DIR) $(LINK)"


release: build push launch
	echo "DONE MOFO!"
