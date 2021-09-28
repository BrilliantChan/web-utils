/**
 * 管理更新
 * */
import Taro from '@tarojs/taro';

const updateManager = Taro.getUpdateManager();

if (updateManager) {
    updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
            Taro.showToast({
                title: '即将有更新请留意'
            });
        }
    });

    updateManager.onUpdateReady(function () {
        Taro.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否立即使用？',
            success: function (res) {
                if (res.confirm) {
                    updateManager.applyUpdate();
                } else {
                    Taro.showToast({
                        icon: 'none',
                        title: '小程序下一次「冷启动」时会使用新版本'
                    });
                }
            }
        });
    });

    updateManager.onUpdateFailed(function () {
        // 新版本下载失败
        console.log('下载失败');
    });
}
