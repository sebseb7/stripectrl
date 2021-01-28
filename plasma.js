exports.anim = {tick: function (count,leds,pixelData) {
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
				pixelData(i/2,r,g,b);
			}
		}
	},
	duration:500,
	step:0.2
}

