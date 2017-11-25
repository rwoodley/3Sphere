function params() {
    this.formula = "z = 1";
    this.spin = true;
    this.spinSpeed = Math.PI / 256;
    this.displayOutline = false;
    this.X = 0;
    this.Y = 0;
    this.Z = 0;
    this.P = 0.5;
    this.PNGUKey = -1;
    this.system = "cartesian";
    this.color = "#ff0000"; // color (change "#" to "0x")
    this.colorS = "#ffff00"; // color (change "#" to "0x")
    this.shininess = 30;
    this.opacity = 1;
    this.material = "Phong";
    this.help = function () {
        var win = window.open('Help.html', '_blank');
        win.focus();
    };
    this.showExamples = function () {
        var win = window.open('examples/index.html', '_blank');
        win.focus();
    };
    this.navigateToComplex = function () {
        window.location.href = 'ComplexApp.aspx';
    };
}