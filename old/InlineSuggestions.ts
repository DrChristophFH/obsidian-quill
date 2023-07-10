import {
	ViewPlugin,
} from "@codemirror/view";
import {
	EditorState,
} from "@codemirror/state";
import { suggestionField } from "../inline_suggestions/InlineSuggestionStateField";
import { Suggestion } from "../inline_suggestions/Suggestion";
import { RenderPlugin, renderPluginSpec } from "../inline_suggestions/RenderPlugin";
import { debouncePromise } from "./Utils";
import { InlineSuggestionKeyMap } from "./InlineSuggestionKeyMap";
import { fetchPluginViewPluginWrapper } from "./FetchPlugin";

const renderInlineSuggestionPlugin = ViewPlugin.fromClass(RenderPlugin, renderPluginSpec);

type InlineSuggestionOptions = {
	fetchFunction: (state: EditorState) => Promise<Suggestion>;
	delay?: number;
	continueSuggesting: boolean;
	acceptShortcut?: string;
};

export function forceableInlineSuggestion(options: InlineSuggestionOptions) {
  const { delay = 500, acceptShortcut = 'Tab' } = options;
  const fetchFunction = options.fetchFunction;
  const { debouncedFunction, executeImmediately } = debouncePromise(fetchFunction, delay);
  return {
    extension: acceptShortcut
      ? [
          suggestionField,
          fetchPluginViewPluginWrapper(debouncedFunction),
          renderInlineSuggestionPlugin,
          new InlineSuggestionKeyMap(
            options.continueSuggesting ? fetchFunction : null,
            acceptShortcut
          ).keymap,
        ]
      : [
          suggestionField,
          fetchPluginViewPluginWrapper(debouncedFunction),
          renderInlineSuggestionPlugin,
        ],
			executeImmediately: executeImmediately,
  };
}