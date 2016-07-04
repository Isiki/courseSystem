/**
 * Created by Isiki on 2016/4/16.
 */
function checkNull(obj) {
    var label = document.getElementById(obj + "check");
    label.innerText = "";
    var v = document.getElementById(obj).value.trim();
    if (v.length == 0) {
        label.innerHTML = "输入不能为空";
        return false;
    }
    return true;
}

function checkFloat(obj) {
    var str = document.getElementById(obj).value.trim();
    var label = document.getElementById(obj + "check");
    label.innerText = "";
    if (str.length != 0) {
        reg = /^[-\+]?\d+(\.\d+)?$/;
        if (!reg.test(str)) {
            label.innerHTML = "输入必须为数字";
            return false;
        }
        return true;
    }
    label.innerHTML = "输入不能为空";
    return false;
}

function checkEmail(obj) {
    var str = document.getElementById(obj).value.trim();
    var label = document.getElementById(obj + "check");
    label.innerText = "";
    if (str.length != 0) {
        var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!reg.test(str)) {
            label.innerHTML = "请输入合法邮箱";
            return false;
        }
        return true;
    }
    label.innerHTML = "输入不能为空";
    return false;
}

function checkEqual(obj1, obj2) {
    var str1 = document.getElementById(obj1).value.trim();
    var str2 = document.getElementById(obj2).value.trim();
    var label2 = document.getElementById(obj2 + "check");
    label2.innerText = "";
    if (str1.length != 0 && str2.length != 0) {
        if (str1 === str2) {
            return true;
        } else {
            label2.innerHTML = "两次密码输入不一致";
            return false;
        }
    }
    label2.innerHTML = "输入不能为空";
    return false;
}
function checkLength(obj, sizeLeft, sizeRight, errorMessage) {
    var label = document.getElementById(obj + "check");
    label.innerText = "";
    var v = document.getElementById(obj).value.trim();
    if (v.length >= sizeLeft && v.length <= sizeRight) {
        return true;
    } else {
        if (typeof (errorMessage) === undefined) {
            label.innerHTML = "长度为" + sizeLeft + "-" + sizeRight + "位";
        }else{
            label.innerHTML = errorMessage;
        }
        return false;
    }
    label.innerHTML = errorMessage;
}
