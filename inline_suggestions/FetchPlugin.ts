import { PluginValue, ViewUpdate } from "@codemirror/view";
import { InlineSuggestionEffect } from "./InlineSuggestionStateField";

export class FetchPlugin implements PluginValue {
	fetchFn;

	constructor(fetchFn: any) {
		this.fetchFn = fetchFn;
	}

	async update(update: ViewUpdate) {
		const doc = update.state.doc;

		if (!update.docChanged) {
			return;
		}

		const result = await this.fetchFn(update.state);
		update.view.dispatch({
			effects: InlineSuggestionEffect.of({
				suggestion: result,
				doc: doc,
			}),
		});
	}
}
