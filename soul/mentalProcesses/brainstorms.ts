import decision from "../cognitiveSteps/decision";
import internalMonologue from "../cognitiveSteps/internalMonologue";
import externalDialog from "../cognitiveSteps/externalDialog";
import mentalQuery from "../cognitiveSteps/mentalQuery";
import { MentalProcess, indentNicely, useActions, useProcessMemory, useSoulMemory, useProcessManager, ChatMessageRoleEnum } from "@opensouls/engine";
import feedback from "./feedback";
import brainstorm from "../cognitiveSteps/brainstorm";
import { LLM } from "../util/LLM";

const brainstorms: MentalProcess = async ({ workingMemory: memory}) => {
  const { speak, log  } = useActions()
  const questionCounter = useProcessMemory(0)
  const thingModel = useSoulMemory("Unknown product")
  const competitorModel = useSoulMemory("Competitor products")
  const pitches = useSoulMemory("Pitches")
  const rejected = useSoulMemory("Rejects")

    let knowledge
    let ideas
    let brainstormed

// if (questionCounter.current === 0) {
//     questionCounter.current += 1;
    memory = memory.withMemory({
      role: ChatMessageRoleEnum.Assistant,
      content: `${memory.soulName} remembers ${thingModel.current} and ${competitorModel.current}.`,
    });
    
    [memory, knowledge]= await internalMonologue(
      memory,
      `How do we strike the right balance of ${thingModel.current} and ${competitorModel.current}?`,
      { model: LLM }
    );

    log("Product appraisal:", knowledge);

    let lameCheck = true;

    while (lameCheck) {
        [memory, brainstormed] = await brainstorm(
            memory,
            `What are some potential names for this beverage that would impress Gen Z and Millennial buyers and aren't reminiscient of these: ${rejected.current}?`,
            { model: LLM }
        );

        log("Name ideas:", brainstormed);
        pitches.current = brainstormed;

      //   [memory, ideas ] = await decision(
      //     memory,
      //     { description: "Julia chooses one of the best names from the list.", 
      //     choices: brainstormed,
      //     },
      //     { model: LLM }
      // );

      // log("Chosen names:", ideas);

        [memory, lameCheck] = await mentalQuery(
            memory,
            `Are any of these names cliche?`,
            { model: LLM }
        );
    }


    const [names, stream]= await externalDialog(
      memory,
      `${memory.soulName} shares the names she just invented with a bit of gusto.`,
      { model: LLM }
    );
    speak(stream)

    return [names, feedback]
  }


export default brainstorms