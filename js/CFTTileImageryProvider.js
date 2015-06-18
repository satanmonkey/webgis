
var CFTTileImageryProvider = function CFTTileImageryProvider(description) {
    var trailingSlashRegex = /\/$/;
    var defaultCredit = new Cesium.Credit('CFT');
    description = Cesium.defaultValue(description, {});

    var url = Cesium.defaultValue(description.url, 'http://localhost:88/tiles');
    if (!trailingSlashRegex.test(url)) {
        //url = url + '/';
    }

    this._url = url;
    this._imageType = Cesium.defaultValue(description.imageType, 'google_sat');
    this._fileExtension = Cesium.defaultValue(description.fileExtension, 'png');
    this._proxy = description.proxy;
    this._tileDiscardPolicy = description.tileDiscardPolicy;

    
    this._tilingScheme = new Cesium.WebMercatorTilingScheme({
        numberOfLevelZeroTilesX : 1,
        numberOfLevelZeroTilesY : 1
    });

    this._tileWidth = 256;
    this._tileHeight = 256;

    this._minimumLevel = Cesium.defaultValue(description.minimumLevel, 0);
    this._maximumLevel = Cesium.defaultValue(description.maximumLevel, 17);
    this._extent = Cesium.defaultValue(description.extent, this._tilingScheme.extent);
    this._rectangle = Cesium.defaultValue(description.rectangle, this._tilingScheme.rectangle);

    // Check the number of tiles at the minimum level.  If it's more than four,
    // throw an exception, because starting at the higher minimum
    // level will cause too many tiles to be downloaded and rendered.
    //var swTile = this._tilingScheme.positionToTileXY(this._extent.getSouthwest(), this._minimumLevel);
    //var neTile = this._tilingScheme.positionToTileXY(this._extent.getNortheast(), this._minimumLevel);
    //var tileCount = (Math.abs(neTile.x - swTile.x) + 1) * (Math.abs(neTile.y - swTile.y) + 1);
    //if (tileCount > 4) {
        //throw new Cesium.DeveloperError('The imagery provider\'s extent and minimumLevel indicate that there are ' + tileCount + ' tiles at the minimum level. Imagery providers with more than four tiles at the minimum level are not supported.');
    //}

    this._errorEvent = new Cesium.Event();

    this._ready = true;

    var credit = Cesium.defaultValue(description.credit, defaultCredit);
    if (typeof credit === 'string') {
        credit = new Cesium.Credit(credit);
    }
    this._credit = credit;
};




CFTTileImageryProvider.prototype.buildImageUrl = function(imageryProvider, imageType, x, y, level) {
    var url = imageryProvider._url ;
    url += '?image_type=' + imageType + '&x=' + x + '&y=' + y + '&level=' + level;
    //console.log("url=" + url);
    var proxy = imageryProvider._proxy;
    if (Cesium.defined(proxy)) {
        url = proxy.getURL(url);
    }
    return url;
}

Cesium.defineProperties(CFTTileImageryProvider.prototype, {
    url : {
        get : function() {
            return this._url;
        }
    },

    proxy : {
        get : function() {
            return this._proxy;
        }
    },

    tileWidth : {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('tileWidth must not be called before the imagery provider is ready.');
            }

            return this._tileWidth;
        }
    },

    tileHeight: {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('tileHeight must not be called before the imagery provider is ready.');
            }

            return this._tileHeight;
        }
    },

    maximumLevel : {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
            }
            return this._maximumLevel;
        }
    },

    minimumLevel : {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
            }

            return this._minimumLevel;
        }
    },

    tilingScheme : {
        get : function() {
            if (!this._ready) {
                throw new DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
            }
            return this._tilingScheme;
        }
    },

    extent : {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('extent must not be called before the imagery provider is ready.');
            }
            return this._extent;
        }
    },
    rectangle : {
        get : function() {
            if (!this._ready) {
                throw new DeveloperError('rectangle must not be called before the imagery provider is ready.');
            }
            return this._rectangle;
        }
    },

    tileDiscardPolicy : {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.');
            }
            return this._tileDiscardPolicy;
        }
    },

    errorEvent : {
        get : function() {
            return this._errorEvent;
        }
    },

    ready : {
        get : function() {
            return this._ready;
        }
    },

    credit : {
        get : function() {
            return this._credit;
        }
    }
});

CFTTileImageryProvider.prototype.getTileCredits = function(x, y, level) {
    return undefined;
};

CFTTileImageryProvider.prototype.requestImage = function(x, y, level) {
    if (!this._ready) {
        throw new Cesium.DeveloperError('requestImage must not be called before the imagery provider is ready.');
    }

    var url = CFTTileImageryProvider.prototype.buildImageUrl(this, this._imageType, x, y, level);
    return Cesium.ImageryProvider.loadImage(this, url);
};

//http://restapi.amap.com/v3/staticmap?location=116.37359,39.92437&zoom=0&size=256*256&key=ee95e52bf08006f63fd29bcfbcf21df0
