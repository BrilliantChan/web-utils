import Taro from '@tarojs/taro';

class Storage {
    /**
     * 读缓存
     * @param   {String}    key 缓存key
     * @return  {any}       data 数据
     * */
    get(key) {
        try {
            const {keys} = Taro.getStorageInfoSync();
            const timeKey = `${key}_expires`; // 存储过期时间缓存 key 值

            if (keys.indexOf(key) > -1) {
                const now = Date.now();
                const expiresTime = Taro.getStorageSync(timeKey) || null;
                const value = JSON.parse(Taro.getStorageSync(key) || null);

                if (!expiresTime || expiresTime > now) {
                    return value;
                }

                this.remove(key);

                return null;
            }
        } catch (err) {
            console.log(`getStorageInfoSync调用失败`);

            return null;
        }

        // 返回空值
        return null;
    }

    /**
     * 写缓存
     * @param   {String}        key     缓存名称
     * @param   {any}           value   缓存数据
     * @param   {number|null}   expires 缓存过期时间
     * */
    set(key, value, expires = null) {
        const timeKey = `${key}_expires`; // 存储过期时间缓存 key 值

        if (expires) {
            Taro.setStorageSync(timeKey, expires);
        }

        Taro.setStorageSync(key, JSON.stringify(value));
    }

    /**
     * @return  {Array} 缓存列表key
     * */
    keys() {
        const {keys = []} = Taro.getStorageInfoSync();

        return keys;
    }

    /**
     * 删除缓存
     * @param   {String|Array}  key 缓存key值
     * */
    remove(key) {
        if (key) {
            if (key.constructor === String) {
                key = [key];
            }

            key.forEach((name) => {
                const timeKey = `${key}_expires`; // 存储过期时间缓存 key 值

                Taro.removeStorageSync(name);
                Taro.removeStorageSync(timeKey);
            })
        }
    }

    /**
     * 清空本地缓存
     * */
    clear() {
        Taro.clearStorageSync();
    }
}

export default new Storage();