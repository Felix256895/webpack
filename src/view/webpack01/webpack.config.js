const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 单独打包css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 清空
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 压缩css
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// css兼容性插件库
const PostcssPresetEnv = require('postcss-preset-env');
// 离线技术
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

// development 开发环境 production 生产环境
process.env.NODE_ENV = 'production';

// const root = path.resolve(process.cwd());
/**
 * 一般一个文件只能被一个loader处理，当一个文件被多个loader处理的时候，
 * 需要设置loader执行的先后顺序：
 * 先执行eslint 在执行loader
 * 优先执行设置
 * enforce: 'pre',
 */

/**
 * HMR hot module replacement 热模块替换 / 模块热替换
 * 作用：一个模块发生变化，只重新打开一个模块
 * devServer 设置 hot: true 极大的提升构建速度
 * 样式文件可以通过HMR功能: style-loader实现
 * js文件: 默认没有HRMR功能
 * html文件: 默认没有HMR功能 ，html不能热更新,不需要热更新
 * 解决入口引入html
 */

/**
 * 缓存
 * babel缓存
 *  cacheDiretroy: true
 * 文件资源缓存
 *  hash 每次生成一个唯一的hash
 *  chunkhash 根据chunk生成hash 打包涞源同一个chunk，那么hash就一样
 *  contenthash 根据文件内容生成hash
 */

/**
 * PWA 渐进式网络 离线技术 安装插件
 * npm install workbox-webpack-plugin --save-dev
 *
 */
module.exports = {
  // 入口文件
  entry: './src/index.js',
  // 输出文件
  output: {
    // publicPath: './', //生产环境
    filename: 'js/[name].bundle.[hash].js',
    path: path.resolve(__dirname, 'build'),
  },
  // 代码分割
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  mode: 'development',
  module: {
    rules: [
      // 配置loader
      {
        test: /\.js$/,
        // exclude 排除不检查
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        /**
         * js 语法检查 eslint eslint-loader
         * package.json里加eslintConfig配置 或者 创建 .eslintrc的配置文件
         * airbnb语法检查规则
         *  eslint-config-airbnb-base eslint-plugin-import eslint
         */
        loader: 'eslint-loader',
        options: {
        // 自动修复eslint报错
          fix: false,
        },
      },
      {
        // oneOf 优化打包速度每个文件只执行一个loader
        oneOf: [
          {
            // 处理less资源
            test: /\.less$/,
            use: [
              // 'style-loader',
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../',
                },
              },
              'css-loader',
              'less-loader',
              {
                // css兼容性
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    PostcssPresetEnv(),
                  ],
                },
              },
            ],
          },
          {
            // 处理css资源
            test: /\.css/,
            use: [
              // 'style-loader',
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  // 配置css路径 对应其他文件路径
                  publicPath: '../',
                },
              },
              'css-loader',
              {
                /**
                 * css兼容性
                 * package.json 配置 browserslist浏览器版本 或者创建 .browserslistrc配置文件
                 */
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    PostcssPresetEnv(),
                  ],
                },
              },
            ],
          },
          {
            // 处理图片资源
            test: /\.(png|svg|jpg|gif)$/,
            loader: 'url-loader',
            options: {
              // 限制大小
              limit: 8192,
              // 重命名
              name: '[hash:4].[ext]',
              // 关闭es6模块化
              esModule: false,
              // 图片路径
              outputPath: 'images',
            },
          },
          {
            // 处理字体文字
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            loader: 'url-loader',
            options: {
              name: '[hash:4].[ext]',
              outputPath: 'font',
            },
          },
          {
            // 处理html资源
            test: /\.(html|htm)$/,
            loader: 'html-loader',
          },
          {
            /** 或者配置文件.babelrc
             * es6 语法兼容性处理 babel-loader @babel/core @babel/preset-env 高级语法不支持
             * 1.基本兼容性处理 ---> @babel/preset-env
             * 2.全部js兼容性处理 ---> @babel/polyfill 入口文件引入 体积太大
             * 3.需要做兼容性处理按需加载 ---> core-js
            */
            test: /\.js$/,
            // exclude 排除不检查
            exclude: /node_modules/,
            use: [
              // {
              //   /**
              //    * 开启多进程打包 thread-loader
              //    */
              //   loader: 'thread-loader',
              //   options: {
              //     workers: 2,
              //   },
              // },
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    ['@babel/preset-env',
                      {
                        // 配置core-js 按需加载
                        useBuiltIns: 'usage',
                        corejs: {
                          version: '3',
                        },
                        targets: '> 0.2%',
                      },
                    ],
                  ],
                  // cacheDiretroy: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // 压缩html
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new WorkboxWebpackPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true,
    // 开启 HMR
    hot: true,
  },
  /**
   * 调试源代码精确错误位置
   * 生产环境 source-map 调试友好
   * 开发环境 eval-source-map
   */
  devtool: 'source-map',
};
