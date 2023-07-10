import { PluginValue, PluginSpec, ViewPlugin } from "@codemirror/view";
import { DecorationSet, Decoration } from "@codemirror/view";
import { ViewUpdate, EditorView } from "@codemirror/view";
import { InlineSuggestionWidget } from "./InlineSuggestionWidget";
import { InlineSuggestionState } from "./InlineSuggestionStateField";
import { Suggestion } from "./Suggestion";

export class RenderPlugin implements PluginValue {
	decorations: DecorationSet;

	constructor() {
		// Empty decorations
		this.decorations = Decoration.none;
	}

	update(update: ViewUpdate) {
		const suggestion: Suggestion | null = update.state.field(InlineSuggestionState);
		
    if (!suggestion) {
			this.decorations = Decoration.none;
			return;
		}

		this.decorations = this.inlineSuggestionDecoration(
			update.view,
			suggestion.display_suggestion
		);
	}

  inlineSuggestionDecoration(view: EditorView, prefix: string) {
    const pos = view.state.selection.main.head;
    const widgets = [];
    const widget = Decoration.widget({
      widget: new InlineSuggestionWidget(prefix),
      side: 1,
    });
    widgets.push(widget.range(pos));
    return Decoration.set(widgets);
  }
}

export const renderPluginSpec: PluginSpec<RenderPlugin> = {
  decorations: (value: RenderPlugin) => value.decorations,
};

