/********************************
 * 什么屁玩意都在这里面, 吼吼
 * @param {type} $ 
 * @param {type} BB
 * @returns {undefined}
 */
(function($, BB) {
    
    // 头像页
    var HeaderView = BB.View.extend({
        el: '#header',
        
        move: function(option) {
            $(this.el).animate(option);
        }
    });
    
    // 主版面
    var MainNavView = BB.View.extend({
        el: '#main-nav',
        
        show: function() {
            $(this.el).fadeIn();
        },
                
        hide: function(callback) {
            $(this.el).fadeOut(callback);
        }
    });
    
    // 加载版面
    var LoadingView = BB.View.extend({
        el: '#loading',
        
        hide: function(callback) {
            $(this.el).hide();
            callback && callback();
        }
    });
    
    // 文抄视图
    var WrittingView = BB.View.extend({
        el: '#writting',
                
        initialize: function() {
            console.log('init')
        },
                
        render: function() {
            console.log('render');
            var self = this;
            this.element = $(this.el);
            this.content = this.element.find('.content');
            this.element.on('resize', function() {
                console.log('resize')
            })
        },
                
        nav: function(path) {
            
        },
                
        show: function(callback) {
            var el = $(this.el);
            el.css({
                'left': '100%',
                'top': '0%',
                'display': 'block'
            }).animate({
                'left': '0%'
            }, function() {
                callback && callback();
            });
        },
                
        hide: function(callback) {
            var el = $(this.el);
            el.animate({
                left: '100%'
            }, function() {
                el.hide();
                callback && callback();
            });
        }
    });
    
    $(function() {
        // 视图初始化
        var header = new HeaderView();
        var currentView = new LoadingView();
        var mainnavView = new MainNavView();
        var writtingView = new WrittingView();
        
        var app = BB.history;
        
        var changeView = function(targetView, headerOp, other) {
            if (currentView !== targetView) {
                currentView.hide(function() {
                    header.move(headerOp);
                    targetView.show();
                    other && other();
                });
                currentView = targetView;
            }
        };

        // 主页路由
        app.route(/^$/, function() {
            changeView(mainnavView, {
                left: '50%',
                top: '50%'
            });
        });
        
        // 文抄页路由
        app.route(/^(writting\/[\w\/\.]*)$/, function(path) {
            changeView(writtingView, {
                left: '90px',
                top: '40px'
            }, function() {
                writtingView.nav(path);
            });
        });
        
        // 掠影页路由
        app.route(/^(photo\/[\w\/\.]*)$/, function(path) {
            
        });
        
        // 当发现没有的匹配路径, 导航到首页
        app.on('nomatched', function(hash) {
            BB.history.navigate('');
        });
        
        app.start({ pushState: false });
        
    });
})(jQuery, Backbone);