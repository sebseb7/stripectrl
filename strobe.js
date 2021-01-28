exports.anim = {tick: function (count,leds,pixelData) {
		var r=0;
		var g=0;
		var b=0;
		
		if(count%9 == 1 || count%9 == 1) {
			r=255;
		}else if(count%9 == 5 || count%9 == 5) {
			b=255;
		}

		for(var x=0;x<leds;x++){
			pixelData(x,r,g,b);
		}
	},
	duration:200,
	step:1
}

