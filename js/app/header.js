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
            // 头像右下角定位的数值, 如果为null, 则认为是以左上角定位
            this.bottom = this.right = null;
            // 返回按钮的展现方向
            this.backBtnForward = null;
            // 对话框的展现方向
            this.dialogForward = 'tc';
            
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
                self.showDialog('理论上, 点击这里的时候应该会有一些很好玩的功能, 不过可惜, 这家伙太懒, 功能至今还不稳定, 暂未开放... o(︶︿︶\')o');
            })
            // 鼠标移入时显示返回按钮
            .mouseover(function(evt) {
                self.showBackBtn();
            })
            // 鼠标移出时开始定时隐藏返回按钮
            .mouseout(function(evt) {
                if (self.backBtn) {
                    if (self.backBtn.timeoutHander) {
                        clearTimeout(self.backBtn.timeoutHander);
                    }
                    
                    self.backBtn.timeoutHander = setTimeout(function() {
                        self.closeBackBtn();
                    }, 3000);
                }
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
        showDialog: function(chat) {
            
        },
        
        // 关闭对话框
        closeDialog: function() {
            
        },
        
        showBackBtn: function() {
            var self = this;
            if (!self.backBtnForward) {
                return;
            }
            
            // 构建
            if (!self.backBtn) {
                self.backBtn = $('<div class="back-btn"></div>')
                .appendTo(self.element)
                .click(function() {
                    self.closeBackBtn();
                });
                
                self.backBtn.a = $('<a href="#" />').appendTo(self.backBtn);
                
                var showBack = function() {
                    self.trigger('showBackBtn', self);
                };
                
                switch (self.backBtnForward) {
                case 'left':
                    self.backBtn
                    .animate({
                        left: '70px'
                    }, 'fast', showBack)
                    .a.css('backgroundPosition', '0px 0px');
                    break;
                case 'right': 
                    self.backBtn
                    .animate({
                        left: '-56px'
                    }, 'fast', showBack)
                    .a.css('backgroundPosition', '0px -32px');
                    break;
                case 'top': 
                    self.backBtn.animate({
                        top: '-56px'
                    }, 'fast', showBack)
                    .a.css('backgroundPosition', '0px -96px');
                    break;
                default:
                    self.backBtn.animate({
                        top: '70px'
                    }, 'fast', showBack)
                    .a.css('backgroundPosition', '0px -64px');
                    break;
                }
            }
            
            // 清楚隐藏定时
            if (self.backBtn.timeoutHander) {
                clearTimeout(self.backBtn.timeoutHander);
                self.backBtn.timeoutHander = null;
            }
        },
        
        closeBackBtn: function() {
            var self = this;
            if (self.backBtn) {
                // 清楚隐藏定时
                if (self.backBtn.timeoutHander) {
                    clearTimeout(self.backBtn.timeoutHander);
                    self.backBtn.timeoutHander = null;
                }
                
                self.backBtn.animate({
                    top: '7px',
                    left: '7px'
                }, 'fast' ,function() {
                    self.backBtn.remove();
                    self.backBtn = null;
                    self.trigger('closeBackBtn', self);
                });
            }
        }
    }); 
});