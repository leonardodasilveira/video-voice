import OpenAI from 'openai'
import { IScriptGenerator } from '../interfaces/IScriptGenerator'
import { IPersona } from '../interfaces/IPersona'

export class OpenAIScriptGenerator implements IScriptGenerator {
    private readonly openai: OpenAI
    private readonly persona: IPersona

    constructor(persona: IPersona, apiKey: string) {
        this.persona = persona
        this.openai = new OpenAI({ apiKey })
    }

    async generate(topic: string): Promise<string> {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: this.persona.systemPrompt },
                { role: 'user', content: `Create a short narration script (max 120 words) about: ${topic}` },
            ],
        })

        const content = response.choices[0].message.content?.trim() || ''
        return `${this.persona.introPhrase}\n\n${content}\n\n${this.persona.outroPhrase}`
    }
}
