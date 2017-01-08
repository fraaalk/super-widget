var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')

var env = process.env.NODE_ENV
// check env & config/index.js to decide whether to enable CSS source maps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.json'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  vue: {
    loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
    postcss: [
      require('postcss-cssnext')({
        features: {
          customProperties: {
            variables: {
              // page wrappers
              'color-page__wrapper--light'                        : 'rgb(236, 236, 238)',
              'color-page__wrapper--extralight'                   : 'rgb(255, 255, 255)',
              'color-page__wrapper--dark'                         : 'rgb(44, 53, 60)',
              'color-page__wrapper--extradark'                    : 'rgb(33, 40, 45)',
              'color-page__wrapper--highlight'                    : 'rgb(236, 236, 238)',

              'color-ui-background'                               : 'transparent',
              'color-ui-text'                                     : 'rgb(57, 76, 88)',
              'color-ui-placeholder'                              : 'rgba(57, 76, 88, 0.5)',
              'color-ui-delimiter'                                : 'rgb(212, 212, 214)',

              'color-ui-primary'                                  : 'rgb(237, 206, 59)',    // yellow           - #edce3b
              'color-ui-highlight'                                : 'rgb(244, 95, 60)',     // orange           - #f45f3c

              // ui header
              'color-ui-header__title-color'                      : 'rgb(57, 76, 88)',

              // ui link
              'color-ui-link-color'                               : 'rgb(57, 76, 88)',
              'color-ui-link-color--hover'                        : 'rgb(57, 76, 88)',

              // ui image
              'color-ui-image-background'                         : 'rgb(44, 53, 60)',
              'color-ui-image-color'                              : 'rgb(237, 206, 59)',

              // ui flag
              'color-ui-flag-background'                          : 'rgb(57, 76, 88)',
              'color-ui-flag-color'                               : 'rgb(255, 255, 255)',

              // ui loader
              'color-ui-loader-border'                            : 'rgb(44, 53, 60)',

              // ui radiocheck
              'color-ui-radiocheck'                               : 'rgb(57, 76, 88)',
              'color-ui-radiocheck--checked'                      : 'rgb(237, 206, 59)', 

              // ui list
              'color-ui-list__item-background'                    : 'rgb(236, 236, 238)',
              'color-ui-list__item-background-2'                  : 'rgb(229, 229, 231)',
              'color-ui-list__item-color'                         : 'rgb(57, 76, 88)',

              // ui button ' primary
              'color-ui-button--primary-background'               : 'rgb(237, 206, 59)',
              'color-ui-button--primary-background--hover'        : 'rgb(215, 190, 56)',
              'color-ui-button--primary-background--active'       : 'rgb(215, 190, 56)',
              'color-ui-button--primary-background--disabled'     : 'rgb(237, 206, 59)',
              'color-ui-button--primary-border'                   : 'rgb(237, 206, 59)',
              'color-ui-button--primary-border--hover'            : 'rgb(215, 190, 56)',
              'color-ui-button--primary-border--active'           : 'rgb(215, 190, 56)',
              'color-ui-button--primary-border--disabled'         : 'rgb(237, 206, 59)',
              'color-ui-button--primary-color'                    : 'rgb(57, 76, 88)',
              'color-ui-button--primary-color--hover'             : 'rgb(57, 76, 88)',
              'color-ui-button--primary-color--active'            : 'rgb(57, 76, 88)',
              'color-ui-button--primary-color--disabled'          : 'rgb(57, 76, 88)',

              // ui button ' secondary
              'color-ui-button--secondary-background'             : 'rgb(211, 211, 213)',
              'color-ui-button--secondary-background--hover'      : 'rgb(198, 198, 200)',
              'color-ui-button--secondary-background--active'     : 'rgb(198, 198, 200)',
              'color-ui-button--secondary-background--disabled'   : 'rgb(211, 211, 213)',
              'color-ui-button--secondary-border'                 : 'rgb(211, 211, 213)',
              'color-ui-button--secondary-border--hover'          : 'rgb(198, 198, 200)',
              'color-ui-button--secondary-border--active'         : 'rgb(198, 198, 200)',
              'color-ui-button--secondary-border--disabled'       : 'rgb(211, 211, 213)',
              'color-ui-button--secondary-color'                  : 'rgb(57, 76, 88)',
              'color-ui-button--secondary-color--hover'           : 'rgb(57, 76, 88)',
              'color-ui-button--secondary-color--active'          : 'rgb(57, 76, 88)',
              'color-ui-button--secondary-color--disabled'        : 'rgba(57, 76, 88, 0.5)',

              // ui button ' cta
              'color-ui-button--cta-background'                   : 'rgba(57, 76, 88, 0.85)',
              'color-ui-button--cta-background--hover'            : 'rgb(237, 206, 59)',
              'color-ui-button--cta-background--active'           : 'rgba(57, 76, 88, 1)',
              'color-ui-button--cta-background--disabled'         : 'rgba(57, 76, 88, 0.05)',
              'color-ui-button--cta-border'                       : 'rgba(57, 76, 88, 0.85)',
              'color-ui-button--cta-border--hover'                : 'rgb(237, 206, 59)',
              'color-ui-button--cta-border--active'               : 'rgba(57, 76, 88, 1)',
              'color-ui-button--cta-border--disabled'             : 'rgba(57, 76, 88, 0.05)',
              'color-ui-button--cta-color'                        : 'rgb(255, 255, 255)',
              'color-ui-button--cta-color--hover'                 : 'rgb(57, 76, 88)',
              'color-ui-button--cta-color--active'                : 'rgb(57, 76, 88)',
              'color-ui-button--cta-color--disabled'              : 'rgba(57, 76, 88, 0.5)'
            }
          }
        }
      })
    ]
  }
}
