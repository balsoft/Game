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
class Player{
    img: HTMLImageElement;
    canvas: CanvasRenderingContext2D;
    direction: number;
    picCount: number = 8;
    name: string;
    mods: string;
    x: number = 0;
    y: number = 0;
    get centerX():number {
        return this.x + this.img.width/2;
    }
    set centerX(cX: number) {
        this.x = cX - this.img.width / 2;
    }
    get centerY():number {
        return this.y + this.img.height / 2;
    }
    set centerY(cy: number) {
        this.y = cy - this.img.height / 2;
    }
    constructor(canvas: CanvasRenderingContext2D, name: string) {
        this.img = new Image;
        this.canvas = canvas;
        this.name = name;
    }
    
    redraw() {
        console.log(this.mods);
        this.img.src = 'players\\' + this.name + '\\img'+ this.mods + (Math.round(this.direction / 360 * this.picCount) * 360 / this.picCount) % 360 + '.png';
        reset(document.getElementById('myCanvas'));
        this.canvas.drawImage(this.img,this.x,this.y);
    }
    
}
class Me extends Player {
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
        }
        if (this.mods == '') {
            this.mods = 'wk';
        } else { this.mods = '';}
        this.redraw();
    }
    Redraw(mx: number, my: number) {
        this.direction = Math.abs(57.2958 * Math.atan2((mx - this.centerX), (my - this.centerY)) - 180);
        this.redraw();
    }
}
window.onload = () => {
    content = document.getElementById('content');
    player = new Me(document.getElementById('myCanvas').getContext('2d'), "velo");
    player.centerX = 500;
    player.centerY = 500;
    document.fullscreenEnabled = true;
    document.onmousemove = (ev: MouseEvent) => {
        player.Redraw(ev.x, ev.y);
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


