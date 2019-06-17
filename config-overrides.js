const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    // 针对antd 实现按需打包: 根据import来打包(babel-plugin-import)
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true, // 自动打包相关样式
    }),
    // 自定义主题 使用less-loader对源码中的less变量进行重新指定
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' },
    }),
);