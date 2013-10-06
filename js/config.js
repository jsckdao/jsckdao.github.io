seajs.config({
    alias : {
        'jquery' : 'jquery.js',
        'backbone': 'backbone.js'
    },
    preload: ['jquery']
})

seajs.use(['a.js', 'app/routes.js'])