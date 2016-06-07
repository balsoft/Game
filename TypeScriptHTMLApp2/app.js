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
var Player = (function () {
    function Player(canvas, name) {
        this.picCount = 8;
        this.x = 0;
        this.y = 0;
        this.img = new Image;
        this.canvas = canvas;
        this.name = name;
    }
    Object.defineProperty(Player.prototype, "centerX", {
        get: function () {
            return this.x + this.img.width / 2;
        },
        set: function (cX) {
            this.x = cX - this.img.width / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "centerY", {
        get: function () {
            return this.y + this.img.height / 2;
        },
        set: function (cy) {
            this.y = cy - this.img.height / 2;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.redraw = function () {
        console.log(this.mods);
        this.img.src = 'players\\' + this.name + '\\img' + this.mods + (Math.round(this.direction / 360 * this.picCount) * 360 / this.picCount) % 360 + '.png';
        reset(document.getElementById('myCanvas'));
        this.canvas.drawImage(this.img, this.x, this.y);
    };
    return Player;
}());
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
        }
        if (this.mods == '') {
            this.mods = 'wk';
        }
        else {
            this.mods = '';
        }
        this.redraw();
    };
    Me.prototype.Redraw = function (mx, my) {
        this.direction = Math.abs(57.2958 * Math.atan2((mx - this.centerX), (my - this.centerY)) - 180);
        this.redraw();
    };
    return Me;
}(Player));
window.onload = function () {
    content = document.getElementById('content');
    player = new Me(document.getElementById('myCanvas').getContext('2d'), "velo");
    player.centerX = 500;
    player.centerY = 500;
    document.fullscreenEnabled = true;
    document.onmousemove = function (ev) {
        player.Redraw(ev.x, ev.y);
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