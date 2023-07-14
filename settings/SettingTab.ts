import { App, PluginSettingTab, Setting, TFile, TextComponent } from 'obsidian';
import Quill from 'main';
import { ContextBeforeCursorRange as ContextRange, QuillSettings } from 'settings/Settings';
import { FileSuggestionModal } from './FileSuggestionModal';

export class QuillSettingTab extends PluginSettingTab {
  plugin: Quill;

  constructor(app: App, plugin: Quill) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    const settings = this.plugin.settings;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Quill Settings.' });

    containerEl.createEl('h3', { text: 'API Settings' });

    new Setting(containerEl)
      .setName('API Key')
      .setDesc('Your API key for the API you are using.')
      .addText((text) => {
        text
          .setPlaceholder('API Key')
          .setValue(settings.apiKey)
          .onChange(async (value) => {
            settings.apiKey = value;
            await this.plugin.saveSettings();
          });
        text.inputEl.type = 'password'; // hide the key
      });

    containerEl.createEl('h3', { text: 'Context Settings' });

    new Setting(containerEl)
      .setName('Context before cursor (characters)')
      .setDesc('Determines how many characters before the cursor are supplied as context to the prompt.')
      .addSlider((slider) => {
        slider
          .setLimits(0, 1000, 5)
          .setValue(settings.contextBeforeCursor)
          .setDynamicTooltip()
          .onChange(async (value) => {
            settings.contextBeforeCursor = value;
            await this.plugin.saveSettings();
          });
        slider.sliderEl.style.width = '25em';
      });

    new Setting(containerEl)
      .setName('Context before cursor (ranges)')
      .setDesc('Determines whether the context should be the sentence, paragraph or section (current heading).')
      .addDropdown((dropdown) => {
        dropdown
          .addOption(ContextRange.Characters, 'Character count only')
          .addOption(ContextRange.Sentence, 'Sentence')
          .addOption(ContextRange.Paragraph, 'Paragraph')
          .addOption(ContextRange.Section, 'Section')
          .setValue(settings.contextBeforeCursorRange)
          .onChange(async (value) => {
            settings.contextBeforeCursorRange = value as ContextRange;
            await this.plugin.saveSettings();
          });
      });

    const contextFileListContainer = containerEl.createDiv();
    this.buildContextFilesList(contextFileListContainer);

    containerEl.createEl('h3', { text: 'Price Settings' });

    new Setting(containerEl)
      .setName('Price per 1k tokens')
      .setDesc('The price per 1k tokens for the API you are using.')
      .addText((text) => {
        text
          .setPlaceholder('0.06')
          .setValue(settings.pricePer1kTokens.toString())
          .onChange(async (value) => {
            settings.pricePer1kTokens = parseFloat(value);
            this.buildProgressBar(progressBarSetting, settings);
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Maximum monthly spend')
      .setDesc('The maximum amount you want to spend on the API per month.')
      .addText((text) => {
        text
          .setPlaceholder('100')
          .setValue(settings.maximumMonthlySpend.toString())
          .onChange(async (value) => {
            settings.maximumMonthlySpend = parseFloat(value);
            this.buildProgressBar(progressBarSetting, settings);
            await this.plugin.saveSettings();
          });
      });

    const spentTokensSetting = new Setting(containerEl)
      .setName('Current spent tokens')
      .setDesc('The current amount of tokens you have spent on the API this month.')
      .addText((text) => {
        text
          .setPlaceholder('0')
          .setValue(settings.currentTokensSpent.toString())
          .setDisabled(true);
      })
      .addExtraButton((button) => {
        button.setIcon('rotate-ccw')
          .setTooltip('Reset the current spent tokens')
          .onClick(async () => {
            settings.currentTokensSpent = 0;
            (spentTokensSetting.components[0] as TextComponent).setValue('0');
            this.buildProgressBar(progressBarSetting, settings);
            await this.plugin.saveSettings();
          });
      });

    const progressBarSetting = new Setting(containerEl)
      .setName('Current monthly spend')
      .setDesc('The current amount you have spent on the API this month.');

    this.buildProgressBar(progressBarSetting, settings);
  }

  buildContextFilesList(containerEl: HTMLElement) {
    containerEl.empty(); // Clear the container

    const contextFileList = this.plugin.settings.contextFileList;

    let files = this.app.vault
      .getAllLoadedFiles()
      .filter((filter) => filter instanceof TFile);
    console.log(files);
    const modal = new FileSuggestionModal(this.app, files as TFile[]);

    new Setting(containerEl)
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
              this.buildContextFilesList(containerEl);
            };
          });
      });

    // Build list of context files settings
    for (const contextFile of contextFileList.getAll()) {
      new Setting(containerEl)
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
              this.buildContextFilesList(containerEl);
            });
        });
    }
  }

  buildProgressBar(settingElement: Setting, settings: QuillSettings) {
    settingElement.settingEl.querySelector('.custom-progress-container')?.remove();

    const currentSpentMoney = settings.currentTokensSpent / 1000 * settings.pricePer1kTokens;
    const percentageSpent = currentSpentMoney / settings.maximumMonthlySpend * 100;

    let progressBar = document.createElement('div');
    progressBar.addClass('custom-progress-bar');
    progressBar.style.width = percentageSpent + '%';
    progressBar.title = `Current spend: $${currentSpentMoney.toFixed(2)} of $${settings.maximumMonthlySpend.toFixed(2)}`;
    progressBar.textContent = percentageSpent.toFixed(2) + '%';

    let progressContainer = document.createElement('div');
    progressContainer.addClass('custom-progress-container');
    progressContainer.style.width = '25em';
    progressContainer.appendChild(progressBar);

    settingElement.settingEl.appendChild(progressContainer);
  }
}