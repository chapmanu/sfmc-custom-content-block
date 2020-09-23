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

export function getHtml({lpHeader='', lpSubheader='', lpBackgroundImage = '', lpForm='', ...rest}) {
	console.log(rest)
	return `
	<div 
		align="center" 
		class="smc-lp__data-container focuspoint"
		data-focus-x=${rest.focusVals ? rest.focusVals['data-focus-x']: ''}
		data-focus-y=${rest.focusVals ? rest.focusVals['data-focus-y']: ''}
		data-image-w=${rest.focusVals ? rest.focusVals['data-image-w']: ''}
		data-image-h=${rest.focusVals ? rest.focusVals['data-image-h']: ''}
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
