import 'style/index.less';

function test() {
  // 忽略下一行代码eslint规则失效
  // eslint-disable-next-line
  console.log('hello world');
};

test();
const p = new Promise(((resolve) => {
  setTimeout(() => {
    // eslint-disable-next-line
    console.log('定时器执行了。。。');
    resolve();
  }, 1000);
}));
// eslint-disable-next-line
console.log(p);

/**
 * 代码分割
 * webpackChunkName后名字 懒加载
 * webpackPrefetch: true 预加载 等其他加载完后，浏览器空闲在加载 兼容性不行
 */

/* eslint-enable */
import(
  /* webpackChunkName: "app", webpackPrefetch: true */
  './app'
  )
  .then(({mul,count}) => {
   console.log(mul(3, 4));
 });

 /**
  * 离线技术PWA
  */
if( 'serviceWorker' in navigator ) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then( registration => {
      console.log('SW 注册成功', registration);
    }).catch(registrationError => {
      console.log('SW 注册失败', registrationError);
    });
  });
}

