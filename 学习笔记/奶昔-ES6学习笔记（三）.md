<!--
author: 奶昔-王乃茜
date: 2017-03-30
title: ES6学习笔记（三）
tags: ES6
category: 前端
status: publish 
summary: 本文主要介绍ES6中的字符串的扩展。
-->
## 文章主要内容
    1.模板字符串
    2.新增的操作字符串的方法

## 1. 模板字符串
在ES6以前，输出模板通常是很繁琐，用了很多的''以及+来表达，后来随着模板字符串的出现，一切的表达都简化了很多，对比一下下面的两个例子
```
$('#result').append(   // 以前的写法，其实挺不方便的
    'There are <b>' + basket.count + '</b> ' +
    'items in your basket, ' +
    '<em>' + basket.onSale +
    '</em> are on sale!'
);

$('#result').append(`  // 现在的写法，简洁了很多
    There are <b>${basket.count}</b> items
    in your basket, <em>${basket.onSale}</em>
    are on sale!
`);
```
模板字符串用反引号（`）表示，如果在模板字符串中需要使用反引号，反引号前面需要用反斜杠转义。

模板字符串不仅使表达变得简单了，还可以用来定义多行字符串（所有的空格和缩进都会被保留在输出中），还可以在字符串中嵌入变量、函数（把变量名、函数名写在${}中），字符串之间也可以相互嵌套，功能更多了
```
$('#list').html(`    // 多行字符串
     <ul>
        <li>first</li>
        <li>second</li>
     </ul>
`);

// 字符串中嵌入变量
let name = 'Bob' , time = 'today';
`Hello ${name},how are you ${time}?`

// 如果字符串中的变量没有声明，将会报错
var msg = `Hello, ${place}`;  //报错，因为place没有进行声明

// 字符串中嵌入函数
function fn(){
    return "Hello world";
}
`Hello xinguang , ${fn()} `
```
大括号内部可以放置任意的JavaScript表达式，可以进行运算也可以引用对象属性。如果大括号中的值不是字符串，将把它转换成字符串。如果大括号内就是一个字符串，则将其原样输出

如果需要引用模板字符串本身，在执行的时候，可以像下面这样写
```
// 第一种写法
let str = 'return' + '`Hello ${name}!`';
let func = new Function('name',str);
func('Jack')  // "Hello Jack!"

//第二种写法
let str = '(name) => `Hello ${name}!`';
let func = eval.call(null,str);
func('Jack')  // "Hello Jack!"
```
因为模板字符串默认会将字符串转义，因此导致了无法嵌入其他语言，这是模板字符串的限制
## 2. 新增的操作字符串的方法
对于字符串的操作可以参考MDN的文档，https://developer.mozilla.org/zh-CN/docs/Web/JavaScript
## 2.1 codePointAt(),String.fromCodePoint(),at()
这三个方法都是ES6新增的用于弥补ES5在处理32位的字符串时，存在一定的局限性，不能正确处理32位的字符（Unicode编号大于0xFFFF）

其中codePointAt可以配合着for...of循环进行使用（ES6为字符串添加了遍历器接口，使得字符串可以被for...of循环遍历。相比于传统的for循环，for...of是可以识别出大于0xFFFF的码点），会更加准确。codePointAt()方法是从字符返回码点，fromCodePoint()方法是从码点返回相应字符，at()方法是返回字符串给定位置的字符（有的浏览器可能不支持at方法，在这里可以使用腻子脚本来进行补充）

注意，fromCodePoint方法是定义在String对象上的，使用时应该使用String.fromCodePoint(码点)，而codePointAt,at方法是定义在字符串的实例对象上，使用时codePointAt,at前面的是要操作的字符串
## 2.2 includes(),startsWith(),endsWith()
这三个方法是ES6新增的用来补充传统的indexOf，参数除了传入要匹配的字符外，还可以传入第二个参数，表示要搜索的位置（第二个参数上，endWith的行为与其他的两个不同，它是针对前n个，那两个是针对从第n个位置开始直到字符串结束）

includes():返回布尔值，表示是否找到了参数字符串

startsWith():返回布尔值，表示参数字符串是否在源字符串的头部

endsWith():返回布尔值，表示参数字符串是否在源字符串的尾部
```
var s = `hello world`;

s.startsWith('he')  // true
s.endsWith('d')      // true
s.includes('a')     // false
```
## 2.3 repeat()
repeat()方法返回一个新的字符串，表示将原字符串重复n次，输出的新字符串就是n倍的原字符串。如果n是小数，则会被取整（这里的取整不是四舍五入，是直接舍，只保留整数部分），如果n是0到-1之间的小数，则等同于0；如果n是0（NaN等同于0），那么输出的就是空字符串；如果n是负数或者Infinity，会报错；如果n是字符串，会先转换为数字（可使用parseInt或者parseFloat）
```
'x'.repeat(3)   // "xxx"

'na'.repeat(0)  // ""

'na'.repeat(2.9) // "nana"

'na'.repeat(-1)  // RangeError

'na'.repeat(Infinity) // RangeError

'na'.repeat(-0.9)  // ""

'na'.repeat(NaN)   // ""

'na'.repeat('na')  // "",这是因为na转换为数字后返回的是NaN
```
## 2.4 padEnd(),padStart()
这个是新增的用来补全字符串到指定的长度，padEnd是用于尾部补全，padStart用于头部补全。这两个方法一共接受两个参数，第一个参数是用来制定字符串的最小长度，第二个参数是用来补全的字符串（如果省略了第二个参数，默认使用空格补全长度）

如果原字符串的长度，等于或大于制定的字符串的长度，则返回原字符串；如果用来补全的字符串与原字符串的长度加起来大于制定的字符串长度，这时就要把用来补全的字符串进行裁剪，直到两者的和加起来等于制定的字符串长度
```
'abc'.padStart(2,'ab');  // "abc"
'abc'.padEnd(2,'ab');    // "abc"

'abc'.padEnd(10,'0123456789')  // "abc0123456"
```
padStart的常见用途有两个，第一个是为数值补全指定位数，第二个是提示字符串格式
```
'123'.padStart(10,'0');   // "0000000123"

'09-12'.padStart(10,'YYYY-MM-DD');  // "YYYY-09-12"
```