define(function(require, exports, module) {
    var $ = require('jquery'),
        BB = require('backbone');
    
	// 头像页
    var HeaderView = module.exports = BB.View.extend({
        el: '#header',
        
        move: function(option) {
            $(this.el).animate(option); 
        }
    }); 
});