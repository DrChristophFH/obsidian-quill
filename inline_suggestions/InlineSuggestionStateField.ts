import { StateField, StateEffect, Transaction, EditorState, Text } from "@codemirror/state";
import { Suggestion } from "./Suggestion";


// state field holding the current suggestion
export const InlineSuggestionState = StateField.define<Suggestion>({
	create(state: EditorState) : Suggestion {
		return {
			complete_suggestion: "",
			display_suggestion: "",
			accept_hook: () => {},
		};
	},

	update(oldState: any, transaction: Transaction) {
		let newState = oldState;

		for (let effect of transaction.effects) {
			if (effect.is(InlineSuggestionEffect)) {
				// Only update the suggestion if the doc is the same as the current doc
				if (effect.value.doc == null || effect.value.doc == transaction.state.doc) {
					newState = effect.value.suggestion;
				}
			}
		}
		return newState;
	},
});

// state effect to update the suggestion
export const InlineSuggestionEffect = StateEffect.define<{
	suggestion: Suggestion | null;
	doc: Text | null;
}>();