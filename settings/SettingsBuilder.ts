import Quill from "main";
import { ContextBeforeCursorRange as ContextRange, QuillSettings } from "./Settings";
import { App, Setting, TextComponent, TFile } from "obsidian";
import { RewritePromptModal } from './RewritePromptModal';
import { FileSuggestionModal } from './FileSuggestionModal';

export class SettingsBuilder {
  plugin: Quill;
  settings: QuillSettings;
  app: App;
  cssClasses: string[];

  constructor(plugin: Quill, app: App, cssClasses?: string[]) {
    this.plugin = plugin;
    this.app = app;
    this.settings = plugin.settings;
    this.cssClasses = cssClasses ?? [];
  }

  public buildInFileContextSettings(containerEl: HTMLElement) {
    containerEl.createEl('h4', { text: 'In File Context' });

    new Setting(containerEl)
      .setName('Context before cursor (characters)')
      .setDesc('Determines how many characters before the cursor are supplied as context to the prompt.')
      .addSlider((slider) => {
        slider
          .setLimits(0, 1000, 5)
          .setValue(this.settings.contextBeforeCursor)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.settings.contextBeforeCursor = value;
            await this.plugin.saveSettings();
          });
        slider.sliderEl.style.width = '25em';
      })
      .settingEl.addClass(...this.cssClasses);

    new Setting(containerEl)
      .setName('Context before cursor (ranges)')
      .setDesc('Determines whether the context should be the sentence, paragraph or section (current heading).')
      .addDropdown((dropdown) => {
        dropdown
          .addOption(ContextRange.Characters, 'Character count only')
          .addOption(ContextRange.Sentence, 'Sentence')
          .addOption(ContextRange.Paragraph, 'Paragraph')
          .addOption(ContextRange.Section, 'Section')
          .setValue(this.settings.contextBeforeCursorRange)
          .onChange(async (value) => {
            this.settings.contextBeforeCursorRange = value as ContextRange;
            await this.plugin.saveSettings();
          });
      })
      .settingEl.addClass(...this.cssClasses);
  }

  public buildContextFilesList(containerEl: HTMLElement) {
    containerEl.createEl('h4', { text: 'Additional Context' });
    const contextFileListContainer = containerEl.createDiv();

    contextFileListContainer.empty(); // Clear the container

    const contextFileList = this.plugin.settings.contextFileList;

    let files = this.app.vault
      .getAllLoadedFiles()
      .filter((filter) => filter instanceof TFile);
    const modal = new FileSuggestionModal(this.app, files as TFile[]);

    new Setting(contextFileListContainer)
      .setHeading()
      .setName('Context files')
      .setDesc('List of files to use as context for the prompt.')
      .addExtraButton((button) => {
        button.setIcon('plus-square')
          .setTooltip('Add a new context file')
          .onClick(() => {
            modal.open();
            modal.onChooseItem = (file) => {
              contextFileList.add(file.path);
              this.buildContextFilesList(contextFileListContainer);
            };
          });
      })
      .settingEl.addClass(...this.cssClasses);

    // Build list of context files settings
    for (const contextFile of contextFileList.getAll()) {
      new Setting(contextFileListContainer)
        .setName(contextFile.getName())
        .setDesc(contextFile.getPath())
        .addToggle((toggle) => {
          toggle
            .setTooltip('Enable/disable this context file')
            .setValue(contextFile.isEnabled())
            .onChange(async (value) => {
              contextFile.setEnabled(value);
              await this.plugin.saveSettings();
            });
        })
        .addExtraButton((button) => {
          button.setIcon('trash-2')
            .setTooltip('Remove this context file')
            .onClick(() => {
              contextFileList.remove(contextFile.getPath());
              this.buildContextFilesList(contextFileListContainer);
            });
        })
        .settingEl.addClass(...this.cssClasses);
    }
  }

  public buildRewritePromptList(containerEl: HTMLElement) {
    containerEl.createEl('h4', { text: 'Rewrite Context' });
    const rewritePromptsContainer = containerEl.createDiv();
    rewritePromptsContainer.empty(); // Clear the container

    const rewritePrompts = this.plugin.settings.rewritePrompts;

    new Setting(rewritePromptsContainer)
      .setName('Rewrite Prompts')
      .setDesc('A list of prompts from which you can select to specify how the selected text should be rewritten.')
      .addExtraButton((button) => {
        button.setIcon('plus-square')
          .setTooltip('Add a new prompt')
          .onClick(() => {
            new RewritePromptModal(this.app, (prompt) => {
              rewritePrompts.push(prompt);
              this.buildRewritePromptList(rewritePromptsContainer);
            }).open();
          });
      })
      .settingEl.addClass(...this.cssClasses);

    // Build list of prompts
    for (const prompt of rewritePrompts) {
      new Setting(rewritePromptsContainer)
        .setName(prompt.name)
        .setDesc(prompt.prompt)
        .addToggle((toggle) => {
          toggle
            .setTooltip('Enable/disable prompt')
            .setValue(prompt.enabled)
            .onChange(async (value) => {
              prompt.enabled = value;
              await this.plugin.saveSettings();
            });
        })
        .addExtraButton((button) => {
          button
            .setTooltip('Edit this prompt')
            .setIcon('pencil')
            .onClick(() => {
              new RewritePromptModal(this.app, (newPrompt) => {
                prompt.name = newPrompt.name;
                prompt.prompt = newPrompt.prompt;
                this.buildRewritePromptList(rewritePromptsContainer);
              }, prompt).open();
            });
        })
        .addExtraButton((button) => {
          button.setIcon('trash-2')
            .setTooltip('Remove this prompt')
            .onClick(() => {
              rewritePrompts.remove(prompt);
              this.buildRewritePromptList(rewritePromptsContainer);
            });
        })
        .settingEl.addClass(...this.cssClasses);
    }
  }

  public buildPriceSettings(containerEl: HTMLElement) {
    new Setting(containerEl)
      .setName('Price per 1k tokens')
      .setDesc('The price per 1k tokens for the API you are using.')
      .addText((text) => {
        text
          .setPlaceholder('0.06')
          .setValue(this.settings.pricePer1kTokens.toString())
          .onChange(async (value) => {
            this.settings.pricePer1kTokens = parseFloat(value);
            this.buildProgressBar(progressBarSetting);
            await this.plugin.saveSettings();
          });
      })
      .settingEl.addClass(...this.cssClasses);

    new Setting(containerEl)
      .setName('Maximum monthly spend')
      .setDesc('The maximum amount you want to spend on the API per month.')
      .addText((text) => {
        text
          .setPlaceholder('100')
          .setValue(this.settings.maximumMonthlySpend.toString())
          .onChange(async (value) => {
            this.settings.maximumMonthlySpend = parseFloat(value);
            this.buildProgressBar(progressBarSetting);
            await this.plugin.saveSettings();
          });
      })
      .settingEl.addClass(...this.cssClasses);

    const spentTokensSetting = new Setting(containerEl)
      .setName('Current spent tokens')
      .setDesc('The current amount of tokens you have spent on the API this month.')
      .addText((text) => {
        text
          .setPlaceholder('0')
          .setValue(this.settings.currentTokensSpent.toString())
          .setDisabled(true);
      })
      .addExtraButton((button) => {
        button.setIcon('rotate-ccw')
          .setTooltip('Reset the current spent tokens')
          .onClick(async () => {
            this.settings.currentTokensSpent = 0;
            (spentTokensSetting.components[0] as TextComponent).setValue('0');
            this.buildProgressBar(progressBarSetting);
            await this.plugin.saveSettings();
          });
      });
      
    spentTokensSetting.settingEl.addClass(...this.cssClasses);

    const progressBarSetting = new Setting(containerEl)
      .setName('Current monthly spend')
      .setDesc('The current amount you have spent on the API this month.');

    this.buildProgressBar(progressBarSetting);
  }

  private buildProgressBar(settingElement: Setting) {
    settingElement.settingEl.querySelector('.custom-progress-container')?.remove();

    const currentSpentMoney = this.settings.currentTokensSpent / 1000 * this.settings.pricePer1kTokens;
    const percentageSpent = currentSpentMoney / this.settings.maximumMonthlySpend * 100;

    let progressBar = document.createElement('div');
    progressBar.addClass('custom-progress-bar');
    progressBar.style.width = percentageSpent + '%';
    progressBar.title = `Current spend: $${currentSpentMoney.toFixed(2)} of $${this.settings.maximumMonthlySpend.toFixed(2)}`;
    progressBar.textContent = percentageSpent.toFixed(2) + '%';

    let progressContainer = document.createElement('div');
    progressContainer.addClass('custom-progress-container');
    progressContainer.style.width = '25em';
    progressContainer.appendChild(progressBar);

    settingElement.settingEl.appendChild(progressContainer);
  }
}