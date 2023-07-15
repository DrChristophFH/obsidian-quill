import { App, Modal, Setting } from "obsidian";
import { RewritePrompt } from "./Settings";

export class RewritePromptModal extends Modal {
  prompt: RewritePrompt = {
    name: "",
    prompt: "",
    enabled: false,
  };
  onSubmit: (prompt: RewritePrompt) => void;

  constructor(app: App, onSubmit: (prompt: RewritePrompt) => void, prompt?: RewritePrompt) {
    super(app);
    this.onSubmit = onSubmit;
    if (prompt) {
      this.prompt = prompt;
    }
  }

  onOpen() {
    let { contentEl } = this;
    contentEl.createEl("h1", { text: "Rewrite Prompt" });
    
    new Setting(contentEl)
      .setName("Name")
      .addText((text) => {
        text
          .setPlaceholder("Name")
          .setValue(this.prompt.name)
          .onChange(async (value) => {
            this.prompt.name = value;
          });
      });

    new Setting(contentEl)
      .setName("Prompt")
      .addTextArea((text) => {
        text
          .setPlaceholder("Prompt")
          .setValue(this.prompt.prompt)
          .onChange(async (value) => {
            this.prompt.prompt = value;
          });
      });

    new Setting(contentEl)
      .addButton((button) => {
        button
          .setButtonText("Submit")
          .onClick(async () => {
            this.onSubmit(this.prompt);
            this.close();
          });
      });
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}