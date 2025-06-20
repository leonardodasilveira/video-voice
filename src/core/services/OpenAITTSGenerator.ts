import OpenAI from 'openai'
import { IPersona } from '../interfaces/IPersona'
import { IAudioGenerator } from '../interfaces/IAudioGenerator'
import * as fs from "node:fs";

export class OpenAITTSGenerator implements IAudioGenerator {
    private readonly openai: OpenAI
    // private readonly voice: string

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey })
    }

    async generate(persona: IPersona, text: string, outputPath: string): Promise<void> {
        const input = this.parseCustomTagsToSSML(text)

        const result = await this.openai.audio.speech.create({
            model: 'tts-1',
            voice: persona.voice,
            input,
            response_format: 'mp3',
            // Automatically detects SSML by looking at input
        })

        const buffer = Buffer.from(await result.arrayBuffer())
        fs.writeFileSync(outputPath, buffer)
        console.log(`✅ Audio saved to: ${outputPath}`)
    }

    /**
     * Replaces [PAUSE] or [PAUSE:2s] with <break time="X"/>
     * Wraps the entire content in <speak> if not already SSML
     */
    private parseCustomTagsToSSML(text: string): string {
        const pausePattern = /\[PAUSE(?::(\d+(?:\.\d*)?)s?)?\]/gi
        const converted = text.replace(pausePattern, (_, seconds) => {
            const time = seconds ?? '1.5'
            return `<break time="${time}s"/>`
        })

        const needsWrapping = !converted.trim().startsWith('<speak>')
        return needsWrapping ? `<speak>${converted}</speak>` : converted
    }
}
