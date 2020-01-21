const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const webpack = require('webpack') //引入webpack库
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin') //引入lodash-webpack-plugin

module.exports = {
    // 关闭eslint校验报错
    lintOnSave: false,
    productionSourceMap: false,
    assetsDir: 'static',
    publicPath: './',
    devServer: {
        // 设置代理
        //         proxy: {
        //             '/api': {
        //                 // 目标 API 地址
        //                 target: 'https://api.douban.com/v2/movie/',
        //                       changeOrigin: true,
        //                       pathRewrite: {
        //                         '^/api': ''
        //                       }
        //             }
        //         }
    },
    chainWebpack: config => {
        //路径简化
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@components', resolve('src/components'));
        //优化moment
        config.plugin('ignore')
            .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
        //优化lodash
        config.plugin("loadshReplace")
            .use(new LodashModuleReplacementPlugin());
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                // 修改它的选项...
                return options
            })
    },
    configureWebpack: config => {
        // 用cdn方式引入，则构建时要忽略相关资源
        config.externals = {
            //  vue: 'Vue',
        }
        //生产去除console
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
    }
}