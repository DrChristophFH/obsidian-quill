import { App, TFile } from "obsidian";

export class ContextFile {
  private path: string;
  private enabled: boolean;

  constructor(path: string, enabled: boolean) {
    this.path = path;
    this.enabled = enabled;
  }

  getPath(): string {
    return this.path;
  }

  setPath(path: string) {
    this.path = path;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  async getText(app: App): Promise<string> {
    let text: string = "";
    const { vault } = app;
    const file = app.vault.getAbstractFileByPath(this.path);

    if (file !== null && file instanceof TFile) {
      text = await vault.cachedRead(file);
    }
    return text;
  }
}

export class ContextFileList {
  private contextFiles: ContextFile[] = [];

  add(path: string, enabled: boolean = true) {
    this.contextFiles.push(new ContextFile(path, enabled));
  }

  getAll(): ContextFile[] {
    return this.contextFiles;
  }

  remove(path: string) {
    for (let i = 0; i < this.contextFiles.length; i++) {
      if (this.contextFiles[i].getPath() === path) {
        this.contextFiles.splice(i, 1);
      }
    }
  }

  clear() {
    this.contextFiles = [];
  }

  async getText(app: App): Promise<string> {
    const promises = this.getAll().map((contextFile: ContextFile) => {
      return contextFile.getText(app);
    });
  
    const contents = await Promise.all(promises);
  
    let text: string = "";
    contents.forEach((content: string) => {
      text += content + '\n';
    });
  
    return text;
  }  
}
