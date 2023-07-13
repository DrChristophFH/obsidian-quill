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
}

export class ContextFiles {
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
}
