/**
 * Chartist.js plugin to pre fill donouts with animations
 * author: moxx
 * author-url: https://github.com/moxx/chartist-plugin-fill-donut
 *
 */
(function(window, document, Chartist) {
    'use strict';

    var defaultOptions = {
        fillClass: 'ct-fill-donut',
        label : {
            html: '<div class="ct-fill-donut-label"></div>',
        },
        items : [{}]
    };

    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.fillDonut = function(options) {
        options = Chartist.extend({}, defaultOptions, options);
        return function fillDonut(chart){
            if(chart instanceof Chartist.Pie) {
                var $chart = $(chart.container);
                $chart.css('position', 'relative');
                var $svg;

                chart.on('draw', function(data) {
                    if(data.type == 'slice'){
                        if(data.index == 0)
                            $svg = $chart.find('svg').eq(0);

                        var $clone = $(data.group._node).clone();
                        $clone.attr('class', $clone.attr('class') + ' ' + options.fillClass);

                        $clone.find('path').each(function(){
                            $(this).find('animate').remove();
                            $(this).removeAttr('stroke-dashoffset');
                        });

                        $svg.prepend($clone);

                    }
                });

                chart.on('created', function(data){
                    $.each(options.items, function(){
                        var $wrapper = $(options.label.html);
                        var item = $.extend({}, {
                            class : '',
                            id: '',
                            content : 'fillText',
                            position: 'center', //bottom, top, left, right
                            offsetY: 0, //top, bottom in px
                            offsetX: 0 //left, right in px
                        }, this);

                        if(item.id.length > 0)
                            item.content.attr('id', item.id);
                        if(item.class.length > 0)
                            item.content.attr('class', item.class);

                        $wrapper.append(item.content).css({
                            position : 'absolute'
                        });

                        $chart.append($wrapper);

                        var cWidth = $chart.innerWidth() / 2;
                        var cHeight = $chart.height() / 2;
                        var wWidth = $wrapper.innerWidth() / 2;
                        var wHeight = $wrapper.height() / 2;

                        var style = {
                            bottom : {
                                bottom : 0 + item.offsetY,
                                left: (cWidth - wWidth) + item.offsetX,
                            },
                            top : {
                                top : 0  + item.offsetY,
                                left: (cWidth - wWidth) + item.offsetX,
                            },
                            left : {
                                top : (cHeight - wHeight) + item.offsetY,
                                left: 0 + item.offsetX,
                            },
                            right : {
                                top : (cHeight - wHeight) + item.offsetY,
                                right: 0 + item.offsetX,
                            },
                            center : {
                                top : (cHeight - wHeight) + item.offsetY,
                                left: (cWidth - wWidth) + item.offsetX,
                            }
                        };

                        $wrapper.css(style[item.position]);
                    });
                });
            }
        }
    }

}(window, document, Chartist));
