import imageCompression from "browser-image-compression";

export function clearInputFile(f) {
	if (f.value) {
		try {
			f.value = ""; //for IE11, latest Chrome/Firefox/Opera...
		} catch (err) {}
		if (f.value) {
			//for IE5 ~ IE10
			var form = document.createElement("form"),
				ref = f.nextSibling;
			form.appendChild(f);
			form.reset();
			ref.parentNode.insertBefore(f, ref);
		}
	}
}
/**
 * Crop image
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 */
export function getCroppedImg(image, crop, fileName) {
	const canvas = document.createElement("canvas");
	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;
	canvas.width = crop.width;
	canvas.height = crop.height;
	const ctx = canvas.getContext("2d");

	ctx.drawImage(
		image,
		crop.x * scaleX,
		crop.y * scaleY,
		crop.width * scaleX,
		crop.height * scaleY,
		0,
		0,
		crop.width,
		crop.height
	);

	// As Base64 string
	// const base64Image = canvas.toDataURL('image/jpeg');

	// As a blob
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				blob.name = fileName;
				resolve(blob);
			},
			"image/jpeg",
			1
		);
	});
}
/**
 * Compress image
 */
export async function compressImg(imageFile) {
	// if (event) event.preventDefault();
	// const imageFile = event.target.files[0];
	console.log(`originalFile size ${imageFile.size / 1024} KB`);

	const options = {
		maxSizeMB: 0.025,
		maxIteration: 100,
		maxWidthOrHeight: 1920,
		useWebWorker: true,
	};
	// 50x smaller images in production
	if (process.env.NODE_ENV == "development") options.maxSizeMB = 0.0005;
	try {
		const compressedFile = await imageCompression(imageFile, options);
		console.log(
			`compressedFile size ${compressedFile.size / 1024} KB`
		);

		return compressedFile;
	} catch (error) {
		console.log(error);
	}
}
/**
 * Convert image to BASE64
 */
export const convert = async (compressedFile) => {
	return new Promise((resolve, reject) => {
		var reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result);
		};

		reader.onerror = reject;

		reader.readAsDataURL(compressedFile);
	});
};