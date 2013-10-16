// 转换页面中所有的站内链接, 把链接前加入#号
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

})(jQuery);
