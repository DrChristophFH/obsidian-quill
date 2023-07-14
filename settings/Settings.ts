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
  pricePer1kTokens: number;
  currentTokensSpent: number;
  maximumMonthlySpend: number;
  lastMonthlySpendReset: Date;
}

export const DEFAULT_SETTINGS: QuillSettings = {
	contextBeforeCursor: 100,
  contextBeforeCursorRange: ContextBeforeCursorRange.Characters,
  contextFileList: new ContextFileList(),
  pricePer1kTokens: 0.06,
  currentTokensSpent: 50000,
  maximumMonthlySpend: 130,
  lastMonthlySpendReset: new Date(),
}