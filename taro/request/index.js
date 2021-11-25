import Taro from '@tarojs/taro';
import {Base64} from 'js-base64';
import qs from 'qs';
import Storage from './../storage'

/**
 * @param   {Object}    config 配置内容
 * @param   {String}    config.baseURL baseURL
 * @param   {function}  config.response response
 *
 * @return  {Object}    instance
 * */
function Request(config) {
    this.defaults = {
        response(result, resolve) {
            resolve(result.data);
        },
        /**
         * @return  {String}    token base64加密后的token
         * */
        authorization() {
            const {tokenName} = this;
            const session = Storage.get(tokenName);

            return session ? Base64.encode(`${session.member_hash}:${session.session}`) : '';
        },
        ...config
    };

    const instance = this.request.bind(this);

    instance.get = this.get.bind(this);
    instance.post = this.post.bind(this);

    return instance;
}

/**
 * @param   {String}    url 请求地址
 * @param   {Object}    data 请求参数
 * @param   {boolean}   withToken 是否携带登录信息
 * @param   {Number}    cacheTime 缓存时间 默认为0（不缓存）
 * @param   {Object}    header 自定义头部
 *
 * @return  {Promise}   promise
 * */
Request.prototype.post = function (
    url = '',
    data = {},
    withToken = false,
    cacheTime = 0,
    header = {}
) {
    return this.request({
        url,
        method: 'POST',
        data,
        withToken,
        cacheTime,
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...header
        }
    })
};

/**
 * @param   {String}    url 请求地址
 * @param   {Object}    params 请求参数
 * @param   {boolean}   withToken 是否携带登录信息
 * @param   {Number}    cacheTime 缓存时间 默认为0（不缓存）
 * @param   {Object}    header 自定义头部
 *
 * @return  {Promise}   promise
 * */
Request.prototype.get = function (
    url = '',
    params,
    withToken = false,
    cacheTime = 0,
    header = {}
) {
    return this.request({
        url,
        method: 'GET',
        data: params,
        withToken,
        cacheTime,
        header
    })
};

/**
 * @param   {Object}    options 配置
 * @param   {String}    options.url 请求地址
 * @param   {String}    options.method 请求方式
 * @param   {Object}    options.data 请求参数
 * @param   {Boolean}   options.withToken 是否带token
 * @param   {Number}    options.cacheTime 是否带token
 * @param   {Object}    options.header 请求头信息
 * */
Request.prototype.request = function ({
                                          url = '/',
                                          method = 'GET',
                                          data = {},
                                          withToken = false,
                                          cacheTime = 0,
                                          header = {}
                                      }) {
    const {baseURL, response, reqfrom} = this.defaults;

    // 转为大写
    method = method.toUpperCase();

    if (withToken) {
        const token = this.defaults.authorization();

        if (token) {
            header.Authorization = `Basic ${token}`;
        }
    }

    // 统一添加reqfrom参数
    if (reqfrom) {
        switch (method) {
            case 'GET':
                data.reqfrom = reqfrom
                break;
            case 'POST':
                let [path, search] = url.split('?');
                let query = qs.parse(search);

                query.reqfrom = reqfrom;

                url = `${path}?${qs.stringify(query)}`;
                break;
        }
    }

    return new Promise((resolve, reject) => {
        // 缓存key名称
        const cacheKey = `${method}_${url}_${qs.stringify(data)}`;
        const cacheData = cacheTime ? Storage.get(cacheKey) : null;

        // 计算缓存过期时间
        cacheTime = cacheTime
            ? Date.now()  + cacheTime * 1000
            : 0

        // 判断是否读取缓存数据
        if (cacheTime && cacheData) {
            resolve(cacheData);
        } else {
            Taro.request({
                url: `${baseURL}${url}`,
                method,
                data,
                header,
                success(result) {
                    const {data} = result;

                    // 如果有缓存时间 则设置缓存
                    if (cacheTime) Storage.set(cacheKey, data, cacheTime);

                    response(result, resolve, reject);
                },
                fail(errMsg) {
                    reject(errMsg);
                }
            })
        }
    });
}

export default {
    /**
     * @param   {Object}    config 配置内容
     * @param   {String}    config.baseURL baseURL
     * @param   {function}  config.response response
     *
     * @return  {Object}    Request
     * */
    create(config) {
        return new Request(config);
    }
};