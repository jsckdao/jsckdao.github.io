/**
 * 掠影模块
 */
define(function(require, exports, module) {
    var BB = require('backbone'),
        $ = require('jquery');
    
    var PhotoView = module.exports = BB.View.extend({
        el: '#photo',
        
        // 初始化
        initialize: function(option) {
            this.element = $(this.el);
            
        },
        
        nav: function(path) {
            
        },
        
        show: function(callback) {
            var el = $(this.el);
            el.css({
                left: '-100%',
                top: '0%',
                display: 'block'
            }).animate({
                left: '0%'
            }, function() {
                callback && callback();
            });
        },
        
        hide: function(callback) {
            var el = $(this.el);
            el.animate({
                left: '-100%'
            }, function() {
                el.hide();
                callback && callback();
            });
        }
    });
});