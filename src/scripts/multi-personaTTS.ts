import { personas } from '../config/personas'
import { OpenAITTSGenerator } from '../core/services/OpenAITTSGenerator'
import path from 'path'
import fs from 'fs/promises'
import { mergeAudioSegments } from "../utils/audioTools/mergeAudioSegments"

const outputBase = path.resolve('output')
const audioDir = path.join(outputBase, 'audios')

async function runIntro() {
    const apiKey = process.env.OPENAI_API_KEY!
    const tts = new OpenAITTSGenerator(apiKey)

    await fs.mkdir(audioDir, { recursive: true })

    const introLines = [
        {
            personaId: 'p1',
            line: "Hey there! I'm Kai, and I'll be your guide through the leveling process.",
        },
        {
            personaId: 'p2',
            line: "And I'm Lune! I'll chime in with tips, tricks, and all the good stuff you shouldn’t miss.",
        },
        {
            personaId: 'p3',
            line: "I'm Orion. I focus on context, history, and a broader view of the game.",
        },
        {
            personaId: 'p1',
            line: "Together, we'll make sure your Maple journey is both fun and efficient. Let’s go!",
        },
    ]

    const segments: string[] = []

    for (const { personaId, line } of introLines) {
        const filePath = path.join(audioDir, `intro-${personaId}.mp3`)
        await tts.generate(personas[personaId], line, filePath)
        segments.push(filePath)
    }

    const finalOutputPath = path.join(audioDir, 'intro-final.mp3')
    await mergeAudioSegments(segments, finalOutputPath)
    console.log('✅ Intro audio created at:', finalOutputPath)
}

runIntro().catch(console.error)
