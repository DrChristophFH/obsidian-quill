import { ContextFileList } from "gpt/ContextFiles";

export enum ContextBeforeCursorRange {
  Characters = 'characters',
  Sentence = 'sentence',
  Paragraph = 'paragraph',
  Section = 'section',
}

export interface QuillSettings {
	contextBeforeCursor: number;
  contextBeforeCursorRange: ContextBeforeCursorRange;
  contextFileList: ContextFileList; 
}

export const DEFAULT_SETTINGS: QuillSettings = {
	contextBeforeCursor: 100,
  contextBeforeCursorRange: ContextBeforeCursorRange.Characters,
  contextFileList: new ContextFileList(),
}