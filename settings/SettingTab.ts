import { App, PluginSettingTab, Setting } from 'obsidian';
import Quill from 'main';
import { SettingsBuilder } from './SettingsBuilder';

export class QuillSettingTab extends PluginSettingTab {
  plugin: Quill;
  settingsBuilder: SettingsBuilder;

  constructor(app: App, plugin: Quill) {
    super(app, plugin);
    this.plugin = plugin;
    this.settingsBuilder = new SettingsBuilder(plugin, app);
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
    this.settingsBuilder.buildInFileContextSettings(containerEl);
    this.settingsBuilder.buildContextFilesList(containerEl);
    this.settingsBuilder.buildRewritePromptList(containerEl);

    containerEl.createEl('h3', { text: 'Price Settings' });
    this.settingsBuilder.buildPriceSettings(containerEl);
  }
}