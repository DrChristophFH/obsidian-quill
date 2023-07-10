import { EditorState } from '@codemirror/state';
import { Suggestion } from './Suggestion';

export type InlineFetchFn = (state: EditorState) => Promise<Suggestion>;