//entry --> output

//setting up an module to an object.
// whatever we are putting it here, it will have access to those files.
//path needs to be absolute path
//entry is a relative path

const path = require('path');

//to join the path use this syntax: 
console.log(path.join(__dirname, 'public'));

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        }]
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public')
    }
}