import React, { Component } from 'react';
import './hidpi-canvas.js';

export default class Bullet extends Component{
    constructor(props){
        super(props);
        this.bullets = [];
        this.addBullets= [];
    }

    componentDidMount(){
        this.initCanvas();
    }

    componentWillUnmount(){
        //暂停动画
        cancelAnimationFrame(this.loop);
    }

    start(){
        //开始动画
        this.run();
    }

    stop(){
        //暂停动画
        cancelAnimationFrame(this.loop);
    }

    add(bullet){
        //添加弹幕;
        /* bullet 格式 {
            logo: "弹幕前面图片地址",
            text: "弹幕",
            textColor: "弹幕文字颜色",
            background: "弹幕背景颜色",
            boder:{
                size: "弹幕边框linewidth", 
                color: "弹幕边框颜色"
            }
        } */
        if(Array.isArray(bullet)){
            bullet.map(item=>{
                this.addBullets.push( Object.assign({},{
                    logo: "",
                    text: "",
                    textColor: "#000",
                    background: "transparent"
                },item) );
            })
        }else{
            this.addBullets.push( Object.assign({},{
                logo: "",
                text: "",
                textColor: "#000",
                background: "transparent"
            },bullet) );
        } 
    }

    clear(){
        //清空画布
        this.setState({bullet:[]});
        let ctx = this.ctx;
        ctx.clearRect(0,0,this.canvasInfo.canvas.width,this.canvasInfo.canvas.height);
    }

    initCanvas(){ 
        //初始化canvas参数;  width, height, area=0.5, fontSize=12
        let width = this.props.width, height = this.props.height;
        let fontSize = this.props.fontSize, lineHeight = fontSize*1.8, borderHeight = fontSize*1.4;
        let maxLineHeight = Math.floor(height*(this.props.area||0.5)/lineHeight);
        let linesArray = Array.from(Array(maxLineHeight), (v,k) =>k+1);
        let lineSpeed = Array.from(Array(maxLineHeight), (v,k) =>{
            return 1+Math.random()*0.5
        });
        //初始化canvas和弹幕信息
        this.canvasInfo = {
            canvas:{
                width,
                height,
                maxLineHeight,
                linesArray,
                lineSpeed
            },
            bullet:{
                fontSize,
                lineHeight,
                borderHeight
            }
        };
        this.ctx = this.canvas.getContext("2d");
    }

    //获取弹幕宽度  通过文字大小和文字字数计算宽度
    getBulletWidth(fontSize, text, hasLogo) {
        let width = 0;
        for (let i = 0; i < text.length; i++) {
            if (text.charCodeAt(i) > 127 || text.charCodeAt(i) === 94) {
                width += fontSize;
            } else {
                width += fontSize / 2;
            }
        }
        if(hasLogo){
            width += this.canvasInfo.bullet.borderHeight/2 + 10;
        }
        return width;
    }

    //绘制弹幕border路径
    drawPath(ctx,bullet){
        let width = this.getBulletWidth(this.canvasInfo.bullet.fontSize, bullet.text, !!bullet.logo);
        let x = bullet.position.x;
        let y = bullet.position.y;
        let lineHeight = this.canvasInfo.bullet.borderHeight;
        ctx.beginPath();
        ctx.moveTo(x + lineHeight / 2, y - 0.5 * lineHeight);
        ctx.lineTo(x + lineHeight / 2 + width, y - 0.5 * lineHeight);
        ctx.arcTo(x + lineHeight + width, y - 0.5 * lineHeight, x + lineHeight + width, y + lineHeight / 2 - 0.5 * lineHeight, lineHeight / 2);
        ctx.arcTo(x + lineHeight + width, y + lineHeight - 0.5 * lineHeight, x + lineHeight / 2 + width, y + lineHeight - 0.5 * lineHeight, lineHeight / 2);
        ctx.lineTo(x + lineHeight / 2, y + lineHeight - 0.5 * lineHeight);
        ctx.arcTo(x, y + lineHeight - 0.5 * lineHeight, x, y + lineHeight / 2 - 0.5 * lineHeight, lineHeight / 2);
        ctx.arcTo(x, y - 0.5 * lineHeight, x + lineHeight / 2, y - 0.5 * lineHeight, lineHeight / 2);
        ctx.closePath();
    }

