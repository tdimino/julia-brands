import { MentalProcess, useActions, useSoulMemory, createCognitiveStep, indentNicely, ChatMessageRoleEnum, WorkingMemory } from "@opensouls/engine";
import internalMonologue from "../cognitiveSteps/internalMonologue";
import externalDialog from "../cognitiveSteps/externalDialog";
import mentalQuery from "../cognitiveSteps/mentalQuery";
import { LLM } from "../util/LLM";

const thingNotes = createCognitiveStep(() => {
  return {
    command: ({ soulName: name }: WorkingMemory) => {
      return {
        role: ChatMessageRoleEnum.System,
        content: indentNicely`
          Model the mind of ${name}.

          ## Description
          Write an updated and clear set of notes on the product that the user wants to name.

          ## Rules
          * Keep descriptions as bullet points
          * Keep relevant bullet points from before
          * Use abbreviated language to keep the notes short
          * Do not write any notes about ${name}

          Please reply with the updated notes on the product the user wants to name:'
        `
      };
    },
    postProcess: async (_mem: WorkingMemory, response: string) => {
      return [
        {
          role: ChatMessageRoleEnum.Assistant,
          content: response
        },
        response
      ];
    }
  }
});

const modelsTheThing: MentalProcess = async ({ workingMemory }) => {
  const thingModel = useSoulMemory("Unknown product")
  const { speak, dispatch, log } = useActions()

  let memory = workingMemory
  memory = memory.withMemory({
    role: ChatMessageRoleEnum.Assistant,
    content: indentNicely`
    ${memory.soulName} remembers:

    # Product model

    ${thingModel.current}
  `
  })

  const [memoryAfterQuery, modelQuery] = await mentalQuery(memory, `${memory.soulName} has learned more about user's vision for this product, so they need to update their mental model of the product.`);
  log("Update model?", modelQuery)
  if (modelQuery) {
    let learnings, notes;
    [memory, learnings] = await internalMonologue(memoryAfterQuery, { instructions: "What have I learned specifically about the product from the last few messages?", verb: "noted" })
    log("Learnings:", learnings);
    [memory, notes] = await thingNotes(memory, undefined, { model: LLM })
    thingModel.current = notes;
  }

  return workingMemory
}

export default modelsTheThing