﻿var content: HTMLElement;
var timers: Timer[] = new Array<Timer>;
var player: Me;
class Timer {
    handler;
    tag;
    id:number;
    constructor(handler: any, tag: any) {
        this.handler = handler;
        this.tag = tag;
    }
    start(interval: number) {
        this.id=setInterval(this.handler,interval);
    }
    stop() {
        clearInterval(this.id);
    }
    destroy() {
        this.stop();
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
    picCount: number = 4;
    name: string;
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

        this.img.src = 'players\\' + this.name + '\\img' + (Math.round(this.direction / 360 * this.picCount) * 360 / this.picCount) % 360 + '.png';
        reset(document.getElementById('myCanvas'));
        this.canvas.drawImage(this.img,this.x,this.y);
    }
    
}
class Me extends Player {
    constructor(canvas: CanvasRenderingContext2D, name: string){super(canvas,name);}
    move(ch: string) {
        switch (ch) {
            case 'KeyW': this.centerY--;
                break;
            case 'KeyS': this.centerY++;
                break;
            case 'KeyD': this.centerX++;
                break;
            case 'KeyA': this.centerX--;
                break;
        }
        this.redraw();
    }
    Redraw(mx: number, my: number) {
        this.direction = Math.abs(57.2958 * Math.atan2((mx - this.centerX), (my - this.centerY)) - 180);
        this.redraw();
    }
}
window.onload = () => {
    content = document.getElementById('content');
    player = new Me(document.getElementById('myCanvas').getContext('2d'), "bandit");
    player.centerX = 500;
    player.centerY = 500;
    document.onmousemove = (ev: MouseEvent) => {
        player.Redraw(ev.x, ev.y);
    }
    document.onkeydown = (event: KeyboardEvent) => {
        if (!event.repeat) {
            timers.unshift(new Timer(() => { player.move(event.code) }, event.code));
            timers[0].start(2);
        }
    }
    document.onkeyup = (ev: KeyboardEvent) => {
        console.log(timers.filter((value: Timer) => { return (value.tag == ev.code) })[0]);
        timers.filter((value: Timer) => { return (value.tag == ev.code) })[0].destroy();
    }
};


