<!--
author: 奶昔-王乃茜
date: 2017-04-11
title: Chai 断言库
tags: Chai
category: 前端
status: publish 
summary: Chai 断言库详解
-->

+ 断言库主要有should.js、expect.js、Chai、better-assert、unexpected这几类

    -  should.js     - BDD风格贯穿始终

    -  expect.js     - expect风格的断言库

    -  Chai          - 同时包含expect,assert,should风格的断言

    -  better-assert - C风格的自文档化的assert
    
    -  unexpected    - 可扩展的BDD断言工具

在这里我们选用Chai,因为它可以提供多风格的断言，在这里我们主要使用的是BDD风格的开发方式（主流的测试类型包括BDD和TDD，BDD与TDD的不同以及各自适用的环境，请自行google）。Chai提供的BDD风格的接口有两个，一个是should,一个是expect,在这里我们选用expect（should 不兼容IE浏览器）。

注：Chai只是一个断言库，如果想要编写测试脚本，还需要结合其他的测试框架，我在使用Chai时是配合着Mocha使用的，在文章的最后会对Mocha、Chai、测试脚本之间的关系做个说明

首先你要使用npm包来安装Chai，将Chai安装在项目中

```
$ npm install chai --save-dev
```

然后编写测试脚本

```
var expect = require('Chai').expect;

断言： expect(要测试的目标).Language Chains.API(选择要使用的API)
```

这里的Language Chains是用来连接要测试的目标和所选择的API，目的是为了增加语义，使其便于理解，并不参与测试。Language Chains 的列表如下：

+ Language Chains
   - to 
   - be
   - been
   - is 
   - that
   - which
   - and
   - has
   - have
   - with
   - at
   - of
   - same

文章下面介绍了大半部分的API，使用它们来编写断言。

### .not
跟在链式调用后面用来否定断言，一般配合其他的API使用表否定

```
expect({foo:'baz'}).have.property('foo').not.have.equal('bar');  // foo:baz 有属性foo 但是值不等于bar,因为值等于baz啊
```

### .deep
.deep一般用在equal、property的前面，是用来深度比较两个对象。当对象存在嵌套时就需要进行深度比较，这时再单单使用property，是没有效果的。当存在下面对象的形式时就属于嵌套了。

```
var deep={   //属于存在嵌套
    obj:{
        bar:'baz'
    }
};

var deep = {   //简单结构，不存在嵌套
    bar:'baz'
};
```

使用.deep.property还存在一个特别的地方：当你碰到 . 或者 [] 时，要在它们的前面加上 \\ ，不然就会报错，例如下面的例子：

```
var deepCss = {  // 存在嵌套
    '.link':{
        '[target]':42
    }
};

// 这时再获取属性就要使用.deep了，由于属性中存在 . 以及 [] ，所以下面在使用它的时候要加上\\

expect(deepCss).to.have.deep.property('\\.link.\\[target\\]',42);

```

### .any 、.all
这两个用在key之前，any的意思是其中任意一个就行，all的意思是全部，这两个属于相反的意思

```
expect({foo:'bar'}}).have.all.keys('foo', 'bar'); // 这样会报错，因为它里面只有一个foo

expect({foo:'bar'}}).have.any.keys('foo', 'bar');  // 这样不会报错
```

### .a(type)、.an(type)
这两个是用来断言变量的类型，如果类型名是元音来头，就用an，如果类型名是辅音开头，就用a

```
expect('test').to.be.a('string');
expect({ foo: 'bar' }).to.be.an('object');
expect(null).to.be.a('null');
expect(undefined).to.be.an('undefined');
expect(new Error).to.be.an('error');
expect(new Promise).to.be.a('promise');
expect(new Float32Array()).to.be.a('float32array');
expect(Symbol()).to.be.a('symbol');
```

### .include(value)、.contain(value)
用来断言字符串包含和数组包含，如果用在链式调用中，可以与keys结合用来测试对象是否包含某key

