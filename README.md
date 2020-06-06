# LightWeightDecimals.js

一个轻量的低侵入式的JavaScript精度问题解决方案。

提供了6个API：
1. plus(num)
2. minus(num)
3. times(num)
4. divide(num)
5. round(num, flag = 5)
6. abs()

这6个API分别挂载到Number.prototype原型对象上面，这样子我们可以如下方式使用这几个API：

1. plus() 加法运算

(0.1).plus(0.2);

2. minus() 减法运算

(1).minus(0.1);

3. times() 乘法运算

(0.1).times(3);

4. divide() 除法运算

(0.1).divide(0.2);

5. round() 四舍五入，默认flag是5，表示四舍五入，如果flag指定其他值，表示（flag - 1）舍 flag 入。

(0.2353).round(3); // 四舍五入

(0.23356).round(4, 6); // 五舍六入

6. abs() 取绝对值

(-0.32).abs();

出了单独使用之外，还可以链式使用，如：

a = (0.1).plus(0.2).divide(8).times(-3).round(3).abs();
