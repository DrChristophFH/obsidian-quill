import { ItemView, WorkspaceLeaf } from "obsidian";

export const VIEW_TYPE_QUILL_MENU = "quill-menu-view";

export class QuillMenuView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    this.icon = "feather";
  }

  getViewType() {
    return VIEW_TYPE_QUILL_MENU;
  }

  getDisplayText() {
    return "Quill Menu";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("h4", { text: "Quill Menu" });
  }

  async onClose() {
    // Nothing to clean up.
  }
}