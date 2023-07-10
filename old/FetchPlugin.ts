import { PluginValue, ViewUpdate, ViewPlugin } from "@codemirror/view";
import { InlineSuggestionEffect } from "../inline_suggestions/InlineSuggestionStateField";

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

export function fetchPluginViewPluginWrapper(fetchFn: any) {
	return ViewPlugin.define((view) => {
		return new FetchPlugin(fetchFn);
	});
}