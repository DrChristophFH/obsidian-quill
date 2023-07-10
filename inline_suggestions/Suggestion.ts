export type Suggestion = {
	suggestionText: string;
	acceptHook?: () => void;
};