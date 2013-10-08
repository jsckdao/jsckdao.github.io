define(function(require, exports, module) {
    var $ = require('jquery'), BB = require('backbone');

    // 文抄视图
    var WrittingView = module.exports = BB.View.extend({
        el : '#writting',

        // 初始化
        initialize : function() {
            var self = this;
            this.element = $(this.el);
            this.content = this.element.find('.content');

        },

        // 页面切换
        nav : function(path) {
            var mask = $('<div class="mask" />');
            var iframe = $('<iframe />').attr({
                frameborder : 0,
                src : path
            }).load(function() {
                mask.fadeOut(function() {
                    mask.remove();
                });
            });

            var b = $();
            b.push(iframe[0], mask[0]);

            if (this.currentPath && this.currentFrame) {
                var forward = this.checkForward(path, this.currentPath);
                // 移动完成时老页面清除函数生成器
                var cleanFn = function(frame) {
                    return function() {
                        frame.remove();
                    };
                };
                switch (forward) {
                // 向左移动
                case 'left':
                    b.css({
                        top : '0%',
                        left : '100%'
                    }).animate({
                        left : '0%'
                    });
                    this.currentFrame.animate({
                        left : '-100%'
                    }, cleanFn(this.currentFrame));
                    break;
                // 向右移动
                case 'right':
                    b.css({
                        top : '0%',
                        left : '-100%'
                    }).animate({
                        left : '0%'
                    });
                    this.currentFrame.animate({
                        left : '100%'
                    }, cleanFn(this.currentFrame));
                    break;
                // 向上移动
                default:
                    b.css({
                        top : '100%',
                        left : '0%'
                    }).animate({
                        top : '0%'
                    });
                    this.currentFrame.animate({
                        top : '-100%'
                    }, cleanFn(this.currentFrame));
                    break;
                }

            }
            else {
                b.css({
                    top : '0%',
                    lef : '0%'
                });
            }
            b.appendTo(this.content);
            this.currentPath = path;
            this.currentFrame = iframe;
        },

        // 根据路径检查方位
        checkForward : function(p1, p2) {
            p1 = p1.split('/');
            p2 = p2.split('/');
            [ p1, p2 ].forEach(function(arr) {
                _.last(arr) == '' && arr.pop();
            });

            if (p1.length < p2.length) {
                return 'right';
            }
            else if (p1.length > p2.length) {
                return 'left';
            }
            else {
                return 'top';
            }
        },

        // 显示
        show : function(callback) {
            var el = $(this.el);
            el.css({
                'left' : '100%',
                'top' : '0%',
                'display' : 'block'
            }).animate({
                'left' : '0%'
            }, function() {
                callback && callback();
            });
        },

        // 隐藏
        hide : function(callback) {
            var el = $(this.el);
            var self = this;
            el.animate({
                left : '100%'
            }, function() {
                el.hide();
                self.currentFrame.remove();
                self.currentPath = self.currentFrame = null;
                callback && callback();
            });
        }
    });
});