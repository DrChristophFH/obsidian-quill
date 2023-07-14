import { App, Notice, TFile } from "obsidian";

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

  getName() : string {
    return this.path.split('/').pop() || '';
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
    const file = vault.getAbstractFileByPath(this.path);

    if (file !== null && file instanceof TFile) {
      text = await vault.cachedRead(file);
    }
    return text;
  }
}

export class ContextFileList {
  private contextFiles: ContextFile[] = [];

  static revive(data: any): ContextFileList {
    const contextFileList = new ContextFileList();
    contextFileList.contextFiles = data.contextFiles.map((contextFile: any) => new ContextFile(contextFile.path, contextFile.enabled));
    return contextFileList;
  }

  add(path: string, enabled: boolean = true) {
    const found = this.contextFiles.find((contextFile: ContextFile) => {
      return contextFile.getPath() === path;
    });

    if (found) {
      new Notice("'" + path + "' already is a context file.");
      return; // Return from the outer add method if a matching path is found
    }

    this.contextFiles.push(new ContextFile(path, enabled));
    new Notice("'" + path + "' was added to context files.");
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
    const promises = this.contextFiles.map((contextFile: ContextFile) => {
      if (contextFile.isEnabled()) // returns 'undefined' for disabled files
        return contextFile.getText(app);
    });
  
    const contents = await Promise.all(promises);
  
    let text: string = "";
    contents.forEach((content: string) => {
      if (content !== undefined) // 'undefined' values from disabled files are skipped
        text += content + '\n';
    });
  
    return text;
  }  
}
