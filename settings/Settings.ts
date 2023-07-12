export enum ContextBeforeCursorRange {
  Characters = 'characters',
  Sentence = 'sentence',
  Paragraph = 'paragraph',
  Section = 'section',
}

export interface QuillSettings {
	mySetting: string;
	contextBeforeCursor: number;
  contextBeforeCursorRange: ContextBeforeCursorRange;
}

export const DEFAULT_SETTINGS: QuillSettings = {
	mySetting: 'default',
	contextBeforeCursor: 100,
  contextBeforeCursorRange: ContextBeforeCursorRange.Characters,
}