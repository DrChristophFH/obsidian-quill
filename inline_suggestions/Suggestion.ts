export type Suggestion = {
	complete_suggestion: string;
	display_suggestion: string;
	accept_hook?: () => void;
};