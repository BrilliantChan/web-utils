import axios from 'axios';
import * as utils from '../../utils';

const host = '/';

const instance = axios.create({
    timeout: 10000,
    baseURL: host,
    withCredentials: true
});

instance.interceptors.request.use(
    (config) => {
        // const {data, method} = config;
        config = {
            ...config,
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            }
            // ...(method === 'post' ? {data} : null)
        };
        return config;
    },
    (error) => Promise.error(error)
);

instance.interceptors.response.use(
    async (response) => {
        if (process.env.NODE_ENV === 'development') {
            const random = parseInt(Math.random() * 500, 10);
            await utils.sleep(random);
        }

        const {error, message: msg} = response.data;

        if (error - 0 !== 0) {
            message.error(msg || `请求错误, code: ${error}`);
            return Promise.reject(response.data);
        }

        return response.data;
    }, (error) => {
        message.error(error.response.data || '请求错误');
        return Promise.reject(error.response.data);
    }
);


export default instance;