!function(e){var t={};function s(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,s),i.l=!0,i.exports}s.m=e,s.c=t,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)s.d(n,i,function(t){return e[t]}.bind(null,i));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=2)}([function(e,t,s){var n=function(e,t,s){Array.isArray(e)&&(s=t=e,e=void 0),e&&e.onEditClose&&(this.handlers={onEditClose:e.onEditClose},e.onEditClose=!0),this._whitelistOverride=t,this._sslOverride=s,this._messageId=1,this._messages={0:function(){}},this._readyToPost=!1,this._pendingMessages=[],this._receiveMessage=this._receiveMessage.bind(this),window.addEventListener("message",this._receiveMessage,!1),window.parent.postMessage({method:"handShake",origin:window.location.origin,payload:e},"*")};n.prototype.execute=function(e,t){var s=(t=t||{}).data,n=t.success;this._readyToPost?this._post({method:e,payload:s},n):this._pendingMessages.push({method:e,payload:s,callback:n})},n.prototype.getCentralData=function(e){this.execute("getCentralData",{success:e})},n.prototype.getContent=function(e){this.execute("getContent",{success:e})},n.prototype.getData=function(e){this.execute("getData",{success:e})},n.prototype.getUserData=function(e){this.execute("getUserData",{success:e})},n.prototype.getView=function(e){this.execute("getView",{success:e})},n.prototype.setBlockEditorWidth=function(e,t){this.execute("setBlockEditorWidth",{data:e,success:t})},n.prototype.setCentralData=function(e,t){this.execute("setCentralData",{data:e,success:t})},n.prototype.setContent=function(e,t){this.execute("setContent",{data:e,success:t})},n.prototype.setData=function(e,t){this.execute("setData",{data:e,success:t})},n.prototype.setSuperContent=function(e,t){this.execute("setSuperContent",{data:e,success:t})},n.prototype.triggerAuth=function(e){this.getUserData((function(t){var s=t.stack;0===s.indexOf("qa")&&(s=s.substring(3,5)+"."+s.substring(0,3));var n=document.createElement("IFRAME");n.src="https://mc."+s+".exacttarget.com/cloud/tools/SSO.aspx?appId="+e+"&restToken=1&hub=1",n.style.width="1px",n.style.height="1px",n.style.position="absolute",n.style.top="0",n.style.left="0",n.style.visibility="hidden",n.className="authframe",document.body.appendChild(n)}))},n.prototype.triggerAuth2=function(e){var t=document.createElement("IFRAME"),s="",n="";Array.isArray(e.scope)&&(s="&scope="+e.scope.join("%20")),e.state&&(n="&state="+e.state),t.src=e.authURL+(e.authURL.endsWith("/")?"":"/")+"v2/authorize?response_type=code&client_id="+e.clientId+"&redirect_uri="+encodeURIComponent(e.redirectURL)+s+n,t.style.width="1px",t.style.height="1px",t.style.position="absolute",t.style.top="0",t.style.left="0",t.style.visibility="hidden",t.className="authframe",document.body.appendChild(t)},n.prototype._executePendingMessages=function(){var e=this;this._pendingMessages.forEach((function(t){e.execute(t.method,{data:t.payload,success:t.callback})})),this._pendingMessages=[]},n.prototype._post=function(e,t){this._messages[this._messageId]=t,e.id=this._messageId,this._messageId+=1,window.parent.postMessage(e,this._parentOrigin)},n.prototype._receiveMessage=function(e){var t=(e=e||{}).data||{};if("handShake"===t.method){if(this._validateOrigin(t.origin))return this._parentOrigin=t.origin,this._readyToPost=!0,void this._executePendingMessages()}else if("closeBlock"===t.method&&this._validateOrigin(t.origin))return this.handlers&&this.handlers.onEditClose&&this.handlers.onEditClose(),void this.execute("blockReadyToClose");this._parentOrigin&&this._parentOrigin===e.origin&&((this._messages[t.id||0]||function(){})(t.payload),delete this._messages[t.id])},n.prototype._validateOrigin=function(e){for(var t=this._whitelistOverride||["exacttarget\\.com","marketingcloudapps\\.com","blocktester\\.herokuapp\\.com"],s=0;s<t.length;s++){var n=this._sslOverride?"?":"",i="exacttarget\\.com"===t[s]?"mc\\.":"";if(new RegExp("^https"+n+"://"+i+"([a-zA-Z0-9-]+\\.)*"+t[s]+"(:[0-9]+)?$","i").test(e))return!0}return!1},"object"==typeof window&&(window.sfdc=window.sfdc||{},window.sfdc.BlockSDK=n),e.exports=n},function(e,t){let s=document.createElement("template");s.innerHTML='\n<article class="slds-box slds-box" style="cursor: pointer; height: 100%;">\n\t<span class="name" style="word-break: break-all;"></span>\n\t<div class="slds-card__body slds-card__body_inner">\n\t\t<img />\n\t</div>\n</article>\n';class n extends HTMLElement{connectedCallback(){this.appendChild(s.content.cloneNode(!0)),this.getElementsByClassName("name")[0].innerText=this.getAttribute("name"),this.getElementsByTagName("img")[0].src=this.getAttribute("url"),this.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("change",{detail:{value:this.getAttribute("url")},bubbles:!0}))})}}customElements.define("image-card",n)},function(e,t,s){"use strict";async function n(e,t){console.log("IM THE URL",e);const s=await fetch("/proxy/"+e,{method:"POST",body:JSON.stringify(t)});return await s.json()}s.r(t);const i=function(){let e;return async()=>(e||(e=n("asset/v1/content/assets/query",{query:{property:"assetType.id",simpleOperator:"in",value:[20,22,23,28]}})),e)}(),a=document.createElement("template");a.innerHTML='\n<fieldset class="slds-form-element slds-box slds-m-bottom_x-small">\n  <legend class="slds-form-element__legend slds-form-element__label">Choose a block template</legend>\n  <div class="slds-form-element__control">\n  </div>\n</fieldset>\n';class l extends HTMLElement{async connectedCallback(){this.appendChild(a.content.cloneNode(!0)),this.querySelector(".slds-form-element__control").addEventListener("change",t=>{t.stopPropagation(),e&&this.dispatchEvent(new CustomEvent("change",{detail:{template:e.items.find(e=>t.target.value==e.id)},bubbles:!1}))});const e=null;this.assetId&&(document.getElementById(this.assetId).checked="checked")}getRadioHtml(e){return`\n<span class="slds-radio">\n\t<input type="radio" id="${e.id}" value="${e.id}" name="template" />\n\t<label class="slds-radio__label" for="${e.id}">\n\t\t<span class="slds-radio_faux"></span>\n\t\t<span class="slds-form-element__label">${e.name}</span>\n\t</label>\n</span>`}}customElements.define("templating-block-selector",l);s(1);const o=document.createElement("template");o.innerHTML='\n<button class="slds-button slds-button_neutral">Select</button>\n<div class="slds-grid slds-gutters slds-wrap slds-grid_vertical-stretch" style="display: none;"></div>\n';class d extends HTMLElement{constructor(){super(),this._toggleSelector=this._toggleSelector.bind(this)}async connectedCallback(){this.appendChild(o.content.cloneNode(!0)),this.grid=this.getElementsByClassName("slds-grid")[0],this.getElementsByTagName("button")[0].addEventListener("click",this._toggleSelector),this.addEventListener("change",e=>{this.value=e.detail.value,this._toggleSelector()});const e=await i();this.grid.innerHTML=e.items.map(this._getImageHTML).join("")}_getImageHTML(e){return`\n\t\t\t<div class="slds-col slds-size_1-of-2 slds-p-top_x-small">\n\t\t\t\t<image-card id="${e.id}" name="${e.name}" url="${e.fileProperties.publishedURL}"></image-card>\n\t\t\t</div>\n\t\t`}_toggleSelector(){this.grid.style.display="none"===this.grid.style.display?"flex":"none"}}customElements.define("image-selector",d);const c=document.createElement("template");c.innerHTML='\n<div class="slds-box">\n</div>\n';class r extends HTMLElement{set fields(e){e&&(this.firstElementChild.innerHTML=e.map(this.getFieldHtml).join(""),this._fields=e)}async connectedCallback(){this.appendChild(c.content.cloneNode(!0)),this.firstElementChild.addEventListener("change",e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("change",{detail:{fields:this._fields.map((e,t)=>({...e,value:this.querySelector("#template-field-"+t).value}))},bubbles:!1}))})}getFieldHtml(e,t){return`\n<div class="slds-form-element">\n\t<label class="slds-form-element__label" for="template-field-${t}">${e.title}</label>\n\t<div class="slds-form-element__control">\n\t\t${"image"===e.type?"<image-selector ":'<input type="text" class="slds-input" '} id="template-field-${t}" value="${e.value||""}" />\n\t</div>\n</div>\n`}}customElements.define("templating-block-fieldset",r);class p extends HTMLElement{set fields(e){this.fieldSet.fields=e}connectedCallback(){const e=e=>t=>(console.log(t),this.dispatchEvent(new CustomEvent("change",{detail:{...t.detail,type:e},bubbles:!1})));if(!this.locked){const t=document.createElement("templating-block-selector");t.assetId=this.assetId,this.appendChild(t),t.addEventListener("change",e("template"))}const t=document.createElement("image-selector");this.appendChild(t),this.fieldSet=document.createElement("templating-block-fieldset"),this.appendChild(this.fieldSet),this.fieldSet.addEventListener("change",e("fields"))}}customElements.define("templating-block-app",p);var u=s(0);const h=/\[\[(\w+)\|([^|]+)\|([^\]]*)\]\]/g;function m(e,t=[],s){let n=0;return e.content.replace(h,(e,i,a,l)=>{let o="";return t[n]&&t[n].value?o=t[n].value:s&&(o=l),n++,o})}const g=new(s.n(u).a)(null,null,!0);function f(e){const t=document.createElement("templating-block-app");t.locked=e.locked,e.template&&(t.assetId=e.template.id),t.addEventListener("change",e=>{g.getData(s=>{const n=s;switch(e.detail.type){case"template":n.template=e.detail.template,n.fields=function(e){const t=[];let s;for(;s=h.exec(e.content);)t.push({type:s[1],title:s[2]});return t}(n.template),t.fields=n.fields;break;case"fields":n.fields=e.detail.fields}y(n)})}),document.getElementById("workspace").appendChild(t),t.fields=e.fields}function y(e){g.setData(e),g.setContent(m(e.template,e.fields,!1)),g.setSuperContent(m(e.template,e.fields,!0))}g.getData(async e=>{if(window.app.assetId){y(await getOverrideData(e,window.app.assetId))}f(e)}),g.triggerAuth(window.app.appID)}]);
//# sourceMappingURL=main.js.map