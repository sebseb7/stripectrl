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

var count2=0;

exports.anim = {tick: function (count,leds,pixelData) {
	var v =1;
	count2++;
	var h = (count2%256)/256;
	var pos = Math.floor((Math.sin(count)+1) * Math.floor(leds/2));
	const rgb = HSVtoRGB(h,1,v);
	for(var x=0;x<leds;x++){
		if(Math.abs(x-pos)<20) {
			pixelData(x,rgb.r,rgb.g,rgb.b);
		}else{
			pixelData(x,0,0,0);
		};
	}
	},
	duration:100,
	step:0.06
}

