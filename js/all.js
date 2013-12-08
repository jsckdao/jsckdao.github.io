// 加载评论模块
$(function() {
    $('#comment-open').click(function() {
        $(this).remove();
        var script = $('<script />').attr({
            type : 'text/javascript',
            async : 'true',
            src : 'http://jsckdaome.disqus.com/embed.js'
        })
        .appendTo(document.body);
    });
});