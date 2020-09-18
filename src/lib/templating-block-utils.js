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
	return `
	<div align="center" class="smc-lp__data-container" style="min-height: 300px; background-color: #a50034;">
		<div class="smc-lp__text-conatiner">
			<h1 class="smc-lp__title">
				${lpHeader}
			</h1>
			<p class="smc-lp__description">
				${lpSubheader}
			</p>
		</div>
		<div class="smc-lp__form-container">
			${lpForm}
		</div>
		<img src="${lpBackgroundImage}"/>
	</div>
`;
}
