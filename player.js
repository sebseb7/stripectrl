const ws281x = require('rpi-ws281x-native');
const SerialPort = require('serialport')

var options = {
	'baudRate': 250000,
	'dataBits': 8,
	'stopBits': 2,
	'parity': 'none'
};

const port = new SerialPort('/dev/serial/by-id/usb-FTDI_FT232R_USB_UART_AB0KP0FL-if00-port0',options);

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

var channels = 16;
var dmxData = [];
for(var i = 0; i < channels; i++) {
	dmxData[i] = 0; 
}

function setPix(x,r,g,b){
	const ledvar = b | r<<8 | g<<16;

	pixelData[x]=ledvar;

	if(x == 0){
		dmxData[0] = r;
		dmxData[1] = g;
		dmxData[2] = b
	}
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
	port.set({brk:true}, function() {
		setTimeout(function() {
			port.set({brk:false}, function() {
				setTimeout(function() {
					port.write(Buffer.from([0]), function(err) {
						if (err) {
							return console.log('Error on write 0x00: ', err.message);
						}
						port.drain(function(err) {
							port.write(Buffer.from(dmxData), function(err) {
								if (err) {
									return console.log('Error on write DMX data ', err.message);
								}
								port.drain();
								console.log(Buffer.from(dmxData));
							});
						});
					});
								
				},1); // mark after break duration
			});
		}, 1); // break duration
	});
}, 1000 / 30);

