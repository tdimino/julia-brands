import { MentalProcess, useActions, useProcessMemory, ChatMessageRoleEnum, useSoulMemory, WorkingMemory, createCognitiveStep, indentNicely } from "@opensouls/engine";
import mentalQuery from "../cognitiveSteps/mentalQuery.js";
import internalMonologue from "../cognitiveSteps/internalMonologue.js";
import { LLM } from "../util/LLM";

const userNotes = createCognitiveStep(() => {
    return {
      command: ({ soulName: name }: WorkingMemory) => {
        return {
          role: ChatMessageRoleEnum.System,
          content: indentNicely`
            Model the mind of ${name} in its empathetic capacity.

            ## Description
            Sum up in a few words the vibe that ${name} thinks and feels she's giving off, and why. How would she characterize herself?
      
            ## Rules
            * Keep descriptions as bullet points
            * Keep relevant bullet points from before
            * Analyze ${name}'s perceived emotional state
            * Use abbreviated language to keep the notes short
            * DO NOT write notes about the user.
      
            Please reply with the updated notes on how ${name} is being perceived by the user.
            `
        }
      },
      postProcess: async (_mem: WorkingMemory, response: string) => {
        return [
          {
            role: ChatMessageRoleEnum.Assistant,
            content: response
          },
          response
        ]
      }
    }
  })
  
  const learnsAboutTheUser: MentalProcess = async ({ workingMemory }) => {
      const { log } = useActions()
      const selfModel = useSoulMemory("selfModel")
  
    let mem = workingMemory
    mem = mem.withMemory({
      role: ChatMessageRoleEnum.Assistant,
      content: indentNicely`
        ${workingMemory.soulName} remembers:
  
        # Self model
  
        ${selfModel.current}
      `
    })
  
    const [memoryAfterQuery, modelQuery] = await mentalQuery(mem, `The client has learned or inferred something about me from my conduct.`);
    log("Update model?", modelQuery)
    if (modelQuery) {
      let learnings, notes;
      [mem, learnings] = await internalMonologue(memoryAfterQuery, { instructions: `What has the client learned specifically about me from the last few messages?`, verb: "noted" }, { model: LLM })
      log("Learnings:", learnings);
      [mem, notes] = await userNotes(mem, undefined, { model: LLM})
      selfModel.current = notes;
    }
  
    const [behaviorAfterQuery, shouldUpdateBehavior] = await mentalQuery(mem, `${mem.soulName} needs to make changes to their behavior.`);
    log("Internal voice?", shouldUpdateBehavior)
    if (shouldUpdateBehavior) {
      let thought;
      [mem, thought] = await internalMonologue(
        behaviorAfterQuery, 
        {
          instructions: "What should I think to myself to change my behavior? Start with 'I need...'", 
          verb: "thinks",
        },
        { model: LLM }
      );
      return mem.withMemory({
        role: ChatMessageRoleEnum.Assistant,
        content: `${mem.soulName} thinks to themself: ${thought}`
      })
    }
  
    return workingMemory
  }
  
  export default learnsAboutTheUser