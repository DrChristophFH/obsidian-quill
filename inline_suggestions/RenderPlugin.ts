import { PluginValue, PluginSpec } from "@codemirror/view";
import { DecorationSet, Decoration } from "@codemirror/view";
import { ViewUpdate, EditorView } from "@codemirror/view";
import { InlineSuggestionWidget } from "./InlineSuggestionWidget";
import { suggestionField } from "./InlineSuggestionStateField";

export class RenderPlugin implements PluginValue {
	decorations: DecorationSet;

	constructor() {
		this.decorations = Decoration.none;
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = this.buildInlineSuggestionDecoration(
				update.view,
				update.state.field(suggestionField).suggestionText
			);
		}
	}

  buildInlineSuggestionDecoration(view: EditorView, suggestionText: string) {
    const pos = view.state.selection.main.head;
    const widget = Decoration.widget({
      widget: new InlineSuggestionWidget(suggestionText),
      side: 1,
    });
		const decorations = Decoration.set(widget.range(pos));
    return decorations;
  }
}

export const renderPluginSpec: PluginSpec<RenderPlugin> = {
  decorations: (value: RenderPlugin) => value.decorations,
};

