import { ContextFileList } from "gpt/ContextFiles";

export enum ContextBeforeCursorRange {
  Characters = 'characters',
  Sentence = 'sentence',
  Paragraph = 'paragraph',
  Section = 'section',
}

export interface RewritePrompt {
  name: string;
  prompt: string;
  enabled: boolean;
}

export interface QuillSettings {
  apiKey: string;
	contextBeforeCursor: number;
  contextBeforeCursorRange: ContextBeforeCursorRange;
  contextFileList: ContextFileList; 
  pricePer1kTokens: number;
  currentTokensSpent: number;
  maximumMonthlySpend: number;
  lastMonthlySpendReset: Date;
  rewritePrompts: RewritePrompt[];
}

export const DEFAULT_SETTINGS: QuillSettings = {
  apiKey: '',
	contextBeforeCursor: 100,
  contextBeforeCursorRange: ContextBeforeCursorRange.Characters,
  contextFileList: new ContextFileList(),
  pricePer1kTokens: 0.06,
  currentTokensSpent: 50000,
  maximumMonthlySpend: 130,
  lastMonthlySpendReset: new Date(),
  rewritePrompts: [],
}