export function formatDecimal(number: number): string {
    // 将数字转换为字符串，然后找到小数点的位置
    const numStr = number.toString();
    const dotIndex = numStr.indexOf('.');

    // 如果找不到小数点，直接返回原始字符串
    if (dotIndex === -1) {
        return numStr;
    }

    // 截取小数点后的部分，最多保留6位
    const decimalPart = numStr.slice(dotIndex + 1, dotIndex + 7);

    // 移除末尾多余的0
    let formattedDecimal = decimalPart.replace(/0+$/, '');

    // 如果小数点后没有数字，就直接返回整数部分
    if (formattedDecimal === '') {
        return numStr.slice(0, dotIndex);
    }

    // 拼接整数部分和小数部分，并返回结果
    return `${numStr.slice(0, dotIndex)}.${formattedDecimal}`;
}