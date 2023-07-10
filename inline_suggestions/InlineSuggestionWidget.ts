import { EditorView, WidgetType } from "@codemirror/view";

// simple widget that displays a suggestion
export class InlineSuggestionWidget extends WidgetType {
	suggestion: string;

	constructor(suggestion: string) {
		super();
		this.suggestion = suggestion;
	}

	toDOM(view: EditorView): HTMLElement {
		const div = document.createElement("span");
		div.style.opacity = "0.4";
		div.className = "inline-suggestion";
		div.textContent = this.suggestion;
		return div;
	}
}