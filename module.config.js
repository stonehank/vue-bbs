const path = require('path');


module.exports = function moduleConfig(isDevelopment) {
    return {
        rules: [
            {parser: {requireEnsure: false}},
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader',
                options: !isDevelopment
                    ? {
                        cacheDirectory: true,
                        cacheCompression: true,
                        compact: true
                      }
                    : {}
            },
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "style-loader",
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                require('postcss-preset-env')({
                                    stage: 3,
                                }),
                            ],
                        },
                    },
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "vue-style-loader",
                    "style-loader",
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                require('postcss-preset-env')({
                                    stage: 3,
                                }),
                            ],
                        },
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }
        ]
    };
}

