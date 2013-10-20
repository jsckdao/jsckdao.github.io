define(function(require, exports, module) {
    var $ = require('jquery'),
        BB = require('backbone');
    
	// 头像页
    var HeaderView = module.exports = BB.View.extend({
        el: '#header',
        
        // 初始化
        initialize: function(option) {
            var self = this;
            this.element = $(this.el);
            this.bottom = this.right = null;
            
            // 如果设定为 bottom 和 right 定位时, 须在窗体大小变换时自动适应
            $(window).resize(function() {
                var size = $.getWindowSize();
                if (self.bottom != null) {
                    self.element.css('top', (size.height - self.bottom) + 'px');
                }
                
                if (self.right != null) {
                    self.element.css('left', (size.width - self.right) + 'px');
                }
            });
            
            // 单击头像
            this.element
            .click(function() {
                
            })
            .mouseover(function() {
                
            })
            .mouseout(function() {
                
            });
        },
        
        // 头像移动
        move: function(option) {
            var el = this.element;
            var self = this;
            var size = $.getWindowSize();
            
            if (typeof option.left != 'undefined') {
                self.right = null;
            }
            else if (typeof option.right != 'undefined'){
                self.right = parseFloat(option.right);
                option.left = (size.width - self.right) + 'px';
            }
            
            if (typeof option.top != 'undefined') {
                self.bottom = null;
            }
            else if (typeof option.bottom != 'undefined') {
                self.bottom = parseFloat(option.bottom);
                option.top = (size.height - self.bottom) + 'px';
            }
            el.animate(option); 
        },
        
        // 展现对话框
        showDialog: function(chat, forward) {
            
        },
        
        showBackBtn: function(forward) {
            
        } 
    }); 
});