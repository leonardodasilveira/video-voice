import {personas} from '../config/personas'
import {OpenAITTSGenerator} from '../core/services/OpenAITTSGenerator'
import path from 'path'
import {mergeAudioSegments} from "../utils/audioTools/mergeAudioSegments";

const outputDir = path.resolve('output')

async function runIntro() {
    const apiKey = process.env.OPENAI_API_KEY!
    const tts = new OpenAITTSGenerator(apiKey)

    const introLines = [
        {
            personaId: 'p1',
            line: "Hey there! I'm Kai, and I'll be your guide through the leveling process.",
        },
        {
            personaId: 'p2',
            line: "And I'm Lune! I'’'ll chime in with tips, tricks, and all the good stuff you shouldn’t miss.",
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
        const fileName = path.join(outputDir, `intro-${personaId}.mp3`)
        await tts.generate(personas[personaId], line, fileName)
        segments.push(fileName)
    }

    await mergeAudioSegments(segments, path.join(outputDir, 'intro-final.mp3'))
    console.log('✅ Intro audio created: intro-final.mp3')
}

runIntro().catch(console.error)
