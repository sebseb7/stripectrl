const ws281x = require('rpi-ws281x-native');

const NUM_LEDS = 150;
var pixelData = new Uint32Array(NUM_LEDS);
ws281x.init(NUM_LEDS,{dmaNum:10,gpioPin:10});

var animations = [];
var curr_anim = 0;
animations.push(require('./plasma2.js').anim);
animations.push(require('./segflash.js').anim);
animations.push(require('./strobe.js').anim);
animations.push(require('./slider.js').anim);
animations.push(require('./plasma.js').anim);

var count = 0;

function setPix(x,c){
	pixelData[x]=c;
}

setInterval(function () {
	count+=animations[curr_anim].step;
	animations[curr_anim].tick(count,NUM_LEDS,setPix);
	ws281x.render(pixelData);
	if(count > animations[curr_anim].duration){
		count=0;
		curr_anim++;
	}
	if(curr_anim == animations.length) {
		curr_anim = 0;
	}
}, 1000 / 30);

