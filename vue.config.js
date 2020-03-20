const resolve = (dir) => require('path').resolve(__dirname, dir);
module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src'),
                '@src': resolve('src/core'),
                '@assets': resolve('public/assets'),
            },
        },
    },
    transpileDependencies: ['vuetify'],
};
