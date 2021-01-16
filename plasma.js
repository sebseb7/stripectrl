const ws281x = require('rpi-ws281x-native');

const NUM_LEDS = 150;
var pixelData = new Uint32Array(NUM_LEDS);
ws281x.init(NUM_LEDS,{dmaNum:10,gpioPin:10});

var count=0;

function tick() {
	count+=0.2;
	for(var j=0;j<1;j++){
		var yc = j/150*Math.cos(count/10);
		var yc2 = (j-75)/150+0.5*Math.cos(count/10);
		for(var i=0;i<300;i+=2){
			var compa = Math.sin(i/15+count/100);
			var compb = Math.sin(10*(i/150*Math.sin(count/20)+yc)+count/70);
			var xc2 = (i-75)/150+0.5*Math.cos(count/12);
			var compc = Math.sin(Math.sqrt(100*(xc2*xc2+yc2*yc2)+1)+count/100);
			var r = (Math.sin((compa+compc)*Math.PI)+1)*128;
			var g = (Math.sin((compa+compb)*Math.PI+2*Math.PI/3)+1)*128;
			var b = (Math.sin((compb+compc)*Math.PI+4*Math.PI/3)+1)*128;
			const ledvar = r | g<<8 | b<<16;
			pixelData[i/2] = ledvar;
		}
	}
}

//G R B

setInterval(function () {
	tick();
	ws281x.render(pixelData);
}, 1000 / 30);

