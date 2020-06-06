interface ParsedNumber {
    origion: string;
    value: string;
    decimalsLength: number;
}
/**
 * 解析单个数字的精度值
 * @param {number} num
 * @returns {ParsedNumber}
 */
function parseNumber(num: number): ParsedNumber {
    let a: string | Array<string> = num.toString();
    const re = /^([-\\+]?)(\d+)(.?)(\d*)e([-\\+])(\d+)$/i;

    if (re.test(a)) {
        // 5e-20, 3.5e+20
        a = a.replace(re, (_, $1sign, $2left, $3point, $4right, $5mark, $6powlength) => {
            let rs = '';
            if ($5mark === '-') {
                rs = `${$1sign}0.${Array($6powlength - $2left.length + 1).join('0')}${$2left}`;
                if ($3point) {
                    // has decimal
                    rs += $4right;
                }
            } else {
                rs = $1sign + $2left + $4right + Array($6powlength - $4right.length + 1).join('0');
            }

            return rs;
        });
    }
    a = a.split('.');

    return {
        origion: a.join('.'),
        value: a.join(''),
        decimalsLength: a[1] ? a[1].length : 0
    };
}
/**
 * 通过精度计算方式，计算两个数值的加减乘除
 * @param {string} type
 * @param {number} numA
 * @param {number} numB
 * @returns {number}
 */
function operateDecimals(type: string, numA: number, numB: number): number {
    let a: ParsedNumber | number = parseNumber(numA);
    let b: ParsedNumber | number = parseNumber(numB);

    const decimalsLength = Math.max(a.decimalsLength, b.decimalsLength);
    const p = Math.pow(10, decimalsLength);
    a = Number(a.value + Array(decimalsLength - a.decimalsLength + 1).join('0'));
    b = Number(b.value + Array(decimalsLength - b.decimalsLength + 1).join('0'));

    if (type === 'plus') {
        return (a + b) / p;
    }
    if (type === 'minus') {
        return (a - b) / p;
    }
    if (type === 'times') {
        return (a * b) / Math.pow(p, 2);
    }
    if (type === 'divide') {
        return a / b;
    }
    throw new Error(`unknown (${type}) operation!`);
}
/**
 * 四舍五入
 * @param {number} num
 * @param {number} decimalsLength
 * @param {number} flag = 5
 * @returns {number}
 *
 * roundOff(0.335, 2) => 0.34
 * roundOff(0.335, 2, 6) => 0.33
 */
function roundOff(num: number, decimalsLength: number, flag: number = 5): number {
    const parsedNum = parseNumber(num);
    const a = parsedNum.origion.split('.');
    let decimals;
    let lastDecimal;
    let diffValue;
    if (a[1]) {
        decimals = a[1].split('').slice(0, decimalsLength + 1);
        if (decimals.length > decimalsLength) {
            lastDecimal = Number(decimals.pop());
            decimals = `${a[0]}.${decimals.join('')}`;
            if (lastDecimal >= flag) {
                diffValue = Number(`${decimals.replace(/\d/g, '0')}${(10).minus(lastDecimal)}`);
                decimals = Number(`${decimals}${lastDecimal}`);
                return decimals.plus(diffValue);
            }
            return Number(decimals);
        }
    }
    return num;
};
/**
 * 加法运算
 * @param {number} num
 * @returns {number}
 * (3.2).plus(0.19) = 3.39
 */
Number.prototype.plus = function plus(num: number): number {
    return operateDecimals('plus', this.valueOf(), num).valueOf();
};
/**
 * 减法运算
 * @param {number} num
 * @returns {number}
 *
 * (3.2).minus(0.3) = 2.9
 */
Number.prototype.minus = function minus(num: number): number {
    return operateDecimals('minus', this.valueOf(), num).valueOf();
};
/**
 * 乘法运算
 * @param {number} num
 * @returns {number}
 *
 * (3.2).times(0.9) = 2.88
 */
Number.prototype.times = function times(num: number): number {
    return operateDecimals('times', this.valueOf(), num).valueOf();
};
/**
 * 除法运算
 * @param {number} num
 * @returns {number}
 *
 * (3.2).divide(0.8) = 4
 */
Number.prototype.divide = function divide(num: number): number {
    return operateDecimals('divide', this.valueOf(), num).valueOf();
};
/**
 * 四舍五入
 * @param {number} decimalsLength
 * @param {number} flag = 5
 * @returns {number}
 *
 * (0.335).round(2) => 0.34
 * (0.335).round(2, 6) => 0.33
 */
Number.prototype.round = function round(decimalsLength: number, flag: number = 5): number {
    return roundOff(this.valueOf(), decimalsLength, flag);
};
/**
 * 取绝对值
 * @returns {number}
 * 
 * (-0.2).abs() => 0.2
 */
Number.prototype.abs = function abs(): number {
    return Math.abs(this.valueOf());
};
