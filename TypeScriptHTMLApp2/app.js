var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var content;
var timers = new Array();
var player;
var Timer = (function () {
    function Timer(handler, tag) {
        this.handler = handler;
        this.tag = tag;
    }
    Timer.prototype.start = function (interval) {
        this.id = setInterval(this.handler, interval);
    };
    Timer.prototype.stop = function () {
        clearInterval(this.id);
    };
    Timer.prototype.destroy = function () {
        this.stop();
        delete this;
    };
    return Timer;
}());
function reset(canvas) {
    canvas.width = canvas.width;
}
var Player = (function () {
    function Player(canvas, name) {
        this.picCount = 4;
        this.x = 0;
        this.y = 0;
        this.img = new Image;
        this.canvas = canvas;
        this.name = name;
        this.redraw();
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
        this.img.src = '\\players\\' + this.name + '\\img' + (Math.round(this.direction / 360 * this.picCount) * 360 / this.picCount) % 360 + '.png';
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
                this.centerY--;
                break;
            case 'KeyS':
                this.centerY++;
                break;
            case 'KeyD':
                this.centerX++;
                break;
            case 'KeyA':
                this.centerX--;
                break;
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
    player = new Me(document.getElementById('myCanvas').getContext('2d'), "bandit");
    player.centerX = 500;
    player.centerY = 500;
    document.onmousemove = function (ev) {
        player.Redraw(ev.x, ev.y);
    };
    document.onkeydown = function (event) {
        if (!event.repeat) {
            timers.unshift(new Timer(function () { player.move(event.code); }, event.code));
            timers[0].start(2);
        }
    };
    document.onkeyup = function (ev) {
        console.log(timers.filter(function (value) { return (value.tag == ev.code); })[0]);
        timers.filter(function (value) { return (value.tag == ev.code); })[0].destroy();
    };
};
//# sourceMappingURL=app.js.map