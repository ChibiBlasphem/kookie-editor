(function() {
    var $window = $(window),
        $document = $(document),
        $body = $(document.body),
        _instance, pluginSettings;
        
    var _pluginSettings = {
        cssPrefix: 'keditor',
        lang: 'en'
    };
    var _editorSettings = {
        gridmode: 'square'
    };
        
    var KookieEditor = (function() {
        var init = function(settings) {
            var $plugin = $('<div>').addClass(settings.cssPrefix);

            $plugin.append($('<div>').addClass(settings.cssPrefix +'-overlay'));
            $body.append($plugin);
            
            return $plugin;
        };
        
        var deferred = function(fn) {
            var $dfd = $.Deferred();
            fn($dfd);
            return $dfd;
        };
        
        var getScale = function(maxwidth, maxheight, width, height) {
            var scalex = 1, scaley = 1;
                
            if (maxwidth < width) {
                scalex = maxwidth / width;
            }
            if (maxheight < height) {
                scaley = maxheight / height;
            }
            
            return Math.min(scalex, scaley);
        };
        
        var editImage = function(plugin, image, settings) {
            var $editor = $('<div>').addClass(plugin.settings.cssPrefix +'-editor'),
                $imgBackground = $('<div>').addClass(plugin.settings.cssPrefix +'-image-background'),
                $imgOverlay = $('<div>').addClass(plugin.settings.cssPrefix +'-image-overlay'),
                $gridContainer = $('<div>').addClass(plugin.settings.cssPrefix +'-grid-container'),
                width, height, scale, cssparams;
            
            plugin.editor = {
                image: image,
                scale: getScale($window.width(), $window.height(), image.width, image.height),
                settings: $.extend({}, _editorSettings, settings)
            };
            
            $editor.addClass(plugin.settings.cssPrefix +'-gridmode-'+ plugin.editor.settings.gridmode);
            
            width = plugin.editor.image.width * plugin.editor.scale;
            height = plugin.editor.image.height * plugin.editor.scale;
            
            cssparams = {
                width: width +'px',
                height: height +'px',
                
                marginLeft: -(width/2) +'px',
                marginTop: -(height/2) +'px',
            };
            
            $imgBackground.css('backgroundImage', 'url('+ plugin.editor.image.src +')');
            $imgBackground.css(cssparams);
            $imgOverlay.css(cssparams);
            $gridContainer.css(cssparams);
            
            $editor.append($imgBackground);
            $editor.append($imgOverlay);
            
            createEditionGrid(plugin, $gridContainer);
            $editor.append($gridContainer);
            
            plugin.$el.append($editor);
        };
        
        var createEditionGrid = function(plugin, $gridContainer) {
            var image = plugin.editor.image,
                $grid = $('<div>').addClass(plugin.settings.cssPrefix +'-grid');
                
            var gridwidth = 100, gridheight = 100;
                
            $grid.css({
                width: 100 +'px',
                height: 100 +'px',
                left: '300px',
                top: '50px',
                
                backgroundImage: 'url('+ plugin.editor.image.src +')',
                backgroundSize: (plugin.editor.image.width * plugin.editor.scale) +'px '+ (plugin.editor.image.height * plugin.editor.scale) +'px',
                backgroundPosition: '-300px -50px'
            });
            
            $grid.bind('mousedown', function(e) {
                if (e.target !== e.currentTarget) {
                    return;
                }
                
                gridMouseDown($grid, e);
            });
            
            ['nw', 'ne', 'se', 'sw'].forEach(function(direction) {
                var $pin = $('<div>').addClass(plugin.settings.cssPrefix +'-pin-'+ direction);
                
                $pin.bind('mousedown', function(e) {
                    var oldPosition = {x: e.clientX, y: e.clientY};
                    
                    var gridmove = function(e) {
                        oldPosition = pinevents[direction +'MouseMove']($grid, e);
                    };
                    $document.bind('mousemove', gridmove);
                    
                    $document.one('mouseup', function(e) {
                        $document.unbind('mousemove', gridmove);
                    });
                });
                
                $grid.append($pin);
            });
            
            $gridContainer.append($grid);
        };
        
        var pinevents = {
            nwMouseMove: function($grid, e) {
                console.log('MOVE PIN nw');
            },
            neMouseMove: function($grid, e) {
                console.log('MOVE PIN ne');
            },
            seMouseMove: function($grid, e) {
                console.log('MOVE PIN se');
            },
            swMouseMove: function($grid, e) {
                console.log('MOVE PIN sw');
            }
        };
        
        var gridMouseDown = function($grid, e) {
            var oldPosition = {x: e.clientX, y: e.clientY};
            
            var gridmove = function(e) {
                var posLeft = $grid.position().left - (oldPosition.x - e.clientX);
                var posTop = $grid.position().top - (oldPosition.y - e.clientY);
                
                if (posLeft >= 0) {// && posTop >= 0) {
                    $grid.css({
                        left: posLeft,
                        backgroundPositionX: '-'+ posLeft +'px'
                    });
                } else {
                    $grid.css({
                        left: 0,
                        backgroundPositionX: 0
                    });
                }
                
                if (posTop >= 0) {
                    $grid.css({
                        top: posTop,
                        backgroundPositionY: '-'+ posTop +'px'
                    });
                } else {
                    $grid.css({
                        top: 0,
                        backgroundPositionY: 0
                    });
                }
                
                oldPosition = {x: e.clientX, y: e.clientY};
            };
            $document.bind('mousemove', gridmove);
            
            $document.one('mouseup', function(e) {
                $document.unbind('mousemove', gridmove);
                console.log('Release THE KRAKEN');
            });
        };
        
        var keditor = function(settings) {
            this.settings = settings;
            this.$el = init(this.settings);
            
            this.editor = null;
        };
        keditor.prototype.load = function (url, settings) {
            var _this = this;
            return deferred(function($dfd) {
                var image = new Image();
                image.addEventListener('load', function() {
                    $body.addClass(_this.settings.cssPrefix +'-unselectable');
                    
                    editImage(_this, image, settings);
                    $dfd.resolve(_this);
                });
                image.src = url;
            });
        };
        
        return keditor;
    })();
    
    (function() {
        $.KookieEditor = function() {
            if (typeof _instance == 'undefined') {
                _instance = new KookieEditor($.extend({}, _pluginSettings, (pluginSettings || {})));
            }
            return _instance;
        };
        $.KookieEditor.settings = function(settings) {
            pluginSettings = settings;
        };
    })();
})();
