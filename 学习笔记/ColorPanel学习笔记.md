<!--
author: 奶昔-王乃茜
date: 2017-04-01 
title: react入门实践（ColorPanel）
tags: react
category: 前端
status: publish 
summary: 本文主要大体介绍ColorPanel这个小demo。
-->
关于ColorPanel这个demo的具体情况可参考这个文章，这里只是自己在实现过程中的总结（http://www.ibm.com/developerworks/cn/web/1509_dongyue_react/index.html）

1.参照阮一峰的React入门实例教程，在头文件中要引入browser.min.js，下面是对这个文件的描述

并非必须引入browser.min.js，引入它的作用是使浏览器支持babel（babel是一个转换编译器，它能将ES6转换成可以在浏览器中运行的代码），如果你使用ES2015你可以不用引入这个文件

现在也不直接引入browser.min.js，现在文件中引入的是babel.min.js，因为在babel6.0之后，babel不会再提供browser.min.js的支持，所以现在都直接引入babel.min.js用来支持ES6的写法


2.代码要实现的功能框图如下所示

![](http://172.16.1.15:8888/files/1491041436835pic.jpg)
这里涉及几个方面：

在ColorPanel的属性里面赋值了该颜色盘所要显示的所有颜色

在开始的时候渲染父组件

父组件还要有一个默认的颜色

ColorBar要获取颜色属性并渲染出来，具体实现就是子组件要获取父组件的color并渲染出来，这里面涉及子组件怎么获取父组件的属性，this.props

悬停后获取id，传给ColorDisplay进行渲染，this.state

一开始有一个初始状态 ->用户互动 ->鼠标滑动 ->状态改变 ->重新渲染UI（这些应该写在父组件中，原因：如果有多个层级的component,它们公共的父级component负责管理state，然后通过props把state传递到子component中）

getInitialState 定义初始状态（相当于一个对象），可通过this.state获取初始状态 -> 当用户悬停组件，导致状态变化（id改变）->this,setState 方法就修改状态值 -> 每次修改过后，自动调用this.render方法再次渲染组件（不管setState方法何时调用，虚拟DOM都会被重新渲染，之后运行差异算法并按需更新真实的DOM，这里要判断一下，如果是一直悬停在一个颜色上时，不应该再进行渲染）

3.代码中涉及的知识点的整理（这里只是简单提一下，需要详细扩展）

a.this.props表示那些一旦定义，就不再改变的特性

this.state是会随着用户互动而产生变化的特性

b.React.createClass()里面需要传入的是一个object对象，里面的那些getInitialState,render等都是它的属性

c.如果需要在别的地方用到，需要把它return出来，return 后的语句要加上括号

d.组件生命周期

Mounting：组件被插入到DOM中

Updating:如果DOM数据更新，组件需要被重新渲染

(shouldComponentUpdate  是否有新的props或state，没有就不需要更新)

Unmounting:从DOM中移除组件

e.render返回的是组件的输出，每个组件都要有render方法，组件类返回的时候只能返回一个顶级标签

f.如果想要更新组件内容，请保证当前组件的key与上一状态组件的key不同

