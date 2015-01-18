VERSION:= $(shell date +%Y%m%d%H%M%S)
HOST:=orienteer-1.orienteer.io
SITE:= orienteer.io
DIR:= /www/sites/$(SITE)/releases/$(VERSION)
PRODUCTION_LINK:= /www/sites/$(SITE)/production
STAGING_LINK:= /www/sites/$(SITE)/staging

FORCE:

clean: FORCE
	echo "cleaning"
	gulp clean


build: FORCE
	echo "building"
	gulp build

push: FORCE
	echo "pushing..."
	ssh deploy@orienteer-1.orienteer.io "mkdir $(DIR) && cp -r $(PRODUCTION_LINK)/* $(DIR)/" 
	rsync -rv --delete dist/* deploy@$(HOST):$(DIR)

launch: FORCE
	echo "launching..."
	ssh deploy@orienteer-1.orienteer.io "rm -f $(PRODUCTION_LINK) ; ln -s $(DIR) $(PRODUCTION_LINK)"

launch_staging: FORCE
	echo "launching staging..."
	ssh deploy@orienteer-1.orienteer.io "rm -f $(STAGING_LINK) ; ln -s $(DIR) $(STAGING_LINK)"

release: build push launch
	echo "Pushed to orienteer.io"

staging: build push launch_staging
	echo "Pushed to staging.orienteer.io"
