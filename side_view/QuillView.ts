import Quill from "main";
import { App, ItemView, WorkspaceLeaf } from "obsidian";
import { SettingsBuilder } from "settings/SettingsBuilder";

export const VIEW_TYPE_QUILL_MENU = "quill-menu-view";

export class QuillMenuView extends ItemView {
  settingsBuilder: SettingsBuilder;

  constructor(leaf: WorkspaceLeaf, plugin: Quill, app: App) {
    super(leaf);
    this.icon = "feather";
    this.settingsBuilder = new SettingsBuilder(plugin, app, ["side-view-setting"]);
  }

  getViewType() {
    return VIEW_TYPE_QUILL_MENU;
  }

  getDisplayText() {
    return "Quill Menu";
  }

  async onOpen() {
    const container = this.containerEl.children[1] as HTMLElement;
    container.empty();
    container.createEl('h3', { text: 'Context Settings' });
    this.settingsBuilder.buildInFileContextSettings(container);
    this.settingsBuilder.buildContextFilesList(container);
    this.settingsBuilder.buildRewritePromptList(container);
    container.createEl('h3', { text: 'Price Settings' });
    this.settingsBuilder.buildPriceSettings(container); 
  }

  async onClose() {
    // Nothing to clean up.
  }
}