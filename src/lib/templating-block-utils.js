import $ from "jquery";

const placeholderRegex = /\[\[(\w+)\|([^|]+)\|([^\]]*)\]\]/g;

export function parseTemplate (template) {
	const fields = [];
	let match;

	while (match = placeholderRegex.exec(template.content)) {
		fields.push({
			type: match[1],
			title: match[2]
		});
	}

	return fields;
}

export function getHtml({lpHeader='', lpSubheader='', lpBackgroundImage = '', lpForm=''}) {
	debugger
	return `
	<div>
		<h1>${lpHeader}</h1><h3>${lpSubheader}</h3><img src="${lpBackgroundImage}"/>
	</div>
	<div>
		${lpForm}
	</div>
	`;

}
