const canvas = document.getElementById("imageCanvas");
const context = canvas.getContext("2d");
const cameraView = document.getElementById("camera-view");
const button = document.getElementById("button");
const output = document.getElementById("text");

const spectrum = " .:-=+*#%@";
const constraints = { video: { facingMode: "environment" }, audio: false };

const cameraStart = () => {
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function (stream) {
			track = stream.getTracks()[0];
			cameraView.srcObject = stream;
			button.style.display = "none";
			output.style.color = "black";
			requestAnimationFrame(update);
		})
		.catch(function (error) {
			console.log(error);
			button.innerHTML = "Camera not found. Try again?";
		});
};

const update = () => {
	context.drawImage(cameraView, 0, 0, 128, 128);
	convertToASCII();
	requestAnimationFrame(update);
};

const convertToASCII = () => {
	const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
	const data = pixels.data;
	let text = "";

	for (let i = 0; i < data.length; i += 4) {
		const r = data[i];
		const g = data[i + 1];
		const b = data[i + 2];

		const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		data[i] = data[i + 1] = data[i + 2] = luminance;

		const index = 9 - Math.floor(luminance / 25.5);
		let character = spectrum.substring(index, index + 1);
		if (character === " ") {
			character = "&nbsp;";
		}
		text += character;
		if ((i + 4) % (canvas.width * 4) === 0) {
			text += "<br />";
			i += canvas.width * 4;
		}
	}
	output.innerHTML = text;
	context.putImageData(pixels, 0, 0);
};

const coverWithGarbage = () => {
	let text = "";
	for (let i = 0; i < 64; i++) {
		for (let j = 0; j < 128; j++) {
			let character = spectrum[Math.floor(Math.random() * 9)];
			if (character === " ") {
				character = "&nbsp;";
			}
			text += character;
		}
		text += "<br />";
	}
	output.innerHTML = text;
};

window.onload = coverWithGarbage();
