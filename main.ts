import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ViewPlugin, PluginValue, ViewUpdate, EditorView } from '@codemirror/view';
import { RenderPlugin, renderPluginSpec } from 'inline_suggestions/RenderPlugin';
import { suggestionField, setSuggestion } from 'inline_suggestions/InlineSuggestionStateField';


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
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				// @ts-expect-error, not typed
				const editorView = view.editor.cm as EditorView;
				setSuggestion(editorView, {
					suggestionText: editor.getSelection(),
					acceptHook: () => {},
				});
			}
		});

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