    //绘制logo
    drawLogo(ctx,bullet){
        let x = bullet.position.x, y = bullet.position.y - 0.5*this.canvasInfo.bullet.borderHeight;
        let r = this.canvasInfo.bullet.borderHeight/2;
        let d = 2 * r;
        let cx = x + r;
        let cy = y + r;
        let img = new Image();
        img.src = bullet.logo;
        if(img.complete){
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, x, y, d, d);
            ctx.restore();
        }else{
            img.onload=()=>{
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, x, y, d, d);
                ctx.restore();
            };
        }
    }

    //画一条弹幕
    writeBullet(ctx,bullet){
        //绘制弹幕border
        this.drawPath(ctx,bullet);
        //绘制边框
        if (bullet.border) {
            ctx.lineWidth = bullet.border.size;
            ctx.strokeStyle = bullet.border.color;
            ctx.stroke();
        }
        //填充背景
        if(bullet.background){
            ctx.fillStyle = bullet.background;
            ctx.fill();
        }
        //填充文字
        ctx.font = this.canvasInfo.bullet.fontSize + "px Arial";
        ctx.fillStyle = bullet.textColor;
        ctx.textBaseline = "middle";
        ctx.fillText(bullet.text, bullet.position.x+this.canvasInfo.bullet.borderHeight/2 + (bullet.logo?this.canvasInfo.bullet.borderHeight*0.5+5:0) , bullet.position.y);
        //绘制logo
        if(bullet.logo){
            this.drawLogo(ctx,bullet);
        }
        //canvas保存
        ctx.save();
    }

    run(){
        let bullets = this.bullets;
        let ctx = this.ctx;
        ctx.clearRect(0,0,this.canvasInfo.canvas.width,this.canvasInfo.canvas.height);
        let linesArray = this.canvasInfo.canvas.linesArray;
        bullets = bullets.map(item=>{
            //判断弹幕是否已经出现，已经出现的继续移动
            if(item.run){
                this.writeBullet(ctx,item);
                return item;
            }
            if(linesArray.length > 0){
                let index = Math.floor(Math.random()*linesArray.length);
                let lineNum = linesArray.splice(index,1)[0]; //获取当前弹幕位于第几行
                item.position = {
                    x: this.canvasInfo.canvas.width,
                    y: (lineNum-0.5)*this.canvasInfo.bullet.lineHeight+(this.canvasInfo.bullet.lineHeight-this.canvasInfo.bullet.borderHeight)  //最上一条的弹幕距离视频顶部
                };
                item.line = lineNum;
                item.run = true;
                item.width = this.getBulletWidth(this.canvasInfo.bullet.fontSize, item.text, !!item.logo); //获取当前弹幕的宽度
                return item;
            }else{
                return item;
            }
        });
        let newBullets = []; //更新弹幕，删除离开屏幕的弹幕
        bullets.map(item=>{
            if(item.run){
                item.position.x -= this.canvasInfo.canvas.lineSpeed[item.line-1]; //移动弹幕
                if(item.position.x+item.width+20>0){
                    if(item.position.x+item.width+20<300 && !item.release ){ //释放当前行数
                        this.canvasInfo.canvas.linesArray.push(item.line);
                        item.release = true;
                    }
                    newBullets.push(item);
                }
            }else{
                newBullets.push(item); //等待中的弹幕
            }
            return item;
        });
        this.bullets = newBullets;
        this.loop = requestAnimationFrame(()=>{
            if(this.add.length>0){
                this.bullets = this.bullets.concat(this.addBullets); //新添加的弹幕
                this.add = [];
            }
            this.run();
        });
    }

    render(){
        return (
            <canvas style={{position:"absolute",left:"0",top:"0",pointerEvents:"none"}} id="myCanvas" ref={(ref)=>{this.canvas = ref;}} width="375" height="300" />
        )
    }
}