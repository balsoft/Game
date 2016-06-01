var Greeter = (function () {
    function Greeter(element) {
        this.element = element;
        this.canvas = document.createElement('canvas');
        this.canvas.height = 300;
        this.canvas.width = 500;
        this.element.appendChild(this.canvas);
        this.canvas.getContext('2d').fill();
    }
    Greeter.prototype.start = function () {
    };
    Greeter.prototype.stop = function () {
    };
    return Greeter;
}());
window.onload = function () {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    greeter.start();
};
//# sourceMappingURL=app.js.map