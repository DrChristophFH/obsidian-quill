import { WidgetType } from "@codemirror/view";

// simple widget that displays a suggestion
export class InlineSuggestionWidget extends WidgetType {
	suggestion: string;

	constructor(suggestion: string) {
		super();
		this.suggestion = suggestion;
	}

	toDOM() {
		const div = document.createElement("span");
		div.style.opacity = "0.4";
		div.className = "cm-inline-suggestion";
		div.textContent = this.suggestion;
		return div;
	}
}