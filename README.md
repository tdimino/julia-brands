# Julia Brands

**Soul Designer:** [@tdimino](https://github.com/tdimino)

## Intro

**Behold! This Platonic soul, a muse of nomenclature. You shall engage in discourse most true, exchanging verbs 'til a name doth emerge, as one doth strikes the heart with singular allure. 'Tis a quest fraught with unexpected turns, yet therein lies the charm of it.**

- Artifex Maximus

<img src="./julia-brands.png" alt="Julia-brands" width="400">

### Summary

Julia Brands demonstrates the cognitive flow that results in a fresh and novel product name. She harmonizes her thoughts around internal models of the product you're trying to name, as well as any models of any competitors you've invoked. As she generates ideas, she self-critiques, before verbalizing some of her 'best ideas.' She then switches gears (or goes into a separate mental process) where she seeks your approval and gathers feedback on the last batch of names generated.

### Detailed Process Flow

1. **Initial Interaction (`soul/initialProcess.ts`)**:
   - Begins with capturing the user's initial product description.
   - Engages the user with a rephrased product pitch to clarify understanding.
   - If necessary, expresses frustration subtly to encourage more specific naming requests from the user.

2. **Brainstorming Names (`soul/mentalProcesses/brainstorms.ts`)**:
   - Remembers and utilizes details about the product and competitors to brainstorm names.
   - Iteratively generates name ideas while checking for cliches until a satisfactory list is developed.
   - Presents the brainstormed names with enthusiasm to gauge user reaction.

3. **Gathering Feedback (`soul/mentalProcesses/feedback.ts`)**:
   - Collects user feedback on the proposed names.
   - Determines whether the names were rejected or accepted, and why, to refine the list of suggestions.
   - Loops back to brainstorming if necessary, using the insights gained from user feedback.

### Subprocesses

- **Modeling the Product (`soul/subprocesses/modelsTheThing.ts`)**:
  - Updates the internal model of the product based on new information and insights gathered during interactions.
  - Uses cognitive steps to refine and articulate the product's description and unique selling points.

- **Modeling Competitors (`soul/subprocesses/modelsTheCompetitor.ts`)**:
  - Analyzes and updates the internal model of competitor products.
  - Focuses on understanding competitors' branding and product positioning to better differentiate the user's product.

- **Reflecting on Self-Perception (`soul/subprocesses/reflectsAboutTheSelf.ts`)**:
  - Updates the soul's self-model based on interactions and feedback from the user.
  - Adjusts behavior and responses based on how the soul perceives it is being perceived by the user.

### Running the Soul

To activate and run this soul in your local environment, navigate to this directory and execute:

```bash
npx soul-engine dev
```

## 🔑 Getting Soul Engine access
1. Join the [OPEN SOULS Discord](http://discord.gg/opensouls)
1. That's it! Now you can login to the Soul Engine with Discord auth when running `npx soul-engine dev`

Make sure to checkout the [Soul Engine guide](https://docs.souls.chat)!
