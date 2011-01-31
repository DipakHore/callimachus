// input-title.js

(function($){

if (window.addEventListener) {
	window.addEventListener("DOMContentLoaded", inputPromptTitle, false)
} else {
	window.attachEvent("onload", inputPromptTitle)
}

function inputPromptTitle() {
	function initInputPromptTitle(input, title) {
		var promptSpan = document.createElement("span")
		promptSpan.setAttribute("style", "position: absolute; font-style: italic; color: #aaa; margin: 0.2em 0 0 0.5em; cursor: text;")
		promptSpan.setAttribute('id', 'input-prompt-' + i)
		promptSpan.setAttribute("title", title)
		promptSpan.textContent = title
		promptSpan.innerText = title
		promptSpan.onmouseover = function() {
			promptSpan.style.display = "none"
		}
		promptSpan.onclick = function() {
			promptSpan.style.display = "none"
			input.focus()
		}
		if(input.value != '') {
			promptSpan.style.display = "none"
		}
		input.parentNode.insertBefore(promptSpan, input)
		input.onfocus = function() {
			promptSpan.style.display = "none"
		}
		input.onblur = function() {
			if(input.value == '') {
				promptSpan.style.display = "inline"
			}
		}
		input.onmouseout = function() {
			if(input.value == '' && input!=document.activeElement) {
				promptSpan.style.display = "inline"
			}
		}
	}
	var inputs = document.getElementsByTagName("input")
	for (var i = 0; i < inputs.length; i++) {
		var title = inputs[i].getAttribute("title")
		if (title) {
			initInputPromptTitle(inputs[i], title)
		}
	}
}

})(window.jQuery)

