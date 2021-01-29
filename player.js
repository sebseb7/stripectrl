const ws281x = require('rpi-ws281x-native');
const SerialPort = require('serialport');
const midi = require('midi');

const input = new midi.Input();

for(var i = 0; i < input.getPortCount();i++){
	if(input.getPortName(i) == 'nanoKONTROL2:nanoKONTROL2 MIDI 1 20:0'){
		input.openPort(i);
	}
}

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
		dmxData[1] = r;
		dmxData[2] = g;
		dmxData[3] = b
	}
	if(x == 50){
		dmxData[4] = r;
		dmxData[5] = g;
		dmxData[6] = b;
	}
	if(x == 100){
		dmxData[7] = r;
		dmxData[8] = g;
		dmxData[9] = b;
		dmxData[10] = 0;
	}
	if(x == 140){
		dmxData[11] = r;
		dmxData[12] = g;
		dmxData[13] = b;
		dmxData[14] = 0;
	}
}

input.on('message', (deltaTime, message) => {

	if((message[0]==176)&&(message[1]==0))
		dmxData[0]=message[2]*2
	if((message[0]==176)&&(message[1]==1))
		dmxData[1]=message[2]*2
	if((message[0]==176)&&(message[1]==2))
		dmxData[2]=message[2]*2
	if((message[0]==176)&&(message[1]==3))
		dmxData[3]=message[2]*2
	if((message[0]==176)&&(message[1]==4))
		dmxData[4]=message[2]*2
	if((message[0]==176)&&(message[1]==5))
		dmxData[5]=message[2]*2
	if((message[0]==176)&&(message[1]==6))
		dmxData[6]=message[2]*2
	if((message[0]==176)&&(message[1]==7))
		dmxData[7]=message[2]*2
	if((message[0]==176)&&(message[1]==16))
		dmxData[8]=message[2]*2
	if((message[0]==176)&&(message[1]==17))
		dmxData[9]=message[2]*2
	if((message[0]==176)&&(message[1]==18))
		dmxData[10]=message[2]*2
	if((message[0]==176)&&(message[1]==19))
		dmxData[11]=message[2]*2
	if((message[0]==176)&&(message[1]==20))
		dmxData[12]=message[2]*2
	if((message[0]==176)&&(message[1]==21))
		dmxData[13]=message[2]*2
	if((message[0]==176)&&(message[1]==22))
		dmxData[14]=message[2]*2
	if((message[0]==176)&&(message[1]==23))
		dmxData[15]=message[2]*2

//	console.log(message);
});

setInterval(function () {
	count+=animations[curr_anim].step;
	animations[curr_anim].tick(count,NUM_LEDS,setPix);
	//ws281x.render(pixelData);
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
								//console.log(Buffer.from(dmxData));
							});
						});
					});
								
				},1); // mark after break duration
			});
		}, 1); // break duration
	});
}, 1000 / 30);

