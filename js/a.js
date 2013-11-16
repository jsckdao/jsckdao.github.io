// 判断 ie 版本
var _IE = (function(){
    var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );
    return v > 4 ? v : false ;
}());

// ie8 以下直接枪毙
if (_IE && _IE < 8) {
    location.href = '/nosupport.html';
}

// ie8 须特殊对待
var _S = _IE == 8;

//转换页面中所有的站内链接, 把链接前加入#号
(function($) {
    // 作为一个jquery 插件, 转换指定上下文中的链接
    $.changeLink = function(context) {
        var origin = location.origin
                || (location.protocol + '//' + location.host);
        
        $(context).find('a').each(function() {
            var h = this.href;
            var i = h.indexOf(origin);
            // 检查是否是内部链接
            if (i >= 0) {
                
                this.href = origin + '#' + h.substring(origin.length);
                this.target = "_top";
            }
            else {
                this.target = "_blank";
            }
        });
    };

    // 页面加载完成后, 全页处理
    $(function() {
        $.changeLink(document.body);
    });

    // 加载评论模块
    $(function() {
        $('#comment-open').click(function() {
            var a = $(this).html('加载中...');
            $('<script />').attr({
                type: 'text/javascript',
                async: 'true',
                src: 'http://jsckdaome.disqus.com/embed.js'
            })
            .load(function() {
                a.remove();
            })
            .appendTo(document.body);
        });
    });

})(jQuery);


