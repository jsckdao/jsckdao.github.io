define(function(require, exports, module) {
    var $ = require('jquery'),
        BB = require('backbone');
    
	// 头像页
    var HeaderView = module.exports = BB.View.extend({
        el: '#header',
        
        move: function(option) {
            var el = this.element = $(this.el);
            var offset = el.offset();
            var cw = window.innerWidth || document.body.offsetWidth;
            var ch = window.innerHeight || document.body.offsetWidth;
            
            var ow = this.el.offsetWidth / 2 - 1;
            var oh = this.el.offsetHeight / 2  - 1;
            offset.left += ow;
            offset.top += oh;
            
            if (typeof option.left != 'undefined') {
                el.css({
                    left: offset.left + 'px',
                    right: 'auto'
                });
            }
            else if (typeof option.right != 'undefined') {
                el.css({
                    left: 'auto',
                    right: (cw - offset.left - ow) + 'px'
                });
            }
            
            if (typeof option.bottom != 'undefined') {
                el.css({
                    top: 'auto',
                    bottom: (ch - offset.top - oh) + 'px'
                });
            }
            else if (typeof option.top != 'undefined') {
                el.css({
                    top: offset.top + 'px',
                    bottom: 'auto'
                });
            }
            
            el.animate(option); 
        }
    }); 
});