const sleep = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 匹配正则表达输出所有位置
 * @param {*} reg 正则表达
 * @param {string} str 目标字符串
 * @returns {array}
 */
const matchIndex = (reg, str) => {
    const array = reg.exec(str);

    return array;
}

export {
    sleep,
    matchIndex
};