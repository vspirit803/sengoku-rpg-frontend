const resolve = (dir) => require('path').resolve(__dirname, dir);
module.exports = {
    publicPath: '.',
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src'),
                '@src': resolve('node_modules/sengoku-rpg-core/src'),
                '@assets': resolve('public/assets'),
            },
        },
    },
    transpileDependencies: ['vuetify'],
};
