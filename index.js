const canvas = document.getElementById("imageCanvas");
const context = canvas.getContext("2d");
const cameraView = document.getElementById("camera-view");
const button = document.getElementById("button");
const colorCheck = document.getElementById("color-check");
const output = document.getElementById("text");

const spectrum = " .:-=+*#%@";
const constraints = { video: { facingMode: "environment" }, audio: false };
let color = false;

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
	context.drawImage(cameraView, 0, 0, canvas.width, canvas.height);
	convertToASCII();
	requestAnimationFrame(update);
};

const convertToASCII = () => {
	const lineSize = canvas.width * 4;
	const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
	const data = pixels.data;
	let text = "";

	for (let i = 0; i < data.length; i += 4) {
		const r = Math.floor((data[i] + data[i + lineSize]) / 2);
		const g = Math.floor((data[i + 1] + data[i + 1 + lineSize]) / 2);
		const b = Math.floor((data[i + 2] + data[i + 2 + lineSize]) / 2);

		const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		const index = 9 - Math.floor(luminance / 25.5);
		let character = spectrum.substring(index, index + 1);

		if (character === " ") {
			character = "&nbsp;";
		}
		if (color) {
			text += `<span style="color: rgb(${r}, ${g}, ${b})">${character}</span>`;
		} else {
			text += character;
		}
		if ((i + 4) % lineSize === 0) {
			text += "<br />";
			i += lineSize;
		}
	}
	output.innerHTML = text;
};

const coverWithGarbage = () => {
	let text = "";
	for (let i = 0; i < canvas.width / 2; i++) {
		for (let j = 0; j < canvas.width; j++) {
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

colorCheck.onclick = (e) => {
	color = colorCheck.checked;
	console.log(color);
};

window.onload = coverWithGarbage();
