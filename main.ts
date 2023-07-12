import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ViewPlugin, PluginValue, ViewUpdate, EditorView } from '@codemirror/view';
import { RenderPlugin, renderPluginSpec } from 'inline_suggestions/RenderPlugin';
import { suggestionField, setSuggestion, setSuggestionText } from 'inline_suggestions/InlineSuggestionStateField';
import { QuillMenuView, VIEW_TYPE_QUILL_MENU } from 'side_view/QuillView';
import { Fetcher, MockFetcher } from 'gpt/Fetcher';

interface QuillSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: QuillSettings = {
	mySetting: 'default'
}

export default class Quill extends Plugin {
	settings: QuillSettings;
	fetcher: Fetcher = new MockFetcher();

	async onload() {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_QUILL_MENU, (leaf) => new QuillMenuView(leaf));
		
		this.addRibbonIcon("feather", "Activate Quill Menu", () => {
      this.activateQuillMenuView();
    });

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
			editorCallback: (editor: Editor, view: MarkdownView) => {
				// @ts-expect-error, not typed
				const editorView = view.editor.cm as EditorView;
				const prompt = 'This is a prompt'; // TODO get context for prompt
				this.fetcher.fetch(prompt).then((suggestion) => setSuggestionText(editorView, suggestion));
			},
		});

		this.registerEditorExtension(ViewPlugin.fromClass(RenderPlugin, renderPluginSpec));
		this.registerEditorExtension(suggestionField);
	}

	onunload() {}

	async activateQuillMenuView() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_QUILL_MENU);

    await this.app.workspace.getRightLeaf(false).setViewState({
      type: VIEW_TYPE_QUILL_MENU,
      active: true,
    });

    this.app.workspace.revealLeaf(
      this.app.workspace.getLeavesOfType(VIEW_TYPE_QUILL_MENU)[0]
    );
  }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}