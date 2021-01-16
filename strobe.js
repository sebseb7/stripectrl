const ws281x = require('rpi-ws281x-native');

const NUM_LEDS = 150;
var pixelData = new Uint32Array(NUM_LEDS);
ws281x.init(NUM_LEDS,{dmaNum:10,gpioPin:10});

var count=0;
function tick(){
	count++;
	var r=0;
	var g=0;
	var b=0;
	
	if(count == 1 || count == 1) {
		r=255;
	}else if(count == 5 || count == 5) {
		b=255;
	}else if(count == 9) {
		count = 0;
	}

	const ledvar = b | r<<8 |g<<16;
	for(var x=0;x<NUM_LEDS;x++){
		pixelData[x] = ledvar;
	}
}


//G R B

setInterval(function () {
	tick();
	ws281x.render(pixelData);
}, 1000 / 30);

