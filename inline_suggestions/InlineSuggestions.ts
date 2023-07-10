import {
	ViewPlugin,
} from "@codemirror/view";
import {
	EditorState,
} from "@codemirror/state";
import { InlineSuggestionState } from "./InlineSuggestionStateField";
import { Suggestion } from "./Suggestion";
import { FetchPlugin } from "./FetchPlugin";
import { RenderPlugin, renderPluginSpec } from "./RenderPlugin";
import { debouncePromise } from "./Utils";
import { InlineSuggestionKeyMap } from "./InlineSuggestionKeyMap";
import { InlineFetchFn } from "./InlineFetchFn";

export const fetchSuggestion = (fetchFn: InlineFetchFn) => ViewPlugin.fromClass(FetchPlugin);

const renderInlineSuggestionPlugin = ViewPlugin.fromClass(RenderPlugin, renderPluginSpec);

type InlineSuggestionOptions = {
	fetchFunction: (state: EditorState) => Promise<Suggestion>;
	delay?: number;
	continueSuggesting?: boolean;
	acceptShortcut?: string | null;
};

export function forceableInlineSuggestion(options: InlineSuggestionOptions) {
  const { delay = 500, acceptShortcut = 'Tab' } = options;
  const fetchFunction = options.fetchFunction;
  const { debouncedFunction, executeImmediately } = debouncePromise(fetchFunction, delay);
  return {
    extension: acceptShortcut
      ? [
          InlineSuggestionState,
          fetchSuggestion(debouncedFunction),
          renderInlineSuggestionPlugin,
          new InlineSuggestionKeyMap(
            options.continueSuggesting ? fetchFunction : null,
            acceptShortcut
          ).keymap,
        ]
      : [
          InlineSuggestionState,
          fetchSuggestion(debouncedFunction),
          renderInlineSuggestionPlugin,
        ],
			executeImmediately: executeImmediately,
  };
}