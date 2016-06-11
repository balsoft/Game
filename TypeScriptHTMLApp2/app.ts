var content: HTMLElement;
var player: Me;
class Timer {
    handler;
    tag;
    id: number;
    static timers:Timer[] = new Array<Timer>();

    constructor(handler: any, tag: any) {
        this.handler = handler;
        this.tag = tag;
    }
    start(interval: number) {
        this.id = setInterval(this.handler, interval);
        Timer.timers.push(this);
       // console.log(this.tag+' is created');
    }
    stop() {
        clearInterval(this.id);
    }
    destroy() {
        this.stop();
        Timer.timers.splice(Timer.timers.indexOf(this),1);
        //console.log(this.tag+' is destroyed');
        delete this;
    }
}
function reset(canvas: HTMLCanvasElement)
{
    canvas.width = canvas.width;
}
class GameObject {
    img: HTMLImageElement;
    canvas: CanvasRenderingContext2D;
    name: string;
    x: number;
    y: number;
    depth: number;
    transparency: number=1;
    static objs: GameObject[] = new Array<GameObject>();
    get centerX(): number {
        return this.x + this.img.width / 2;
    }
    set centerX(cX: number) {
        this.x = cX - this.img.width / 2;
    }
    get centerY(): number {
        return this.y + this.img.height / 2;
    }
    set centerY(cy: number) {
        this.y = cy - this.img.height / 2;
    }
    get groundFY(): number {
        return this.y + this.img.height;
    }
    set groundFY(gY) {
        this.y = gY - this.img.height;
    }
    get groundBY(): number {
        return this.y + this.img.height - this.depth;
    }
    set groundBY(gY) {
        this.y = gY - this.img.height + this.depth;
    }
    get rightX(): number {
        return this.x + this.img.width;
    }
    set rightX(lX) {
        this.x = lX - this.img.width;
    }
    constructor(canvas: CanvasRenderingContext2D, name: string) {
        this.name = name;
        this.img = new Image;
        this.img.src = 'players\\' + name + '\\img.png';
        this.canvas = canvas;
        GameObject.objs.push(this);
    }
    draw(src?: string) {
        if (src) {
            this.img.src = src;
        }
        this.canvas.globalAlpha = this.transparency;
        this.canvas.drawImage(this.img, this.x, this.y);
    };
    static drawAll() {
        GameObject.objs.sort((a: GameObject, b: GameObject) => { if (a.groundFY < b.groundFY) return 0; else return 1; });
        reset(document.getElementById('myCanvas'));
        GameObject.objs.forEach((obj: GameObject) => { obj.REDRAW(); });
    }
    REDRAW() {
        this.draw();
    }
    checkForCollision() {
        return GameObject.objs.filter((obj: GameObject) => { if(this!=obj)return ((this.groundFY > obj.groundBY) && (this.groundBY < obj.groundFY)) && ((this.rightX > obj.x) && (this.x < obj.rightX)) }, this)[0];
    }
}
class Player extends GameObject{
    direction: number;
    picCount: number = 8;
    mods: string = '';
    constructor(canvas: CanvasRenderingContext2D, name: string) {
        super(canvas, name);
    }
    
    redraw(direction?: number) {
        if (direction) {
            this.direction = direction;
        }
        this.img.src = 'players\\' + this.name + '\\img' + this.mods + (Math.round(this.direction / 360 * this.picCount) * 360 / this.picCount) % 360 + '.png';
        this.draw(this.img.src);
    }
    REDRAW() {
        this.redraw();
    }
}
class Me extends Player {
    mx: number;
    my: number;
    constructor(canvas: CanvasRenderingContext2D, name: string){super(canvas,name);}
    move(ch: string) {
        switch (ch) {
            case 'KeyW': this.centerY-=5;
                break;
            case 'KeyS': this.centerY+=5;
                break;
            case 'KeyD': this.centerX+=5;
                break;
            case 'KeyA': this.centerX-=5;
                break;
            default: this.mods = 'wk';
                break;
        };
        if (this.checkForCollision()) {
            switch (ch) {
                case 'KeyW': this.centerY += 5;
                    break;
                case 'KeyS': this.centerY -= 5;
                    break;
                case 'KeyD': this.centerX -= 5;
                    break;
                case 'KeyA': this.centerX += 5;
                    break;
            }
        }
        GameObject.drawAll();
        if (this.mods == '') {
            this.mods = 'wk';
        } else { this.mods = ''; }
    }
    Redraw(mx?: number, my?: number) {
        if (mx && my) {
            this.mx = mx;
            this.my = my;
        }
        this.direction = Math.abs(57.2958 * Math.atan2((this.mx - this.centerX), (this.my - this.centerY)) - 180);
        this.redraw();
    }
    REDRAW() {
        this.Redraw();
    }
}
window.onload = () => {
    content = document.getElementById('content');
    player = new Me(document.getElementById('myCanvas').getContext('2d'), "velo");
    var house = new GameObject(document.getElementById('myCanvas').getContext('2d'),'house');
    player.centerX = 500;
    player.centerY = 500;
    player.depth = 10;
    house.centerX = 1000;
    house.centerY = 50;
    house.depth = 100;
    house.transparency =0.5;
    document.fullscreenEnabled = true;
    document.onmousemove = (ev: MouseEvent) => {
        player.mx = ev.x;
        player.my = ev.y;
        GameObject.drawAll();
    }
    document.onmousedown = document.onmousemove;
    document.onkeydown = (event: KeyboardEvent) => {
        if (!event.repeat) {
            new Timer(() => { player.move(event.code) }, event.code).start(200);
        }
    }
    document.onkeyup = (ev: KeyboardEvent) => {
      //  console.log(Timer.timers.filter((value: Timer) => { return (value.tag == ev.code) })[0]);
        Timer.timers.filter((value: Timer) => { return (value.tag == ev.code) })[0].destroy();
    }
};


