module.exports = {
    publicPath: './',
    devServer: {
        open: true,
        host: 'localhost',
        port: 8080,
        https: false,
        proxy: 'http://127.0.0.1'
        // proxy: {
        //     // 配置跨域
        //     '/api': {
        //         target: 'http://localhost:10086/api/',
        //         ws: true,
        //         changOrigin: true,
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
    }
}
