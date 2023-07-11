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
				if ( ) { // cursor is in editor
					if (!checking) {
						// get context for prompt
						// make api call to get suggestion
						// update suggestion text
					}
					return true
				}
				return false;
			},
		});

		// TODO add command to set file as context for prompt
		// TODO add setting to set context length for text before cursor
		// TODO add setting to set context length to sentence or paragraph or section (to heading)
		// TODO add setting to see context files
		// TODO add setting to set and remove context files
		// TODO add settings for api key 
		// TODO add setting for model parameters

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