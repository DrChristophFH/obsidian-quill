import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ViewPlugin, PluginValue, ViewUpdate, EditorView } from '@codemirror/view';
import { RenderPlugin, renderPluginSpec } from 'inline_suggestions/RenderPlugin';
import { suggestionField, setSuggestion, setSuggestionText } from 'inline_suggestions/InlineSuggestionStateField';


interface QuillSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: QuillSettings = {
	mySetting: 'default'
}

export default class Quill extends Plugin {
	settings: QuillSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'accept-word-from-suggestion',
			name: 'Accept word from suggestion',
			hotkeys: [{ modifiers: ["Mod"], key: "ArrowRight" }],
			editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) => {
				// @ts-expect-error, not typed
				const editorView = view.editor.cm as EditorView;
				const suggestionText = editorView.state.field(suggestionField).suggestionText;

				if (suggestionText.length > 0) {
					if (!checking) {
						// insert first word from suggestion
						const firstWord = suggestionText.split(' ')[0] + ' ';
						editor.replaceSelection(firstWord);
						// update suggestion state
						// @ts-expect-error, not typed
						const editorView = view.editor.cm as EditorView;
						setSuggestionText(editorView, suggestionText.slice(firstWord.length));
					}
					return true
				}
				return false;
			},
		});

		this.addCommand({
			id: 'accept-suggestion',
			name: 'Accept suggestion',
			hotkeys: [{ modifiers: [], key: "Tab" }],
			editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) => {
				// @ts-expect-error, not typed
				const editorView = view.editor.cm as EditorView;
				const suggestionText = editorView.state.field(suggestionField).suggestionText;

				if (suggestionText.length > 0) {
					if (!checking) {
						// insert whole suggestion
						editor.replaceSelection(suggestionText);
						// update suggestion state to empty
						setSuggestionText(editorView, '');
					}
					return true
				}
				return false;
			},
		});

		this.addCommand({
			id: 'generate-suggestion',
			name: 'Generate a suggestion',
			hotkeys: [{ modifiers: ["Mod"], key: "e" }],
			editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) => {
				if ( false ) { // TODO cursor is in editor
					if (!checking) {
						// TODO get context for prompt
						// TODO make api call to get suggestion
						// TODO update suggestion text
					}
					return true
				}
				return false;
			},
		});

		// Context settings
			// TODO add command to set a specific note as context for prompt
			// TODO add special character sequence to enable comments in context files
			// TODO add setting to set context length for text before cursor
			// TODO add setting to set context length to sentence or paragraph or section (section is till the last heading)
			// TODO add setting to see context files
			// TODO add setting to set and remove context files
			// TODO add setting to set price limit based on estimated price of prompts
			// TODO add adjectives list to set task for rewrite command (reduce, rephrase, expand, detail, etc.)
		// Commands
			// TODO add command to let gpt compress context files
			// TODO add command to let gpt rewrite selected text without context files (shallow rewrite)
			// TODO add command to let gpt rewrite selected text with context files (deep rewrite)
				// the rewrite command task (reduce, rephrase, expand, detail, etc.) are determined by the adjectives list
			// TODO add commands to context menu (right click on selected text)
		// Model settings
			// TODO add settings for api key (hidden via password field)
			// TODO add settings for model parameters
		// Side Tab view (right side of obsidian)
			// TODO add show and edit for important settings that change frequently (context files, context length, model parameters)
				// keep context files in a list with enabled/disabled toggle and remove button for fast configuration
			// TODO add token estimate for context to side tab view (based on OpenAI estimate function)
			// TODO add price estimate for context to side tab view (based on token estimate and configurable api price)
			// TODO add request statistics to side tab view (how many requests sent, how many tokens used)

		this.registerEditorExtension(ViewPlugin.fromClass(RenderPlugin, renderPluginSpec));
		this.registerEditorExtension(suggestionField);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}