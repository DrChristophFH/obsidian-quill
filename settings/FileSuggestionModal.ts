import { App, CachedMetadata, FuzzySuggestModal, TFile, TextComponent, Notice } from "obsidian";

export class FileSuggestionModal extends FuzzySuggestModal<TFile> {
  cache: CachedMetadata;
  files: TFile[];
  file: TFile;

  constructor(app: App, items: TFile[]) {
    super(app);
    this.files = [...items];
  }

  onInputChanged(): void {
    const inputStr = this.inputEl.value;
    const suggestions = this.getSuggestions(inputStr);
    this.open();
  }

  getItemText(item: TFile) {
    return item.path;
  }

  onChooseItem(item: TFile) {
    new Notice(item.path);
  }

  getItems() {
    return this.files;
  }
}