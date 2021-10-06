const sleep = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 匹配正则表达输出所有位置
 * @param {*} reg 正则表达
 * @param {string} str 目标字符串
 * @returns {array}
 */
const matchIndex = (reg, str) => {
    const newReg = new RegExp(reg, 'g');
    const array = [];

    while ((result = newReg.exec(str)) !== null) {
        const fIndex = newReg.firstIndex;
        const lIndex = newReg.lastIndex - result[0].length;

        array.push(lIndex);
    }

    return array;
}

export {
    sleep,
    matchIndex
};