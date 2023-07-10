import { EditorView, keymap } from "@codemirror/view";
import {
	Prec,
	EditorSelection,
	TransactionSpec,
	SelectionRange,
	EditorState,
} from "@codemirror/state";
import { InlineSuggestionState } from "./InlineSuggestionStateField";
import { Suggestion } from "./Suggestion";
import { InlineFetchFn } from "./InlineFetchFn";

export class InlineSuggestionKeyMap {
	suggestFn: InlineFetchFn | null;
	keymap: any;

	constructor(suggestFn: InlineFetchFn | null, accept_shortcut: string) {
		this.suggestFn = suggestFn;
		this.keymap = Prec.highest(
			keymap.of([
				{
					key: accept_shortcut,
					run: (view: EditorView) => {
						return this.run(view);
					},
				},
			])
		);
	}

	run = (view: EditorView) => {
		const suggestion: Suggestion = view.state.field(InlineSuggestionState);

		// If there is no suggestion, do nothing and let the default keymap handle it
		if (!suggestion) {
			return false;
		}

		view.dispatch({
			...this.insertCompletionText(
				view.state,
				suggestion.complete_suggestion,
				view.state.selection.main.head,
				view.state.selection.main.head
			),
		});
		suggestion.accept_hook?.();
		return true;
	};

	// Helper function to create a cursor at a specific position
	createCursorAtPosition(position: number): SelectionRange {
		return EditorSelection.cursor(position);
	}

	// Helper function to compare document slices
	areDocumentSlicesEqual(
		state: EditorState,
		range: SelectionRange,
		from: number,
		to: number,
		len: number
	): boolean {
		return (
			state.sliceDoc(range.from - len, range.from) ===
			state.sliceDoc(from, to)
		);
	}

	// Helper function to generate the changes object
	generateChanges(
		from: number,
		to: number,
		text: string
	): { from: number; to: number; insert: string } {
		return { from, to, insert: text };
	}

	// Main function to insert completion text
	insertCompletionText(
		state: EditorState,
		text: string,
		from: number,
		to: number
	): TransactionSpec {
		return {
			...state.changeByRange((range) => {
				if (range === state.selection.main) {
					const newCursorPos = from + text.length;
					return {
						changes: this.generateChanges(from, to, text),
						range: this.createCursorAtPosition(newCursorPos),
					};
				}

				const len = to - from;

				// If the range is not empty or the document slices are different, return the current range
				if (
					!range.empty ||
					!this.areDocumentSlicesEqual(state, range, from, to, len)
				) {
					return { range };
				}

				// Otherwise, adjust the 'from' and 'to' positions and update the cursor position in the range
				const newFromPos = range.from - len;
				const newToPos = range.from;
				const newCursorPos = range.from - len + text.length;
				return {
					changes: this.generateChanges(newFromPos, newToPos, text),
					range: this.createCursorAtPosition(newCursorPos),
				};
			}),
			userEvent: "input.complete",
		};
	}
}
