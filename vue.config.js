module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@': 'D:\\projects\\sengoku-fe\\src',
                '@src': 'D:\\projects\\sengoku-fe\\src\\core',
                '@assets': 'D:\\projects\\sengoku-fe\\public\\assets',
            },
        },
    },
    transpileDependencies: ['vuetify'],
};
