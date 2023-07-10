import { StateField, StateEffect, Transaction, EditorState, Text } from "@codemirror/state";
import { Suggestion } from "./Suggestion";


// state field holding the current suggestion
export const suggestionField = StateField.define<Suggestion>({
	create(state: EditorState) : Suggestion {
		return {
			suggestionText: "Yallah",
			acceptHook: () => {},
		};
	},

	update(oldState: any, transaction: Transaction) {
		let newState = oldState;

		for (let effect of transaction.effects) {
			if (effect.is(InlineSuggestionEffect)) {
				newState = effect.value.suggestion;
			}
		}
		return newState;
	},
});

// state effect to update the suggestion
export const InlineSuggestionEffect = StateEffect.define<{
	suggestion: Suggestion;
	doc: Text | null;
}>();