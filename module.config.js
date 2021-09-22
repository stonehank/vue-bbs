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
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                    }
                ],
                sideEffects:true
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                    },
                    'sass-loader'
                ],
                sideEffects:true
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

