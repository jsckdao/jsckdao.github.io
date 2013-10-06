define(function(require, exports, module) {
    var $ = require('jquery'),
        BB = require('backbone');
    
	// 主版面
    var NavView = module.exports = BB.View.extend({
        el: '#main-nav',
        
        show: function() {
            $(this.el).fadeIn() 
        },
                
        hide: function(callback) {
            $(this.el).fadeOut(callback) 
        }
    }) 
})