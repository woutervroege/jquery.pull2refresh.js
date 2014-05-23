/*
 * @package jquery.pull2refresh.js
 * @copyright Copyright(c) 2014 Wouter Vroege. <info AT woutervroege DOT nl>
 * @author Wouter Vtoege <wouter AT woutervroege DOT nl>
 * @author Olmo Kramer <olmo DOT kramer AT gmail DOT com>
 * @licence https://github.com/woutervroege/jquery.pull2refresh.js/blob/master/LICENSE MIT License
 */

"use strict";

(function($) {

    var ELEM;
    var isHiding = false;

    function calculateAnimationTop(dragY) {
        var rads = dragY * Math.PI / (4 * $(window).height());
        return Math.pow(Math.cos(rads), 2) * dragY;
    }

    function setLoaderImage() {
        $(ELEM).before($('<img src="' + ELEM.config.loaderImage + '" alt="loader" class="' + ELEM.config.loaderClass + '"/>'));
    }

    var methods = {
        init: function(options) {
            ELEM = this;
            ELEM.config = options || {};
            ELEM.config.loaderImage = ELEM.config.loaderImage || "loader.gif";
            ELEM.config.loaderClass = ELEM.config.loaderClass || "pull2refresh-loader";
            ELEM.config.start = ELEM.config.start || function() {};

            setLoaderImage();

            $(ELEM).draggable({
                axis: "y",
                helper: function() {
                    return $('<div></div>').css('opacity', 0);
                },
                create: function() {
                    var $this = $(this);
                    $this.data('starttop', $this.position().top);
                },
                stop: function(event, ui) {
                    if (isHiding) {
                        return;
                    }
                    var $this = $(this);
                    if (ui.helper.position().top >= 200) {
                        ELEM.config.start();
                        var top = 200;
                    }
                    $this.stop().velocity({
                        top: top || $this.data('starttop')
                    }, 400, 'easeOutCirc', function() {});
                },
                drag: function(event, ui) {
                    $(this).stop().velocity({
                        top: calculateAnimationTop(ui.helper.position().top)
                    }, 400, 'easeOutCirc');
                }
            });

        },
        hide: function() {
            isHiding = true;
            $(ELEM).stop().velocity({
                top: 0
            }, 600, 'easeOutCirc', function() {
                isHiding = false;
            });
        }
    };

    $.fn.pull2refresh = function(methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.tooltip');
        }
    };

})(jQuery);