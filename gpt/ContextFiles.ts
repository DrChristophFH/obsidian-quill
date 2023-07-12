export class ContextFiles {
    private contextFiles: string[] = [];

    add(path: string) {
        this.contextFiles.push(path)
    }

    getAll(): string[] {
        return this.contextFiles;
    }

    remove(path: string) {
        this.contextFiles.remove(path);
    }

    clear() {
        this.contextFiles = [];
    }
}