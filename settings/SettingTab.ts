import Quill from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';

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
				.setName('Context before cursor')
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
	}
}




