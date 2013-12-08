/**
 * 主要应用与文章列表与每篇文章页面中, 可以动态加载一些 数据, 模仿动态网站那样显示更新日志等动态内容
 */
(function($) {

    // 使用本地数据缓存
    var storage = window.sessionStorage;
    var writtings = storage && storage['writtings'] ? $
            .parseJSON(storage['writtings']) : null;

    function setStorage(datas) {
        writtings = datas;
        storage['writtings'] = $.toJSON(datas);
    }

    // 从页面中提取所有文章的数据
    function extractData(context) {
        var datas = [];
        $(context).find('.blog-list li').each(function() {
            var li = $(this), a = li.find('a');

            datas.push({
                title : a.html(),
                href : a.attr('href'),
                date : a.data('date'),
                tag : a.data('tag')
            });
        });
        setStorage(datas);
    }

    // 初始化标签列表
    function initList() {

    }

    $(function() {
        $('.blog-list li').each(function() {
            var li = $(this), a = li.find('a');

            li.append('<em>' + a.data('date') + '</em>');
            li.append('<em>' + a.data('tag') + '</em>');
        });
    });

    // 显示文章信息
//    $(function() {
//        var blogList = $('.blog-list'), tlist = $('.tag-list');
//        if (blogList.length > 0 && tlist.length > 0) {
//            if (!writtings) {
//                extractData(document.body);
//            }
//        }
//    });
//
//    // 
//    $(function() {
//        var tlist = $('tag-list-sync');
//        if (tlist.length > 0) {
//            if (writtings) {
//                var href = location.href;
//                $.ajax({
//                    url : href.substring(0, href.lastIndexOf('/')),
//                    success : function(text) {
//                        extractData(text);
//                    }
//                });
//            }
//            else {
//
//            }
//        }
//    });

})(jQuery);