'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./hidpi-canvas.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Bullet = function (_Component) {
    _inherits(Bullet, _Component);

    function Bullet(props) {
        _classCallCheck(this, Bullet);

        var _this = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this, props));

        _this.bullets = [];
        _this.addBullets = [];
        return _this;
    }

    _createClass(Bullet, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.initCanvas();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            //暂停动画
            cancelAnimationFrame(this.loop);
        }
    }, {
        key: 'start',
        value: function start() {
            //开始动画
            this.run();
        }
    }, {
        key: 'stop',
        value: function stop() {
            //暂停动画
            cancelAnimationFrame(this.loop);
        }
    }, {
        key: 'add',
        value: function add(bullet) {
            var _this2 = this;

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
            if (Array.isArray(bullet)) {
                bullet.map(function (item) {
                    _this2.addBullets.push(Object.assign({}, {
                        logo: "",
                        text: "",
                        textColor: "#000",
                        background: "transparent"
                    }, item));
                });
            } else {
                this.addBullets.push(Object.assign({}, {
                    logo: "",
                    text: "",
                    textColor: "#000",
                    background: "transparent"
                }, bullet));
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            //清空画布
            this.setState({ bullet: [] });
            var ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvasInfo.canvas.width, this.canvasInfo.canvas.height);
        }
    }, {
        key: 'initCanvas',
        value: function initCanvas() {
            //初始化canvas参数;  width, height, area=0.5, fontSize=12
            var width = this.props.width,
                height = this.props.height;
            var fontSize = this.props.fontSize,
                lineHeight = fontSize * 1.8,
                borderHeight = fontSize * 1.4;
            var maxLineHeight = Math.floor(height * (this.props.area || 0.5) / lineHeight);
            var linesArray = Array.from(Array(maxLineHeight), function (v, k) {
                return k + 1;
            });
            var lineSpeed = Array.from(Array(maxLineHeight), function (v, k) {
                return 1 + Math.random() * 0.5;
            });
            //初始化canvas和弹幕信息
            this.canvasInfo = {
                canvas: {
                    width: width,
                    height: height,
                    maxLineHeight: maxLineHeight,
                    linesArray: linesArray,
                    lineSpeed: lineSpeed
                },
                bullet: {
                    fontSize: fontSize,
                    lineHeight: lineHeight,
                    borderHeight: borderHeight
                }
            };
            this.ctx = this.canvas.getContext("2d");
        }

        //获取弹幕宽度  通过文字大小和文字字数计算宽度

    }, {
        key: 'getBulletWidth',
        value: function getBulletWidth(fontSize, text, hasLogo) {
            var width = 0;
            for (var i = 0; i < text.length; i++) {
                if (text.charCodeAt(i) > 127 || text.charCodeAt(i) === 94) {
                    width += fontSize;
                } else {
                    width += fontSize / 2;
                }
            }
            if (hasLogo) {
                width += this.canvasInfo.bullet.borderHeight / 2 + 10;
            }
            return width;
        }

        //绘制弹幕border路径

    }, {
        key: 'drawPath',
        value: function drawPath(ctx, bullet) {
            var width = this.getBulletWidth(this.canvasInfo.bullet.fontSize, bullet.text, !!bullet.logo);
            var x = bullet.position.x;
            var y = bullet.position.y;
            var lineHeight = this.canvasInfo.bullet.borderHeight;
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

    }, {
        key: 'drawLogo',
        value: function drawLogo(ctx, bullet) {
            var x = bullet.position.x,
                y = bullet.position.y - 0.5 * this.canvasInfo.bullet.borderHeight;
            var r = this.canvasInfo.bullet.borderHeight / 2;
            var d = 2 * r;
            var cx = x + r;
            var cy = y + r;
            var img = new Image();
            img.src = bullet.logo;
            if (img.complete) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(img, x, y, d, d);
                ctx.restore();
            } else {
                img.onload = function () {
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

    }, {
        key: 'writeBullet',
        value: function writeBullet(ctx, bullet) {
            //绘制弹幕border
            this.drawPath(ctx, bullet);
            //绘制边框
            if (bullet.border) {
                ctx.lineWidth = bullet.border.size;
                ctx.strokeStyle = bullet.border.color;
                ctx.stroke();
            }
            //填充背景
            if (bullet.background) {
                ctx.fillStyle = bullet.background;
                ctx.fill();
            }
            //填充文字
            ctx.font = this.canvasInfo.bullet.fontSize + "px Arial";
            ctx.fillStyle = bullet.textColor;
            ctx.textBaseline = "middle";
            ctx.fillText(bullet.text, bullet.position.x + this.canvasInfo.bullet.borderHeight / 2 + (bullet.logo ? this.canvasInfo.bullet.borderHeight * 0.5 + 5 : 0), bullet.position.y);
            //绘制logo
            if (bullet.logo) {
                this.drawLogo(ctx, bullet);
            }
            //canvas保存
            ctx.save();
        }
    }, {
        key: 'run',
        value: function run() {
            var _this3 = this;

            var bullets = this.bullets;
            var ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvasInfo.canvas.width, this.canvasInfo.canvas.height);
            var linesArray = this.canvasInfo.canvas.linesArray;
            bullets = bullets.map(function (item) {
                //判断弹幕是否已经出现，已经出现的继续移动
                if (item.run) {
                    _this3.writeBullet(ctx, item);
                    return item;
                }
                if (linesArray.length > 0) {
                    var index = Math.floor(Math.random() * linesArray.length);
                    var lineNum = linesArray.splice(index, 1)[0]; //获取当前弹幕位于第几行
                    item.position = {
                        x: _this3.canvasInfo.canvas.width,
                        y: (lineNum - 0.5) * _this3.canvasInfo.bullet.lineHeight + (_this3.canvasInfo.bullet.lineHeight - _this3.canvasInfo.bullet.borderHeight) //最上一条的弹幕距离视频顶部
                    };
                    item.line = lineNum;
                    item.run = true;
                    item.width = _this3.getBulletWidth(_this3.canvasInfo.bullet.fontSize, item.text, !!item.logo); //获取当前弹幕的宽度
                    return item;
                } else {
                    return item;
                }
            });
            var newBullets = []; //更新弹幕，删除离开屏幕的弹幕
            bullets.map(function (item) {
                if (item.run) {
                    item.position.x -= _this3.canvasInfo.canvas.lineSpeed[item.line - 1]; //移动弹幕
                    if (item.position.x + item.width + 20 > 0) {
                        if (item.position.x + item.width + 20 < 300 && !item.release) {
                            //释放当前行数
                            _this3.canvasInfo.canvas.linesArray.push(item.line);
                            item.release = true;
                        }
                        newBullets.push(item);
                    }
                } else {
                    newBullets.push(item); //等待中的弹幕
                }
                return item;
            });
            this.bullets = newBullets;
            this.loop = requestAnimationFrame(function () {
                if (_this3.add.length > 0) {
                    _this3.bullets = _this3.bullets.concat(_this3.addBullets); //新添加的弹幕
                    _this3.add = [];
                }
                _this3.run();
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            return _react2.default.createElement('canvas', { style: { position: "absolute", left: "0", top: "0", pointerEvents: "none" }, id: 'myCanvas', ref: function ref(_ref) {
                    _this4.canvas = _ref;
                }, width: '375', height: '300' });
        }
    }]);

    return Bullet;
}(_react.Component);

exports.default = Bullet;