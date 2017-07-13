<!--
author: 奶昔-王乃茜
date: 2017-04-19
title: Mocha-ES6测试总结
tags: Mocha ES6
category: 前端
status: publish 
summary: 本文主要介绍了如何使用mocha测试ES6代码
-->
现在项目中大多使用了ES6语句来进行编写，在使用Mocha+Chai编写测试脚本时，当然也是支持对使用ES6语法书写的代码的检查。

如果你的项目中没有用到ES6语法，是不需要进行下面的额外配置。

之所以要进行额外配置，主要是因为现在对ES6的语法支持并不是特别好，在使用ES6的时候大多需要使用babel对其进行转换。

Mocha在对代码进行检测前，如果碰到要检测的代码是使用ES6语法书写，它也是解决不了的，这个时候也要给它配置babel

+ 在进行配置之前，你要保证已经安装了以下的npm包：
  - mocha
  - chai
  - babel-core
  - babel-loader
  - babel-preset-es2015
  - babel-preset-stage-0
  - babel-preset-stage-1
  - babel-register 

在这里，如果你要检测的代码中使用了新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign），这时你还需要下一个babel-polyfill npm包

## 第一步

先在项目下建一个test文件夹，这里面装的是你针对项目编写的测试脚本，测试脚本的命名一般都是要检测的js文件名.test.js，其实也可以不用这样，这样只是为了标示一下这是测试脚本。

在使用babel的插件之前首先要配置.babelrc（存在项目的根目录下），这是第一步。在没配置之前是这样的，空的。
```

{
  "presets": [],     
  "plugins": []
}

```

presets 字段设定转码规则（主要配置这个），官方提供以下的规则集，你可以根据需要安装；plugins 字段设置插件，我们不配置，可以删掉
```

// ES2015转码规则
$ npm install --save-dev babel-preset-es2015

// react转码规则
$ npm install --save-dev babel-preset-react

// ES7不同阶段语法提案的转码规则（共有4个阶段）
$ npm install --save-dev babel-preset-stage-0
$ npm install --save-dev babel-preset-stage-1
$ npm install --save-dev babel-preset-stage-2
$ npm install --save-dev babel-preset-stage-3

```

按照我们的需要，这里配置成如下的样子

```

{
  "presets": [
  	"es2015",
  	"babel-preset-stage-0",
  	"babel-preset-stage-1",
  ]
}

```

## 第二步

配置好babel后，在项目根目录下打开bash（你也可以使用cmd，都一样）执行 mocha --compilers js:babel-core/register 这条指令

--compilers后跟的是一个用冒号分隔的字符串，冒号左边是文件的后缀名，右边是用来处理这一类文件的模块名

这条指令的意思是在运行测试之前，先用babel-core/register模块，处理一下.js文件

你可以在test目录下创建一个mocha.opts文件，在这个文件中写入参数，然后你就可以只在bash中执行 mocha 这个指令，不需要带后面的--指令

下面我们配置一下mocha.opts这个文件

```
// opts中的内容

--recursive   // 执行test中所有的测试用例，如果不配置这个参数，mocha只会执行test目录下的第一层测试脚本
--growl       // growl是运行在mac系统下的提示工具
--compilers js:babel-core/register     // 在执行mocha前对test中所有的js文件执行babel转换

```

## 第三步

在这里，我们生成HTML格式的测试报告（可以在浏览器中打开，更直观）以及测试文档（md形式，方便阅读）

### 生成HTML格式的测试报告

要生成HTML格式的测试报告，需要使用 mochawesome 这个npm包，首先要下载

```

npm install --save-dev mochawesome

```

下好之后你可以直接在bash中打上 mocha --reporter mochawesome 这个指令，执行完这个指令后，你会在项目的根目录下找到 mochawesome-reports 这个文件夹，在浏览器中打开 mochawesome.html ，你就会看到一个漂亮的测试报告

前面我们提到了mocha.opts这个文件，我们也可以在里面加上 --reporter mochawesome 这条语句，这样当你执行mocha这个指令时就会自动生成 mochawesome-reports 这个文件夹

现在mocha.opts里面是这样的

```

--reporter mochawesome      // 指定测试报告的格式
--recursive
--growl
--compilers js:babel-core/register

```

### 生成md形式的测试文档

在项目根目录下打开bash，输入 mocha --recursive -R markdown > spec.md 这条语句，你就会在项目根目录下发现多了一个 spec.md 文件，这个就是我们生成的md形式的测试文档

注：在这里，它不能配置到 mocha.opts 文件中，亲测配置进去会报错，所以只能在bash中手动输入

---------
## 番外

### 现在总结下来好像也没有那么难了，但是在当时还是遇到一些问题，如果你按照上面的步骤还是不能成功时，你可以考虑一下几点：

1.npm包有没有成功安装，如果在项目中成功安装了，还可以全局安装一下

2.你要测试的文件中有没有引用项目中其他文件的方法，其他文件的引用时相对路径引用还是绝对路径引用，这里要使用相对路径，这也是在提醒写项目的程序员，要尽量降低项目各个模块之间的耦合性，减少相互之间的引用，如果引用应该采用相对路径引用，不要使用绝对路径。


### 在学习mocha+chai的过程中，可以参考以下的文章：

1.https://www.qcloud.com/community/article/511629001489391616?fromSource=gwzcw.58784.58784.58784

2.http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html

3.http://mochajs.org/

4.http://chaijs.com/