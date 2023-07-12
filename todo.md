# Context settings:
- TODO add command to set a specific note as context for prompt @context
- TODO add special character sequence to enable comments in context files @context
- TODO add setting to set context length for text before cursor @context
- TODO add setting to set context length to sentence or paragraph or section (section is till the last heading) @context
- TODO add setting to see context files @context
- TODO add setting to set and remove context files @context
- TODO add setting to set price limit based on estimated price of prompts @context
- TODO add adjectives list to set task for rewrite command (reduce, rephrase, expand, detail, etc.) @context
# Commands:
- TODO add command to let gpt compress context files @commands
- TODO add command to let gpt rewrite selected text without context files (shallow rewrite) @commands
- TODO add command to let gpt rewrite selected text with context files (deep rewrite) @commands
  - the rewrite command task (reduce, rephrase, expand, detail, etc.) are determined by the adjectives list @commands
- TODO add commands to context menu (right click on selected text) @commands
# Model settings:
- TODO add settings for api key (hidden via password field) @commands
- TODO add settings for model parameters @commands
# Side Tab view (right side of obsidian):
- TODO add show and edit for important settings that change frequently (context files, context length, model parameters) @commands
  - keep context files in a list with enabled/disabled toggle and remove button for fast configuration
- TODO add token estimate for context to side tab view (based on OpenAI estimate function) @commands
- TODO add price estimate for context to side tab view (based on token estimate and configurable api price) @commands
- TODO add request statistics to side tab view (how many requests sent, how many tokens used) @commands