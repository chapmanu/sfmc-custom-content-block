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

export function getHtml({lpHeader='', lpSubheader='', lpBackgroundImage = '', lpForm='', dataFocusX=0, dataFocusY=0, dataFocusW=0, dataFocusH=0}) {
	
	return `
	<div 
		align="center" 
		class="smc-lp__data-container focuspoint"
		data-focus-x=${dataFocusX}
		data-focus-y=${dataFocusY}
		data-image-w=${dataFocusW}
		data-image-h=${dataFocusH}
	>
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
		<img class="focused-image" src="${lpBackgroundImage}" style="width: auto !important;"/>
	</div>
`;
}
