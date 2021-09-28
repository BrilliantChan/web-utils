import Taro from '@tarojs/taro';

// 获取右上角胶囊按钮的布局位置信息 坐标信息以屏幕左上角为原点
const {
    width: MenuButtonWidth,
    height: MenuButtonHeight,
    top: MenuButtonPositionTop,
    right: MenuButtonPositionRight,
    left: MenuButtonPositionLeft
} = Taro.getMenuButtonBoundingClientRect();
const {
    windowWidth,
    windowHeight,
    // 状态栏高度
    statusBarHeight,
    // 标题栏高度
    navigationBarHeight = 2 * (MenuButtonPositionTop - statusBarHeight) + MenuButtonHeight
    // safeArea: {}
} = Taro.getSystemInfoSync();
const navigationBarWidth = MenuButtonPositionLeft - (windowWidth - MenuButtonPositionRight);

// console.log('windowHeight: ', windowHeight);
// console.log('statusBarHeight: ', statusBarHeight);
// console.log('navigationBarHeight: ', navigationBarHeight);
// console.log('MenuButtonWidth: ', MenuButtonWidth);
// console.log('rect: ', Taro.getSystemInfoSync());
//
// console.log('getMenuButtonBoundingClientRect: ', Taro.getMenuButtonBoundingClientRect());

export {
    windowWidth,
    windowHeight,
    statusBarHeight,
    navigationBarWidth,
    navigationBarHeight,
    MenuButtonWidth,
    MenuButtonHeight,
    MenuButtonPositionTop,
    MenuButtonPositionRight,
    MenuButtonPositionLeft
}
