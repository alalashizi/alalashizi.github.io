<!--
author: 奶昔-王乃茜
date: 2017-04-26
title: React-生命周期
tags: React
category: 前端
status: publish 
summary: React-生命周期
-->

React生命周期可分为三个部分：挂载（Mounting），组件更新（Updating），卸载（Unmounting）

这里对React使用还是使用React.createClass方法，并没有使用ES6的class方法，这两种方法除了初始化方法会有所不同（getDefaultProps,getInitialState这两个方法不同），生命周期中使用的方法都是一样的

## 挂载（Mounting）
组件的挂载主要是初始化组件的状态，这里会存在两种方法

1.componentWillMount

在初始render前发生，如果你在这一阶段调用setState(),render中会获取更新后的this.state

2.componentDidMount

在初始render之后发生，子组件的componentDidMount是在父组件的componentDidMount之前调用的，执行完这步就已经生成真实的DOM元素了

在这个方法中，你可以执行一些Js操作，例如使用setTimeout或setInterval定时功能的函数，发送AJAX请求

---
当首次挂载组件时，按顺序会执行getDefaultProps -> getInitialState -> componentWillMount -> render -> componentDidMount

如果将挂载的组件卸载后，就需要进行重新挂载，如果并没有卸载就不需要进行重新挂载

当重新挂载组件时，此时按顺序执行getInitialState -> componentWillMount -> render -> componentDidMount，这个时候不会执行getDefaultProps

这里的getDefaultProps是用来设置默认的props，可以使用this.props来获取；getInitialState是用来设置初始的state值，这个函数返回的值是this.state的初始值

## 组件更新（Updating）
当组件接收到新的数据时，就会进行组件更新

1.componentWillReceiveProps
组件属性被改变时（接收新的属性）会调用这个函数，在render之前使用它可以作为属性传输的一种方式，可通过this.props获取旧的属性

2.shouldComponentUpdate
默认是返回true，你也可以在这个函数里进行判断决定是否返回true，因为有些数据虽然更新了但是并不需要重新渲染虚拟DOM，这时你可以让它返回false，就不会执行后续的生命周期函数

3.componentWillUpdate
当接收到新的props或者state时在render之前会执行这个函数，把它看成是一个机会去执行更新前的准备工作

4.componentDidUpdate
当执行完这步后就可以对DOM元素进行操作了

下面是当属性改变或state改变时，组件再次渲染时执行的框图

![](http://172.16.1.15:8888/files/1491458561235pic.jpg)

---
在componentWillReceiveProps、shouldComponentUpdate和componentWillUpdate中还是无法获取更新后的this.state，此时使用this.state还是访问的未更新的state，只有在render和componentDidUpdate中才能获取到更新后的this.state

不过，禁止在shouldComponentUpdate和componentWillUpdate中调用setState函数

## 卸载（Unmounting）
组件卸载只有一个函数，是一个卸载前状态

componentWillUnmount

在componentWillUnmount方法中，我们会执行一些清理，比如事件回收，回收由componentDidMount创建的DOM元素或是清除定时器

