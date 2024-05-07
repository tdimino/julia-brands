import { MentalProcess, useActions, useSoulMemory, createCognitiveStep, indentNicely, ChatMessageRoleEnum, WorkingMemory } from "@opensouls/engine";
import internalMonologue from "../cognitiveSteps/internalMonologue";
import externalDialog from "../cognitiveSteps/externalDialog";
import mentalQuery from "../cognitiveSteps/mentalQuery";
import { LLM } from "../util/LLM";

const competitorNotes = createCognitiveStep(() => {
  return {
    command: ({ soulName: name }: WorkingMemory) => {
      return {
        role: ChatMessageRoleEnum.System,
        content: indentNicely`
          Model the mind of ${name}.

          ## Description
          Write an updated and clear set of notes on the competitor products. Deconstruct what each competitor is selling, the vibe of their brand, and how their product's name conveys this.

          ## Rules
          * Keep descriptions as bullet points
          * Keep relevant bullet points from before
          * Use abbreviated language to keep the notes short
          * Do not write any notes about ${name}

          Please reply with the updated notes on the competitor products:'
        `
      };
    },
    postProcess: async (_mem: WorkingMemory, response: string) => {
      return [
        {
          role: ChatMessageRoleEnum.Assistant,
          content: response,
        },
        response
      ];
    }
  }
});

const modelsTheThing: MentalProcess = async ({ workingMemory }) => {
  const competitorModel = useSoulMemory("Competitor products")
  const { speak, dispatch, log } = useActions()

  let memory = workingMemory
  memory = memory.withMemory({
    role: ChatMessageRoleEnum.Assistant,
    content: indentNicely`
    ${memory.soulName} remembers:

    # Competitor products

    ${competitorModel.current}
  `
  })

  const [memoryAfterQuery, modelQuery] = await mentalQuery(memory, `${memory.soulName} has learned about competitor products, so she'll update her mental model of them.`);
  log("Update model?", modelQuery)
  if (modelQuery) {
    let learnings, notes, name, rating;
    [memory, learnings] = await internalMonologue(memoryAfterQuery, { instructions: "What marketing insights could I extract from these competitors that would help us name our new beverage?", verb: "noted" })
    log("Learnings:", learnings);
    [memory, notes] = await competitorNotes(memory, undefined, { model: LLM })
    competitorModel.current = notes;
  }

  return workingMemory
}

export default modelsTheThing