```
expect([1,2,3]).include(2);
expect('foobar').contain('foo');
expect({foo:'bar',hello:'world'}).contain.keys('keys');
```

### .ok
断言目标是否为真，包含隐式转换

```
expect(1).to.be.ok;   //  断言1是真的，这里要断言1是真的，就要用ok，不可以用true，用true的话不成立，因为true不包含隐式转换
expect(false).to.not.be.ok;
```

### .true、.false
断言目标是真还是假，这里不包含隐式转换。下面的例子中，按照js的处理方式，1是真的，0是假的，可是对于断言库来说.true和.false都不包含隐式转换，只有true是等于true的，false是等于false的，其他的都不等于

```
expect(true).to.be.true;
expect(1).to.not.be.true;

expect(false).to.be.false;
expect(0).to.not.be.false;
```

### .null、.undefined、.NaN
断言一个目标是null or undefined or NaN，都不包含隐式转换

```
// 对于null和undefined，只有自身和自身是相等

expect(null).to.be.null;
expect(undefined).to.not.be.null;

expect(undefined).to.be.undefined;
expect(null).to.be.not.undefined;

// 对于NaN，亲测字符串、对象、数组都属于NaN，只有数字不是NaN，这与js中的不一样
expect('foo').to.be.NaN;
expect([1,2,3]).to.be.NaN;
expect({foo:'bar'}).to.be.NaN;

expect(2).to.be.not.NaN;

```

### .exist
断言目标既不是null也不是undefined

```
var foo = 'hi',bar = null,baz;

expect(foo).to.be.exist;
expect(bar).to.not.be.exist;
expect(baz).to.not.be.exist;
```

### .empty
断言一个对象的长度是0.对于数组和字符串，它检查length属性；对于对象，它获取它可枚举的keys的数量

```
expect([]).to.be.empty;
expect('').to.be.empty;
expect({}).to.be.empty;

```

### .arguments
断言目标是一个arguments对象

```
function test () {
  expect(arguments).to.be.arguments;
}

```

### .equal(value)、.eql(value)
断言目标是否等于value，执行严格相等（ === ）。如果前面有deep，执行目标的深度相等，对于对象和数组的等于要使用.deep.equal。.eql(value)其实就是.deep.equal的简写

```
expect('hello').to.equal('hello');
expect(42).to.equal(42);
expect(1).to.not.equal(true);
expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });
expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });  // 这里就可以简写，写成下面的样子
expect({ foo: 'bar' }).to.eql({ foo: 'bar' });    // 和上面的是一样的

```

### .above(value)、.least(value)、.below(value)、.most(value)
这四个api是用来说明断言目标和value的关系的，above是大于value，least是大于等于value，below是小于value，most是小于等于value。

同时这四个api可以与length结合，用来断言字符串或是数组的长度，表示的含义与它们在和value进行对比时的含义是一样的，above和least可以用来断言最小长度，below和most可以用来断言最大长度

```
// above

expect(10).to.be.above(5);
expect('foo').to.have.length.above(2);
expect([ 1, 2, 3 ]).to.have.length.above(2);

// least

expect(10).to.be.at.least(10);
expect('foo').to.have.length.of.at.least(2);
expect([ 1, 2, 3 ]).to.have.length.of.at.least(3);

// below

expect(5).to.be.below(10);
expect('foo').to.have.length.below(4);
expect([ 1, 2, 3 ]).to.have.length.below(4);

// most

expect(5).to.be.at.most(5);
expect('foo').to.have.length.of.at.most(4);
expect([ 1, 2, 3 ]).to.have.length.of.at.most(3);

```

### .within(start,finish)
断言目标是属于一个范围，直接使用时多用于判断数字，也可以与length进行结合，判断字符串或者是数组的长度是属于一个范围

```
expect(7).to.be.within(5,10);
expect('foo').to.have.length.within(2,4);
expect([ 1, 2, 3 ]).to.have.length.within(2,4);

```

