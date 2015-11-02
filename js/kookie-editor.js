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
        gridmode: 'square',
        gridborder: {
            style: 'solid',
            color: '#fff'
        },

        minWidth: 50,
        minHeight: 50
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
                $imgBackground = $('<img>').addClass(plugin.settings.cssPrefix +'-image-background'),
                $imgOverlay = $('<div>').addClass(plugin.settings.cssPrefix +'-image-overlay'),
                $gridContainer = $('<div>').addClass(plugin.settings.cssPrefix +'-grid-container'),
                width, height, scale, cssparams;

            plugin.editor = {
                $el: $editor,
                image: image,
                scale: getScale($window.width(), $window.height(), image.width, image.height),
                settings: $.extend(true, {}, _editorSettings, settings)
            };

            $editor.addClass(plugin.settings.cssPrefix +'-gridmode-'+ plugin.editor.settings.gridmode);
            $editor.addClass(plugin.settings.cssPrefix +'-gridborder-'+ plugin.editor.settings.gridborder.style);

            width = plugin.editor.image.width * plugin.editor.scale;
            height = plugin.editor.image.height * plugin.editor.scale;

            cssparams = {
                width: width +'px',
                height: height +'px',

                marginLeft: -(width/2) +'px',
                marginTop: -(height/2) +'px',
            };

            $imgBackground.attr('src', plugin.editor.image.src);
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
                $grid = $('<div>').addClass(plugin.settings.cssPrefix +'-grid'),
                $gridImage = $('<div>').addClass(plugin.settings.cssPrefix +'-grid-image'),
                $img = $('<img>');

            var gridwidth = 100, gridheight = 100;

            $grid.css({
                width: 100 +'px',
                height: 100 +'px',
                left: '300px',
                top: '50px',
                borderColor: plugin.editor.settings.gridborder.color
            });

            $grid.bind('mousedown', function(e) {
                if (e.target !== e.currentTarget && e.target.className.indexOf(plugin.settings.cssPrefix + '-pin') > -1) {
                    return;
                }

                gridMouseDown(plugin, e);
            });

            $img.attr('src', plugin.editor.image.src)
                .css({
                    width: Math.round(plugin.editor.image.width * plugin.editor.scale) +'px',
                    height: Math.round(plugin.editor.image.height * plugin.editor.scale) +'px',
                    left: '-300px',
                    top: '-50px'
                });
            $gridImage.append($img);
            $grid.append($gridImage);
            $grid.append($('<div>').addClass(plugin.settings.cssPrefix +'-grid-overlay'));

            ['nw', 'ne', 'se', 'sw'].forEach(function(direction) {
                var $pin = $('<div>').addClass(plugin.settings.cssPrefix +'-pin-'+ direction);

                $pin.bind('mousedown', function(e) {
                    var initialMouseX = e.clientX,
                        initialMouseY = e.clientY,

                        $grid = plugin.editor.$el.find('.'+ plugin.settings.cssPrefix +'-grid'),
                        $img = $grid.find('img');


                        $(this).data('start', {
                            x: $grid.position().left,
                            y: $grid.position().top,
                            width: $grid.width(),
                            height: $grid.height()
                        });

                    var gridmove = function(e) {
                        var dx = e.clientX - initialMouseX,
                            dy = e.clientY - initialMouseY;

                        pinevents[direction +'MouseMove'](plugin, dx, dy);
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
            nwMouseMove: function(plugin, dx, dy) {
                var $grid = plugin.editor.$el.find('.'+ plugin.settings.cssPrefix +'-grid'),
                    start = $grid.find('.'+ plugin.settings.cssPrefix +'-pin-nw').data('start'),
                    $img = $grid.find('img');

                if (start.x + dx <= 0)
                    dx = 0 - start.x;
                if (start.y + dy <= 0)
                    dy = 0 - start.y;

                if (start.x + dx >= start.x + start.width - plugin.editor.settings.minWidth)
                    dx = start.width - plugin.editor.settings.minWidth;
                if (start.y + dy >= start.y + start.height - plugin.editor.settings.minHeight)
                    dy = start.height - plugin.editor.settings.minHeight;

                $grid.css({
                    left: (start.x + dx) +'px',
                    width: (start.width - dx) +'px'
                });
                $grid.css({
                    top: (start.y + dy) +'px',
                    height: (start.height - dy) +'px'
                });

                $img.css({left: -(start.x + dx) +'px'});
                $img.css({top: -(start.y + dy) +'px'});
            },
            neMouseMove: function(plugin, dx, dy) {
                var $grid = plugin.editor.$el.find('.'+ plugin.settings.cssPrefix +'-grid'),
                    start = $grid.find('.'+ plugin.settings.cssPrefix +'-pin-ne').data('start'),
                    $img = $grid.find('img'),

                    editorWidth = Math.round(plugin.editor.image.width * plugin.editor.scale);

                if (start.width + dx <= plugin.editor.settings.minWidth)
                    dx = plugin.editor.settings.minWidth - start.width;
                if (start.y + dy <= 0)
                    dy = 0 - start.y;

                if (start.x + start.width + dx >= editorWidth)
                    dx = editorWidth - (start.x + start.width);
                if (start.y + dy >= start.y + start.height - plugin.editor.settings.minHeight)
                    dy = start.height - plugin.editor.settings.minHeight;

                $grid.css({
                    width: (start.width + dx) +'px'
                });
                $grid.css({
                    top: (start.y + dy) +'px',
                    height: (start.height - dy) +'px'
                });

                $img.css({top: -(start.y + dy) +'px'});
            },
            seMouseMove: function(plugin, dx, dy) {
                var $grid = plugin.editor.$el.find('.'+ plugin.settings.cssPrefix +'-grid'),
                    start = $grid.find('.'+ plugin.settings.cssPrefix +'-pin-se').data('start'),

                    editorWidth = Math.round(plugin.editor.image.width * plugin.editor.scale),
                    editorHeight = Math.round(plugin.editor.image.height * plugin.editor.scale);

                if (start.width + dx <= plugin.editor.settings.minWidth)
                    dx = plugin.editor.settings.minWidth - start.width;
                if (start.height + dy <= plugin.editor.settings.minHeight)
                    dy = plugin.editor.settings.minHeight - start.height;

                if (start.x + start.width + dx >= editorWidth)
                    dx = editorWidth - (start.x + start.width);
                if (start.y + start.height + dy >= editorHeight)
                    dy =  editorHeight - (start.y + start.height);

                $grid.css({
                    width: (start.width + dx) +'px'
                });
                $grid.css({
                    height: (start.height + dy) +'px'
                });
            },
            swMouseMove: function(plugin, dx, dy) {
                var $grid = plugin.editor.$el.find('.'+ plugin.settings.cssPrefix +'-grid'),
                    start = $grid.find('.'+ plugin.settings.cssPrefix +'-pin-sw').data('start'),
                    $img = $grid.find('img'),

                    editorHeight = Math.round(plugin.editor.image.height * plugin.editor.scale);

                if (start.x + dx <= 0)
                    dx = 0 - start.x;
                if (start.height + dy <= plugin.editor.settings.minHeight)
                    dy = plugin.editor.settings.minHeight - start.height;

                if (start.x + dx >= start.x + start.width - plugin.editor.settings.minWidth)
                    dx = start.width - plugin.editor.settings.minWidth;
                if (start.y + start.height + dy >= editorHeight)
                    dy =  editorHeight - (start.y + start.height);

                $grid.css({
                    left: (start.x + dx) +'px',
                    width: (start.width - dx) +'px'
                });
                $grid.css({
                    height: (start.height + dy) +'px'
                });

                $img.css({left: -(start.x + dx) +'px'});
            }
        };

        var gridMouseDown = function(plugin, e) {
            var initialMouseX = e.clientX,
                initialMouseY = e.clientY,

                $grid = plugin.editor.$el.find('.'+ plugin.settings.cssPrefix +'-grid'),
                $img = $grid.find('img'),

                startX = $grid.position().left,
                startY = $grid.position().top;

            var gridmove = function(e) {
                var posLeft = startX + (e.clientX - initialMouseX);
                var posTop = startY + (e.clientY - initialMouseY);

                if (posLeft <= 0)
                    posLeft = 0;
                if (posLeft >= Math.round(plugin.editor.image.width * plugin.editor.scale) - $grid.width())
                    posLeft = Math.round(plugin.editor.image.width * plugin.editor.scale) - $grid.width();
                if (posTop <= 0)
                    posTop = 0;
                if (posTop >= Math.round(plugin.editor.image.height * plugin.editor.scale) - $grid.height())
                    posTop = Math.round(plugin.editor.image.height * plugin.editor.scale) - $grid.height();

                $grid.css({left: posLeft +'px'});
                $img.css({left: -posLeft +'px'});

                $grid.css({top: posTop +'px'});
                $img.css({top: -posTop +'px'});
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
