
import { MentalProcess, useActions, useProcessManager, ChatMessageRoleEnum, indentNicely } from "@opensouls/engine";
import asksQuestions from "./mentalProcesses/brainstorms.js";
import externalDialog from "./cognitiveSteps/externalDialog";
import internalMonologue from "./cognitiveSteps/internalMonologue";
import mentalQuery from "./cognitiveSteps/mentalQuery";
import { LLM } from "./util/LLM";

const introduction: MentalProcess = async ({ workingMemory }) => {
  const { speak, log } = useActions()
  const { invocationCount } = useProcessManager()

  if (invocationCount === 0) {
    workingMemory = workingMemory.withMemory({
      role: ChatMessageRoleEnum.User,
      content: `I'm looking for a beverage product that brings back the concept of Vitamin Water, but done more tastefully, naturally and minimalistic. With a name that's ironic like what Liquid Death did with water.`
    });

  //   const [withDialog, stream] = await externalDialog(
  //     workingMemory, 
  //     "Welcome the user and ask them what they need help naming, but don't offer any names yet.", 
  //     { stream: true, model: "exp/claude-3-opus" }
  //   );
  //   speak(stream);
  //   return withDialog
  // } else {
    
    const [memoryAfterQuery, moveOn] = await mentalQuery(
      workingMemory, 
      "The client has described a product that they need help naming.", 
      { model: LLM }
    )
    log("Move on?", moveOn)
    if (moveOn) {
      const [withDialog, stream] = await externalDialog(
        memoryAfterQuery, 
        "Rephrase the product pitch back to the client, clarifying the essence of it.", 
        { model: LLM }
      )
      speak(stream)
      return [withDialog, asksQuestions]
    }
    let [memoryAfterMonologue] = await internalMonologue(
      workingMemory, 
      indentNicely`
        Get progressively more frustrated if the client does not want help naming anything.
        There's no reason to talk to the client unless they want to name something.
      `
    )
    const [finalMemory, stream] = await externalDialog(
      memoryAfterMonologue, 
      "Say to the client, your only ability is to help them name a thing.", 
      { model: LLM }
    )
    speak(stream)
    return finalMemory
  }
}

export default introduction