### .instanceof(constructor)
断言一个目标是某个构造器产生的实例

```
var Tea = function(name){this.name = name;}
  , Chai = new Tea('chai');

expect(Chai).to.be.instanceof(Tea);
expect([1,2,3]).to.be.instanceof(Array);
```

### .property(name,[value])
断言一个目标有属性name，还可以断言属性的值时严格等于value的，value参数是可选的。如果和deep连用，可以访问到深度的对象或者数组的指向

```
// deep 指向
var deepObj = {
    green: { tea: 'matcha' }
  , teas: [ 'chai', 'matcha', { tea: 'konacha' } ]
};

expect(deepObj).to.have.deep.property('green.tea', 'matcha');
expect(deepObj).to.have.deep.property('teas[1]', 'matcha');
expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha');

// 可以使用数组作为deep.property的开始指向

var arr = [
    [ 'chai', 'matcha', 'konacha' ]
  , [ { tea: 'chai' }
    , { tea: 'matcha' }
    , { tea: 'konacha' } ]
];

expect(arr).to.have.deep.property('[0][1]', 'matcha');
expect(arr).to.have.deep.property('[1][2].tea', 'konacha');

// 你也可以进行深度的链式断言

expect(deepObj).to.have.property('green')
  .is.an('object')
  .deep.equals({ tea: 'matcha' });
```

### .ownProperty(name)
断言目标拥有自己的属性，不是继承得来的

### .length、.lengthOf(value[,message])
length经常用来和above,below,within等等这类的api联合使用，用来断言目标的长度。当你需要写上具体的长度数值时，要使用lengthOf

```
expect([ 1, 2, 3]).to.have.lengthOf(3);
expect('foobar').to.have.lengthOf(6);

```

### .match(regexp)
断言一个目标是否匹配一个正则表达式

```
expect('foobar').to.match(/^foo/);

```

### .string(string)
断言一个字符串包含另一个字符串

```
expect('foobar').to.have.string('bar');
```

### .keys(key1,[ksy2],[...])
断言目标包含一些或全部的keys。当使用keys时，可以结合any,all,contains or have。any 或 all应该使用一个，如果都不使用，会默认为all 

```
expect({ foo: 1, bar: 2 }).to.have.any.keys('foo', 'baz');
expect({ foo: 1, bar: 2 }).to.have.any.keys('foo');
expect({ foo: 1, bar: 2 }).to.contain.any.keys('bar', 'baz');
expect({ foo: 1, bar: 2 }).to.contain.any.keys(['foo']);
expect({ foo: 1, bar: 2 }).to.contain.any.keys({'foo': 6});
expect({ foo: 1, bar: 2 }).to.have.all.keys(['bar', 'foo']);
expect({ foo: 1, bar: 2 }).to.have.all.keys({'bar': 6, 'foo': 7});
expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys(['bar', 'foo']);
expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys({'bar': 6});

```
### .satisfy(method)
断言目标通过一个给定的真实的测试

```
expect(1).to.satisfy(function(num){return num > 0});
```

### .closeTo(expected,delta)
断言目标是在expected +/- delta的范围内

```
expect(1.5).to.be.closeTo(1,0.5);
```

----

番外：Mocha、Chai和测试脚本

1.Mocha只是个测试框架，它的作用是运行测试脚本，不负责具体测试

2.Chai只是个断言库，它的作用是用来在测试脚本中编写断言

3.测试脚本是js文件，只不过测试框架提供了额外的全局方法和变量，我们需要使用，最终是要通过框架来启动测试脚本的

4.测试脚本中，断言库提供了一些语法支持，用来做判断的标准。比如你想测试某个变量 a 应该为字符串，你只需类似这么写 expect(a).to.be.a('string'); 即可，其他的交给 Mocha + Chai，因为它们会正确的处理：如果为真则通过，如果为假则报错

5.Mocha自身没有自带断言库，而Chai作为单独的断言库，功能很强大，两者通常结合使用