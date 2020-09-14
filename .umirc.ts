import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'transform-ui',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  base: '/transform-ui',
  publicPath: '/transform-ui/',
  mode: 'site',
  // more config: https://d.umijs.org/config
  menus: {
    '/guide': [
      {
        title: '介绍',
        children: [{ title: '快速上手', path: '/guide' }],
      },
    ],
    '/design': [
      {
        title: '设计',
        children: [
          { title: '介绍', path: '/design' },
          { title: '设计思路', path: '/design/main' },
        ],
      },
    ],
    '/components': [
      { title: '组件总览', path: '/components' },
      {
        title: '通用',
        children: [
          { title: 'Button 按钮', path: '/components/button' },
          { title: 'Player 播放器', path: '/components/player' },
          { title: 'Slider 滑动输入条', path: '/components/slider' },
        ],
      },
    ],
  },
  navs: [
    { title: '指南', path: '/guide' },
    { title: '设计', path: '/design' },
    { title: '组件', path: '/components' },
    {
      title: 'GitHub',
      path: 'https://github.com/transform-tokyo/transform-ui',
    },
    // { title: '更新日志', path: 'https://github.com/umijs/dumi/releases' },
  ],
});
