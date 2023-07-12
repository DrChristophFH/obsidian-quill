import { App, PluginSettingTab, Setting } from 'obsidian';
import Quill from 'main';
import { ContextBeforeCursorRange as ContextRange } from 'settings/Settings';

export class QuillSettingTab extends PluginSettingTab {
	plugin: Quill;

	constructor(app: App, plugin: Quill) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Quill Settings.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
				.setName('Context before cursor (characters)')
				.setDesc('Determines how many characters before the cursor are supplied as context to the prompt.')
				.addSlider((slider) => {
						slider
								.setLimits(0, 1000, 5)
								.setValue(this.plugin.settings.contextBeforeCursor)
								.setDynamicTooltip()
								.onChange(async (value) => {
										this.plugin.settings.contextBeforeCursor = value;
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
								.setValue(this.plugin.settings.contextBeforeCursorRange)
								.onChange(async (value) => {
										this.plugin.settings.contextBeforeCursorRange = value as ContextRange;
										await this.plugin.saveSettings();
								});
				});
	}
}




