/**
 * 掠影模块
 */
define(function(require, exports, module) {
    var BB = require('backbone'),
        $ = require('jquery');
    
    var storage = window.localStorage || {};
    var Photos = null; // storage['photos'] ? $.parseJSON(storage['photos']) : null;
    
    var PhotoView = module.exports = BB.View.extend({
        el: '#photo',
        
        // 初始化
        initialize: function(option) {
            var self = this;
            this.element = $(this.el);
            this.box = this.element.find('.photo-box');
            // 已经绘制的照片数
            this.already = 0;
            // 当前显示的照片索引
            this.currentPhotoIndex = null;
            // 当滚动条滚动至底时, 自动加载其他照片
            this.element.scroll(function() {
                if (!self.isStopPaint()) {
                    self.startPaint();
                }
            });
        },
        
        nav: function(path) {
            
        },
        
        // 开始绘制所有的略缩图
        startPaint: function() {
            var len = Photos.length;
            var box = this.box;
            var self = this;
            
            var a = 0;
            var b = 0;
            var size = $.getWindowSize();
            
            for (;this.already < len; this.already++, a++) {
                // 判断照片是否多到用户看不到
                if (this.isStopPaint()) {
                    break;
                }
                var m = Photos[this.already];
                var img = new Image();
                (function(i, m, img) {
                    $(img).load(function() {
                        $(this).hide().appendTo(box).fadeIn();
                        // ie8 下图片如果有缓存的情况下会出现onload事件在 src
                        // 被设置的时候被立即同步执行的情况, 需要让它等一会
                        if (_S) {
                            setTimeout(function() {
                                if (++b >= a) {
                                    self.closeLoading();
                                }
                            }, 100);
                        }
                        else if (++b >= a) {
                            self.closeLoading();
                        }
                    })
                    .data('index', i)
                    .click(function() {
                        self.showPhoto(m, img);
                    });
                })(this.already, m, img);
                
                img.title = m.title;
                img.src = m.url.replace('$', 'q');
            }
            
            if (a > 0) {
                self.showLoading();
            }
        },
        
        // 判断是否可以停止加载照片, 即照片的数量已经超过了用户可以看到的数量
        isStopPaint: function() {
            var h = Math.ceil(this.already / 5) * 80;
            var wh = $.getWindowSize().height;
            return h >= wh + this.el.scrollTop;
        },
        
        // 获取图片目录数据
        loadPhotoIndex: function(callback) {
            if (Photos) {
                callback(Photos);
            }
            else {
                $.ajax({ 
                    url: '/data/photos.txt?_cd=' + new Date().getTime(), 
                    success: function(photos) {
                        Photos = photos = eval('(' + photos + ')');
                        storage['photos'] = $.toJSON(Photos);
                        callback && callback(Photos);
                    }
                });
            }
        },
        
        // 构建加载提示框
        createLoadingPanel: function() {
            var loadPanel = $('<div />').css({
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                marginLeft: '-50px',
                width: '100px',
                height: '30px',
                borderRadius: '8px',
                background: _S ? '#000' : 'rgba(0,0,0,.8)',
                filter: 'alpha(opacity=80)'
            });
            var icon = $('<span />').css({
                display: 'inline-block',
                background: 'url(img/loading_s.gif)',
                float: 'left',
                margin: '6px',
                width: '16px',
                height: '16px'
            }).appendTo(loadPanel);
            
            var sign = $('<span>加载中...</span>').css({
                display: 'inline-block',
                float: 'left',
                fontSize: '12px',
                color: 'white',
                margin: '6px',
            }).appendTo(loadPanel);
            
            loadPanel.changeText = function(txt) {
                sign.html(txt);
            };
            return loadPanel;
        },
        
        // 显示开始加载画面
        showLoading: function() {
            if (!this.loading) {
                var self = this;
                this.loading = this.createLoadingPanel();
                this.loadingCount = 1;
                this.loading.appendTo(document.body);
                var _show = this.loading._show = function() {
                    self.loading.show();
                };
                
                var _hide = this.loading._hide = function() {
                    self.loading.hide();
                };
                this.on('show', _show);
                this.on('hide', _hide);
            }
            else {
                this.loadingCount++;
            }
        },
        
        // 关闭加载画面
        closeLoading: function() {
            if (--this.loadingCount < 1 && this.loading) {
                this.off('show', this.loading._show);
                this.off('hide', this.loading._hide);
                this.loading.remove();
                this.loading = null;
            }
        },
        
        // 版面展现
        show: function(callback) {
            var el = $(this.el);
            var self = this;
            self.trigger('beforeShow', this);
            self.once('show', callback);
            el.css({
                left: '-100%',
                top: '0%',
                display: 'block'
            }).animate({
                left: '0%'
            }, function() {
                self.trigger('show', self);
                self.loadPhotoIndex(function() {
                    self.startPaint();
                });
            });
        },
        
        // 版面关闭
        hide: function(callback) {
            var self = this;
            var el = $(this.el);
            
            self.closePhoto();
            self.trigger('beforeHide', self);
            self.once('hide', callback);
            el.animate({
                left: '-100%'
            }, function() {
                el.hide();
                self.trigger('hide', self);
            });
        },
        
        // 根据图片大小与浏览器大小, 分析出最佳的显示尺寸
        imgSizeAnalyze: function(img) {
            var size = $.getWindowSize();
            var a = (size.width - 20) / (size.height - 20);
            // ie 下不支持 naturalWidth 属性
            var nw = img.naturalWidth || (img.naturalWidth = img.width);
            var nh = img.naturalHeight || (img.naturalHeight = img.height);
            var b = nw / nh;
            
            if (a > b) {
                var h = Math.min(size.height - 20, nh);
                var w = h * b;
            }
            else {
                var w = Math.min(size.width - 20, nw);
                var h = w / b;
            }
            return {
                width: w,
                height: h
            };
        },
        
        // 显示前一张照片
        showPrevPhoto: function() {
            if (this.currentPhoto == null) {
                return;
            } 
            var p = this.currentPhoto.prev();
            if (p.length > 0) {
                this.showPhoto(Photos[p.data('index')], p);
            }
        },
        
        // 显示后一张照片
        showNextPhoto: function() {
            if (this.currentPhoto == null) {
                return;
            } 
            var p = this.currentPhoto.next();
            if (p.length > 0) {
                this.showPhoto(Photos[p.data('index')], p);
            }
        },
        
        // 查看器关闭操作, 清除所有对象
        closePhoto: function() {
            if (this.photoWatcher) {
                $('.mask').remove();
                this.photoWatcher.stopResize();
                // 清除正在加载的图片
                if (this.photoWatcher.loadingImg) {
                    var img = this.photoWatcher.loadingImg;
                    img.onload = img.onerror = null;
                    delete this.photoWatcher.loadingImg;
                }
                this.photoWatcher.remove();
                this.currentPhoto = this.photoWatcher = null;
                this.trigger('closePhoto', self);
            }
        },
        
        // 放大展现图片
        showPhoto: function(imginfo, simg) {
            var self = this;
            var img = null, loading = null, oldimg = null;
            simg = $(simg);
            
            self.trigger('beforeShowPhoto', self, imginfo);

            // 构建图片查看器
            if (!self.photoWatcher) {
                
                self.on('closePhoto', function() {
                    loading = null;
                });
                
                // 遮罩效果
                var mask = $('<div class="mask" />').click(function() {
                    self.closePhoto();
                });
                
                $(document.body).append(mask);
                
                self.photoWatcher = $('<div class="photo-watch" />');
                
                // 窗体尺寸重置时的侦听器, 使照片查看器的大小可以自适应
                self.photoWatcher.resizeListener = function() {
                    var img = self.photoWatcher.children('img');
                    if (img) {
                        // 计算显示尺寸
                        var size = self.imgSizeAnalyze(img[0]);
                        self.photoWatcher.css({
                            width: size.width + 'px',
                            height: size.height + 'px',
                            marginLeft: (- size.width / 2) + 'px',
                            marginTop: (- size.height / 2) + 'px'
                        });
                    }
                };
                
                // 启动自适应
                self.photoWatcher.startResize = function() {
                    $(window).bind('resize', this.resizeListener);
                };
                
                // 取消自适应
                self.photoWatcher.stopResize = function() {
                    $(window).unbind('resize', this.resizeListener);
                };
                
                // 关闭按钮
                var closeBtn = $('<button class="close-btn">X</button>')
                    .appendTo(this.photoWatcher).click(function() {
                        self.closePhoto();
                    });
                
                oldimg = simg.clone().css({
                    width: '100%',
                    height: '100%'
                }).appendTo(this.photoWatcher);
                
                $(document.body).append(this.photoWatcher);
            }
            // 如果图片查看器已经存在
            else {
                oldimg = self.photoWatcher.children('img');
                // 移除旧的翻页按钮
                if (self.nextPhotoBtn) {
                    self.nextPhotoBtn.remove();
                }
                if (self.prevPhotoBtn) {
                    self.prevPhotoBtn.remove();
                }
            }
            
            // 显示加载中
            loading = this.createLoadingPanel();
            
            loading.css({
                position: 'absolute',
                top: '50%',
                marginTop: '-15px'
            }).appendTo(this.photoWatcher);
            
            img = self.photoWatcher.loadingImg = new Image();
            
            // 照片加载失败时
            img.onerror = function() {
                if (loading) {
                    loading.changeText('加载失败!');
                }
            };
            
            // 大图片加载完成后
            img.onload = function() {
                if (self.photoWatcher) {
                    // 计算显示尺寸
                    var size = self.imgSizeAnalyze(img);
                    
                    // 先取消自适应
                    self.photoWatcher.stopResize();
                    
                    self.currentPhoto = simg;
                    
                    // 旧图片消失
                    oldimg.fadeOut(function() {
                        oldimg.remove();
                    });
                    
                    // 试图动画调整到指定的大小
                    self.photoWatcher.animate({
                        width: size.width + 'px',
                        height: size.height + 'px',
                        marginLeft: (- size.width / 2) + 'px',
                        marginTop: (- size.height / 2) + 'px'
                    }, 'slow', function() {
                        if (!self.photoWatcher) {
                            return;
                        }
                        
                        // 新图片展现
                        $(img).css({
                            display: 'none',
                            position: 'absolute',
                            left: '0px',
                            top: '0px',
                            width: '100%',
                            height: '100%'
                        })
                        .appendTo(self.photoWatcher)
                        .fadeIn();
                        
                        // 完成自适应绑定
                        self.photoWatcher.startResize();
                        
                        // 下一页按钮
                        self.nextPhotoBtn = $('<span class="next page-btn" />')
                        .click(function() {
                            self.showNextPhoto();
                        }).appendTo(self.photoWatcher);
                        
                        // 上一页按钮
                        self.prevPhotoBtn = $('<span class="prev page-btn" />')
                        .click(function() {
                            self.showPrevPhoto();
                        }).appendTo(self.photoWatcher);
                        
                        self.trigger('showPhoto', self, imginfo);
                    });
                }
                
                // 加载中的显示消失
                if (loading) {
                    loading.remove();
                    loading = null;
                }
            };
            
            // 开始加载照片
            img.src = imginfo.url.replace('$', 'b');
        }
    });
});