function preload(){
	bold = loadFont('./Coconat-BoldExt.otf')
	regular = loadFont('./Coconat-Regular.otf')
}

let noiseY;
let noiseSpeed = 0.01;
let noiseHeight = 20;
a = 0


function setup(){
	createCanvas(windowWidth, windowHeight)
	pixelDensity(1)
	rectMode(CENTER)
	colorMode(HSB)
	moonX = random(0, width)
	moonY = random(0, height/4)
	moonSize = random(width/20, width/10)
	moonPhase = random(0, width/120)
	
	move = 0
	multip = 8
	monoColored = random()
	noiseDet = floor(random(2, 20))
	noiseSize = random([1, 2, 3, 4, 5, 6])
	shiftAmt = random([100, 200, 250, 300, 350])
	osc = random(['fmtriangle', 'fmsine', 'square4'])
	bpm = floor(random(40, 80))

	noiseDetail(noiseDet)

	paletteInfo = getColors()
	getPalettes = paletteInfo['col']
	paletteName = paletteInfo['name']
	colorz = color(getPalettes)

	µziq()
	countdown = 0
	noiseY = height * 3 / 4;
	
}

function draw(){
	a = (a + PI*0.01);
	background(7, 0.1)

	push()

	noStroke();
	fill(255);
	for (let i = 0; i < 1; i++) {
	  let xrandom = random(width);
	  let yrandom = random(height / 2);
	  ellipse(xrandom, yrandom, 3, 3);
	}
	pop()
  
	push()
	for (let j = 0; j < 10; j++) {
	  let offsetY = j * 100;
	  noFill();
	  stroke(hue(colorz), saturation(colorz), brightness(colorz), 0.2)
	  strokeWeight(height / 2);
	  beginShape();
	  curveVertex(0, height / 2);
	  for (let i = 0; i < width; i += 50) {
		let y = noise(frameCount * noiseSpeed + i + j) * noiseHeight + noiseY + offsetY;
		curveVertex(i, y);
	  }
	  curveVertex(width, height / 2);
	  endShape(LINES);
	}

	pop()

	moon()

	timer()

	move++
	countdown = countDown()

}

function timer(){
	push()
	fill(hue(colorz), saturation(colorz), brightness(colorz)-50)
	textFont(bold)
	textSize(width / 30)
  	textAlign(CENTER, CENTER)
	text(countdown, width/2, height*0.8)
	pop()

}

function moon(){

	noStroke()
	blendMode(LIGHTEST);
	fill(hue(colorz), saturation(colorz), brightness(colorz)+10)
	ellipse(moonX, moonY, moonSize);
	blendMode(DARKEST);
	fill(6, 0.98);
	noStroke()
	ellipse(moonX-15-moonPhase, moonY-10-moonPhase, moonSize);
	blendMode(BLEND);
}

function countDown() {
	const countDownDate = new Date("Nov 7, 2022 15:30:30").getTime();
	const now = new Date().getTime();
	const distance = countDownDate - now;
	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
	return days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
}

function µziq(){

	const gainNode = new Tone.Gain(-0.7).toDestination()

	const reverb = new Tone.Reverb({
		decay: 30,
		preDelay: 0.01,
		wet: 0.8
	}).toDestination()

	const delay = new Tone.FeedbackDelay({
		feedback: 0.5,
		delayTime: "2n",
		wet: 0.5
	})
	
	const vibrato = new Tone.Vibrato({
		frequency: 0.5,
		depth: 0.9,
		wet: 1
	})
		

	const synth = new Tone.MonoSynth({
		
		oscillator: {
			type: osc,
		},
		envelope: {
			attack: 0.5,
			decay: 0.1,
			sustain: 0.3,
			release: 0.2
		},
		filterEnvelope: {
			attack: 0.05,
			decay: 0.01,
			sustain: 0.5,
			release: 2,
			baseFrequency: 400,
			octaves: 3,
			exponent: 2
		}
	}).chain(delay, vibrato, reverb, gainNode)

	const synth2 = new Tone.PolySynth({
		
		oscillator: {
			type: 'square',
		},
		envelope: {
			attack: 0.5,
			decay: 0.1,
			sustain: 0.3,
			release: 0.2
		},
		filterEnvelope: {
			attack: 0.05,
			decay: 0.01,
			sustain: 0.5,
			release: 2,
			baseFrequency: 1000,
			octaves: 3,
			exponent: 2
		}

	}).chain(delay, vibrato, reverb, gainNode)
	synth2.volume.value = -10

	const notes = ["C2", null, "Ab2", null, "Eb3", "Bb3", null, "G3", 'Bb3', 'C4', 'Eb4']
	
	const pattern = new Tone.Pattern((time, note) => {
		synth.triggerAttackRelease(note, '4m', time)
		synth2.triggerAttackRelease(note, '10m', time)	
	}, notes, "randomWalk")

	pattern.start()

	Tone.Transport.start()
	Tone.Transport.bpm.value = bpm
}

function mousePressed() {
	Tone.start()
}

function touchStarted() {
	Tone.start()
}