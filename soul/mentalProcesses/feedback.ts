import decision from "../cognitiveSteps/decision";
import internalMonologue from "../cognitiveSteps/internalMonologue";
import externalDialog from "../cognitiveSteps/externalDialog";
import mentalQuery from "../cognitiveSteps/mentalQuery";
import { MentalProcess, indentNicely, useActions, useProcessMemory, useSoulMemory, useProcessManager, ChatMessageRoleEnum } from "@opensouls/engine";
import brainstorms from "./brainstorms";
import { LLM } from "../util/LLM";

const reviewsFeedback: MentalProcess = async ({ workingMemory: memory}) => {
  const { speak, log  } = useActions()
  const pitches = useSoulMemory("Pitches")
  const rejected = useSoulMemory("Rejects", "")
  let moveOn
  let stream

if (pitches.current) {
    [memory, moveOn] = await mentalQuery(
        memory,
        `Did the client reject all of these names: ${pitches.current}?`,
        { model: LLM }
    );
    
    if (moveOn) {
        rejected.current = `${pitches.current}`;

        [memory, stream] = await externalDialog(
            memory, 
            "Ask the client what they disliked about this name.", 
            { model: LLM }
          )
          speak(stream)
          return [memory, brainstorms]
    }

    else {
        [memory, stream] = await externalDialog(
            memory, 
            "Ask the client what they liked about this name.", 
            { model: LLM }
          )
          speak(stream)
          return memory
    }
    }    
}
    
    export default reviewsFeedback
    

