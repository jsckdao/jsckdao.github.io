define(function(require, exports, module) {
    var $ = require('jquery'),
        BB = require('backbone'),
        HeaderView = require('./header.js'),
        MainNavView = require('./nav-view.js'),
        PhotoView = require('./photo-view.js'),
        WrittingView = require('./writting-view.js');
    
    
    // 加载版面
    var LoadingView = BB.View.extend({
        el: '#loading',
        
        hide: function(callback) {
            $(this.el).hide(); 
            callback && callback(); 
        }
    }); 
    
    $(function() {
        // 视图初始化
        var header = new HeaderView(); 
        var currentView = new LoadingView(); 
        var mainnavView = new MainNavView(); 
        var writtingView = new WrittingView(); 
        var photoView = new PhotoView();
        
        // 相片视图的事件
        photoView.on('show', function() {
            header.backBtnForward = 'left';
            header.dialogForward = 'tl';
        })
        .on('beforeHide', function() {
            header.backBtnForward = null;
        })
        .on('hide', function() {
            header.dialogForward = 'tc';
            header.closeDialog();
        });
        
        // 文抄视图事件
        writtingView.on('show', function() {
            header.backBtnForward = 'right';
            header.dialogForward = 'br';
        })
        .on('beforeHide', function() {
            header.backBtnForward = null;
        })
        .on('hide', function() {
            header.dialogForward = 'tc';
            header.closeDialog();
        });
        
        
        mainnavView.on('hide', function() {
            header.closeDialog();
        });
        
        var app = BB.history; 
        
        // 视图切换
        var changeView = function(targetView, headerOp, other) {
            if (currentView !== targetView) {
                currentView.hide(function() {
                    header.move(headerOp); 
                    targetView.show(); 
                    other && other(); 
                }); 
                currentView = targetView; 
            }
            else other && other();
        }; 

        // 主页路由
        app.route(/^$/, function() {
            changeView(mainnavView, {
                left: '50%',
                top: '50%'
            }); 
        }); 
        
        // 文抄页路由
        app.route(/^(writting\/[\w\/\.\-]*)$/, function(path) {
            changeView(writtingView, {
                left: '90px',
                top: '40px'
            }, function() {
                writtingView.nav(path); 
            }); 
        }); 
        
        // 掠影页路由
        app.route(/^(photo\/[\w\/\.\-]*)$/, function(path) {
            
            changeView(photoView, {
                bottom: '40px',
                right: '120px'
            }, function() {
                photoView.nav(path);
            });
        }); 
        
        // 当发现没有的匹配路径, 导航到首页
        app.on('nomatched', function(hash) {
            BB.history.navigate(''); 
        }); 
        
        app.start({ pushState: false }); 
    });   
});