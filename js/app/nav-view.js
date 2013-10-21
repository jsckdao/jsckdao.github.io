define(function(require, exports, module) {
    var $ = require('jquery'),
        BB = require('backbone');
    
	// 主版面
    var NavView = module.exports = BB.View.extend({
        el: '#main-nav',
        
        show: function(callback) {
            var self = this;
            self.trigger('beforeShow', self);
            self.once('show', callback);
            $(this.el).fadeIn(function() {
                self.trigger('show', self);
            });
        },
                
        hide: function(callback) {
            var self = this;
            self.trigger('beforeHide', self);
            self.once('hide', callback);
            $(this.el).fadeOut(function() {
                self.trigger('hide', self);
            });
        }
    });
});