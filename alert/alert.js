//目标元素居中
function positionCenter(targetEle) {
    var bdy = document.body,
        w = (bdy.clientWidth - targetEle.offsetWidth) / 2,
        ch = bdy.clientHeight,
        oh = targetEle.offsetHeight,
        st = bdy.scrollTop,
        h = Math.abs(ch - oh) / 2 + st;
    return { width: w + 'px', height: h + 'px' };
}

//拖拽功能
function drag(targetEle, fatherEle) {
    if (targetEle == fatherEle) targetEle = fatherEle;
    else {
        targetEle.addEventListener("mousedown", function(ev) {
            var oEvent = ev || event;
            var x = 0;
            var y = 0;
            x = oEvent.clientX - fatherEle.offsetLeft;
            y = oEvent.clientY - fatherEle.offsetTop;
            var mousemove = function(ev) {
                var oEvent = ev || event;
                var out1 = oEvent.clientX - x;
                var out2 = oEvent.clientY - y;
                var oBody1 = document.documentElement.clientWidth - fatherEle.offsetWidth;
                var oBody2 = document.documentElement.clientHeight - fatherEle.offsetHeight;
                if (out1 < 0) { out1 = 0; } else if (out1 > oBody1) { out1 = oBody1; }
                if (out2 < 0) { out2 = 0; } else if (out2 > oBody2) { out2 = oBody2; }
                fatherEle.style.left = out1 + 'px';
                fatherEle.style.top = out2 + 'px';
                fatherEle.style.opacity = 0.5;
            };

            var mouseup = function() {
                document.removeEventListener("mousemove", mousemove);
                document.removeEventListener("mouseup", mouseup);
                fatherEle.style.opacity = 1;
            };

            document.addEventListener("mousemove", mousemove, false);
            document.addEventListener("mouseup", mouseup, false);
            return false;
        }, false);
    }
}

//创建元素，设置它的class并将它添加到父元素中去
function createEmt(nodeName, cName, parentNode) {
    var element = document.createElement(nodeName);
    if (cName) { element.className = cName; }
    if (parentNode) { parentNode.appendChild(element); }
    return element;
}

(function() {

    //点击按钮显示对话框
    function showDialog(dialogStyle) {

        //自定义样式
        function setStyles(oStyle) {
            if (oStyle.dialog) {
                dialog.setAttribute('style', oStyle.dialog);
            }
            if (oStyle.title) {
                top.setAttribute('style', oStyle.title);
            }
            if (oStyle.content) {
                center.setAttribute("style", oStyle.content);
            }
            if (oStyle.footer) {

                btn.setAttribute("style", oStyle.footer);
            }
        }

        //关闭按钮
        function closeDialog() {
            background.remove();
            dialog.remove();
            window.removeEventListener('resize', setSizePostion);
        }

        function setSizePostion() {
            center.style.maxHeight = Math.max(document.documentElement.clientHeight - top.clientHeight - bottom.clientHeight - 40 - 40, 100) + 'px';
            var oSize = positionCenter(dialog);
            var height = oSize.height,
                width = oSize.width;
            dialog.style.top = height;
            dialog.style.left = width;
        }


        //自定义按钮样式
        function setBtnStyles(btnStyle) {
            for (var i = 0; i < btnStyle.length; i++) {
                var btn = [];
                btn[i] = createEmt("input", "btn", bottom);
                btn[i].setAttribute("type", "button");
                btn[i].className += " other";
                btn[i].setAttribute("value", btnStyle[i].name == null ? '确定' : btnStyle[i].name);
                // 这是一个很经典的不懂作用域造成的问题。在for循环里，i不断的变化，但click事件是异步发生的，事件发生时，循环早已经执行完，i的值是btnStyle数组的长度
                // 所以，总是访问不到action.加一层匿名函数的作用是，在每次循环时生成一个新的子作用域，该作用域表一个不会再变的参数style.问题得以解决。
                (function(style) {
                    btn[i].addEventListener("click", function(evt) {
                        if (style.action && style.action.call) {
                            style.action({
                                dialog: dialog,
                                background: background,
                                closeDialog: closeDialog
                            })
                        }
                    }, false);
                }(btnStyle[i]))
            }
        }

        //自定义主题
        var dialogClassName = 'dialog';
        if (dialogStyle.color == 'gray') {
            dialogClassName += " gray";
        } else if (dialogStyle.color == 'green') {
            dialogClassName += " green";
        } else {
            dialogClassName += " blue";
        }

        //绘制对话框
        var dialog = createEmt("div", dialogClassName);
        var background = createEmt("div", "background");
        var top = createEmt("div", "top", dialog);
        var titleTextNode = document.createTextNode(dialogStyle.title == null ? '温馨提示' : dialogStyle.title);
        top.appendChild(titleTextNode);
        var closeImg = createEmt("a", "closeImg", top);
        closeImg.addEventListener("click", closeDialog, false);
        var center = createEmt("div", "center", dialog);
        center.innerHTML = dialogStyle.msg;


        //自定义图标
        var msgClassName = 'msgType';
        if (dialogStyle.key == 'error') {
            msgClassName += " keyError";
        } else if (dialogStyle.key == 'warn') {
            msgClassName += " keyWarn";
        } else {
            msgClassName += " keyRight";
        }

        var msgType = createEmt("div", msgClassName, center);
        var bottom = createEmt("div", "bottom", dialog);


        //函数调用
        setBtnStyles(dialogStyle.btnStyle || [{ name: '确定', action: function(obj) { obj.closeDialog() } }]);
        setStyles(dialogStyle.oStyle || {});
        drag(top, dialog);

        background.addEventListener("click", closeDialog, false);
        background.style.height = document.documentElement.scrollHeight + 'px';
        var body = document.querySelector("body");
        body.appendChild(background);
        body.appendChild(dialog);

        setSizePostion();

        //随着浏览器大小的变化改变对话框的大小以及位置
        window.addEventListener("resize", setSizePostion, false);
    }

    //按下Esc键关闭最后一层对话框
    function keyEvent() {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        if (keyCode == 27) {
            var lastDialog = document.body.querySelectorAll('.dialog');
            if (lastDialog.length == 0) return false;
            lastDialog[lastDialog.length - 1].remove();
            var lastBackground = document.body.querySelectorAll('.background');
            lastBackground[lastBackground.length - 1].remove();
        }
    }
    document.addEventListener("keydown", keyEvent, false);
    window.showDialog = showDialog;

})();
