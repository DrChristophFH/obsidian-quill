import { StateField, StateEffect, Transaction, EditorState, Text } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
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
			if (effect.is(SetSuggestionEffect)) {
				newState = effect.value.suggestion;
			}
		}
		return newState;
	},
});

// state effect to update the suggestion
export const SetSuggestionEffect = StateEffect.define<{
	suggestion: Suggestion;
}>();

export function setSuggestion(view: EditorView, sug: Suggestion) {
  view.dispatch({
    effects: [SetSuggestionEffect.of({ suggestion: sug })],
  });
}