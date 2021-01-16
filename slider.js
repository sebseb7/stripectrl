const ws281x = require('rpi-ws281x-native');

const NUM_LEDS = 150;
var pixelData = new Uint32Array(NUM_LEDS);
ws281x.init(NUM_LEDS,{dmaNum:10,gpioPin:10});

function HSVtoRGB(h, s, v) {
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	}
	i = Math.floor(h * 6);
	f = h * 6 - i;
	p = v * (1 - s);
	q = v * (1 - f * s);
	t = v * (1 - (1 - f) * s);
	switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	}
	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
}
var count=0;
var count2=0;
var h = Math.random();
var pos = Math.floor((Math.sin(count)+1) * Math.floor(NUM_LEDS/2));
function tick(){
	var v =1;
	count+=0.06;
	count2++;
	h = (count2%256)/256;
	pos = Math.floor((Math.sin(count)+1) * Math.floor(NUM_LEDS/2));
	console.log(pos);
	const rgb = HSVtoRGB(h,1,v);
	const ledvar = rgb.r | rgb.g<<8 |rgb.b<<16;
	for(var x=0;x<NUM_LEDS;x++){
		if(Math.abs(x-pos)<20) {
			pixelData[x] = ledvar
		}else{
			pixelData[x] = 0
		};
	}
}


//G R B

setInterval(function () {
	tick();
	ws281x.render(pixelData);
}, 1000 / 30);

