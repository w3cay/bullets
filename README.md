# bullets
弹幕组件

![image](https://raw.githubusercontent.com/chelun-h5/bullets/master/doc/bullets.png)

## 安装

```
yarn add cl-bullets
```
或

```
npm i cl-bullets --save
```

## React组件

React组件有默认导出，所以组件名字任意，以下代码作为示例

```
// 导入
import Bullets from 'cl-bullets';

// 使用 
<Bullets ref={(ref)=>{this.bullets = ref}} width={375} height={300} fontSize={12} area={0.5} />
//一条弹幕的格式
this.bullets.add({
    logo: "", 
    text: "我是一条弹幕",
    textColor: "#ffff00",
    background: "rgba(0,0,0,0.3)",
    border:{
        size: 1,
        color: "red"
    }
});
//or 添加多条弹幕
this.bullets.add([{
    logo: "", 
    text: "我是一条弹幕",
    textColor: "#ffff00",
    background: "rgba(0,0,0,0.3)",
    border:{
        size: 1,
        color: "red"
    }
}]);
//开始滚动
this.bullets.start()
//停止滚动
this.bullets.stop();
//清空画布
this.bullets.clear();
```

## Vue组件

```
待开发
```

## 属性说明


属性 | 值 | 说明
---|---|---
width | 必填；数字；| 宽度
height | 必填；数字；| 高度
fontSize | 必填；数字；| 弹幕中字体大小
area | 必填；数字；| 0-1 弹幕的区域，从顶部开始计算
