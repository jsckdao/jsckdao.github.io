// 转换页面中所有的站内链接, 把链接前加入#号
jQuery(function() {
    var origin = location.origin;
    jQuery('a').each(function() {
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
    })
});