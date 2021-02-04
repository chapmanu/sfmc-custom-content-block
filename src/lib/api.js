// MAKES THE POST REQUEST FOR DATA TO THE BACKEND SERVER THE BACKEND IS LISTENING 
// FOR ANY REQUEST WITH THE '/proxy/' URL TO THEN REACH OUT TO SFMC WITH THE APPORPRIATE REQUEST
async function post (url, data) {
	const response = await fetch('/proxy/' + url, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return await response.json();
}

export async function getBlock(id) {
	const response = await fetch(`/proxy/asset/v1/content/assets/${id}`);
	return await response.json();
}

// USED FOR RETRIEVING TEMPLATES FOR DISPALY IN THE CUSTOM CONTENT BLOCK VIEW
export async function getCustomTemplates() {
	return await post('asset/v1/content/assets/query', {
		query: {
			property: 'tags',
			simpleOperator: 'where',
			value: 'customblock-template'
		}
	});
}

// RETRIEVES THE IMAGES  IF THEY HAVE BEEN RETRIEVED ALREADY THEN RETRIEVES CACHED IMAGES?
function getImagesCached() {
	let images;
	return async () => {
		if (!images) {
			images = await post('asset/v1/content/assets/query', {
				query: {
					property: 'fileProperties.extension',
					simpleOperator: 'in',
					value: ["tif", "tiff", "bmp","jpg", "jpeg", "gif", "png"],
				},
				page: {
					page: 1,
					pageSize: 2000
				}
			});
		}

		return images;
	}
}

export const getImages = getImagesCached();
