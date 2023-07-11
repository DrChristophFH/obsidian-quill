import { StateField, StateEffect, Transaction, EditorState, Text } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { Suggestion } from "./Suggestion";


// state field holding the current suggestion
export const suggestionField = StateField.define<Suggestion>({
	create(state: EditorState) : Suggestion {
		return {
			suggestionText: "This is a test sentence.",
			acceptHook: () => {},
		};
	},

	update(oldState: any, transaction: Transaction) {
		let newState = oldState;

		for (let effect of transaction.effects) {
			if (effect.is(SetSuggestionEffect)) {
				newState = effect.value.suggestion;
			} else if (effect.is(SetSuggestionTextEffect)) {
				newState = {
					...newState,
					suggestionText: effect.value.suggestionText,
				};
			}
		}
		return newState;
	},
});

// state effect to update the whole suggestion
export const SetSuggestionEffect = StateEffect.define<{
	suggestion: Suggestion;
}>();

export const SetSuggestionTextEffect = StateEffect.define<{
	suggestionText: string;
}>();

export function setSuggestion(view: EditorView, sug: Suggestion) {
  view.dispatch({
    effects: [SetSuggestionEffect.of({ suggestion: sug })],
  });
}

export function setSuggestionText(view: EditorView, sugText: string) {
	view.dispatch({
		effects: [SetSuggestionTextEffect.of({ suggestionText: sugText })],
	});
}