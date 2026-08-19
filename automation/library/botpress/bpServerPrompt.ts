export class BPServerPrompt {
  prompt: string
  responses: string[]

  constructor(prompt: string, responses: string[] = []) {
    this.prompt = prompt
    this.responses = responses
  }
}
