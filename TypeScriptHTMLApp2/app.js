var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var content;
var player;
var Timer = (function () {
    function Timer(handler, tag) {
        this.handler = handler;
        this.tag = tag;
    }
    Timer.prototype.start = function (interval) {
        this.id = setInterval(this.handler, interval);
        Timer.timers.push(this);
        // console.log(this.tag+' is created');
    };
    Timer.prototype.stop = function () {
        clearInterval(this.id);
    };
    Timer.prototype.destroy = function () {
        this.stop();
        Timer.timers.splice(Timer.timers.indexOf(this), 1);
        //console.log(this.tag+' is destroyed');
        delete this;
    };
    Timer.timers = new Array();
    return Timer;
}());
function reset(canvas) {
    canvas.width = canvas.width;
}
var GameObject = (function () {
    function GameObject(canvas, name) {
        this.transparency = 1;
        this.name = name;
        this.img = new Image;
        this.img.src = 'players\\' + name + '\\img.png';
        this.canvas = canvas;
        GameObject.objs.push(this);
    }
    Object.defineProperty(GameObject.prototype, "centerX", {
        get: function () {
            return this.x + this.img.width / 2;
        },
        set: function (cX) {
            this.x = cX - this.img.width / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "centerY", {
        get: function () {
            return this.y + this.img.height / 2;
        },
        set: function (cy) {
            this.y = cy - this.img.height / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "groundFY", {
        get: function () {
            return this.y + this.img.height;
        },
        set: function (gY) {
            this.y = gY - this.img.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "groundBY", {
        get: function () {
            return this.y + this.img.height - this.depth;
        },
        set: function (gY) {
            this.y = gY - this.img.height + this.depth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameObject.prototype, "rightX", {
        get: function () {
            return this.x + this.img.width;
        },
        set: function (lX) {
            this.x = lX - this.img.width;
        },
        enumerable: true,
        configurable: true
    });
    GameObject.prototype.draw = function (src) {
        if (src) {
            this.img.src = src;
        }
        this.canvas.globalAlpha = this.transparency;
        this.canvas.drawImage(this.img, this.x, this.y);
    };
    ;
    GameObject.drawAll = function () {
        GameObject.objs.sort(function (a, b) { if (a.groundFY < b.groundFY)
            return 0;
        else
            return 1; });
        reset(document.getElementById('myCanvas'));
        GameObject.objs.forEach(function (obj) { obj.REDRAW(); });
    };
    GameObject.prototype.REDRAW = function () {
        this.draw();
    };
    GameObject.prototype.checkForCollision = function () {
        var _this = this;
        return GameObject.objs.filter(function (obj) { if (_this != obj)
            return ((_this.groundFY > obj.groundBY) && (_this.groundBY < obj.groundFY)) && ((_this.rightX > obj.x) && (_this.x < obj.rightX)); }, this)[0];
    };
    GameObject.objs = new Array();
    return GameObject;
}());
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(canvas, name) {
        _super.call(this, canvas, name);
        this.picCount = 8;
        this.mods = '';
    }
    Player.prototype.redraw = function (direction) {
        if (direction) {
            this.direction = direction;
        }
        this.img.src = 'players\\' + this.name + '\\img' + this.mods + (Math.round(this.direction / 360 * this.picCount) * 360 / this.picCount) % 360 + '.png';
        this.draw(this.img.src);
    };
    Player.prototype.REDRAW = function () {
        this.redraw();
    };
    return Player;
}(GameObject));
var Me = (function (_super) {
    __extends(Me, _super);
    function Me(canvas, name) {
        _super.call(this, canvas, name);
    }
    Me.prototype.move = function (ch) {
        switch (ch) {
            case 'KeyW':
                this.centerY -= 5;
                break;
            case 'KeyS':
                this.centerY += 5;
                break;
            case 'KeyD':
                this.centerX += 5;
                break;
            case 'KeyA':
                this.centerX -= 5;
                break;
            default:
                this.mods = 'wk';
                break;
        }
        ;
        if (this.checkForCollision()) {
            switch (ch) {
                case 'KeyW':
                    this.centerY += 5;
                    break;
                case 'KeyS':
                    this.centerY -= 5;
                    break;
                case 'KeyD':
                    this.centerX -= 5;
                    break;
                case 'KeyA':
                    this.centerX += 5;
                    break;
            }
        }
        GameObject.drawAll();
        if (this.mods == '') {
            this.mods = 'wk';
        }
        else {
            this.mods = '';
        }
    };
    Me.prototype.Redraw = function (mx, my) {
        if (mx && my) {
            this.mx = mx;
            this.my = my;
        }
        this.direction = Math.abs(57.2958 * Math.atan2((this.mx - this.centerX), (this.my - this.centerY)) - 180);
        this.redraw();
    };
    Me.prototype.REDRAW = function () {
        this.Redraw();
    };
    return Me;
}(Player));
window.onload = function () {
    content = document.getElementById('content');
    player = new Me(document.getElementById('myCanvas').getContext('2d'), "velo");
    var house = new GameObject(document.getElementById('myCanvas').getContext('2d'), 'house');
    player.centerX = 500;
    player.centerY = 500;
    player.depth = 10;
    house.centerX = 1000;
    house.centerY = 50;
    house.depth = 100;
    house.transparency = 0.5;
    document.fullscreenEnabled = true;
    document.onmousemove = function (ev) {
        player.mx = ev.x;
        player.my = ev.y;
        GameObject.drawAll();
    };
    document.onmousedown = document.onmousemove;
    document.onkeydown = function (event) {
        if (!event.repeat) {
            new Timer(function () { player.move(event.code); }, event.code).start(200);
        }
    };
    document.onkeyup = function (ev) {
        //  console.log(Timer.timers.filter((value: Timer) => { return (value.tag == ev.code) })[0]);
        Timer.timers.filter(function (value) { return (value.tag == ev.code); })[0].destroy();
    };
};
//# sourceMappingURL=app.js.map