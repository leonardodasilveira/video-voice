import 'dotenv/config'
import path from 'path'
import fs from 'fs/promises'
import {personas} from "./config/personas";
import {OpenAIScriptGenerator} from "./core/services/OpenAIScriptGenerator";
import {OpenAITTSGenerator} from "./core/services/OpenAITTSGenerator";
import { generateSRT } from './core/services/subtitleGenerator.js'
import {mergeVideoAudioSubtitles} from "./core/services/videoAssembler";

const personaId = "p1"
const topic = "introduce yourself as a maplestory content creator"

if (!personaId || !topic) {
    console.error('❌ Usage: ts-node run.ts <personaId> <topic>')
    process.exit(1)
}

const persona = personas[personaId]
if (!persona) {
    console.error(`❌ Unknown persona: ${personaId}`)
    process.exit(1)
}

const apiKey = process.env.OPENAI_API_KEY!
const scriptGen = new OpenAIScriptGenerator(persona, apiKey)
const ttsGen = new OpenAITTSGenerator(apiKey)

const finalScript = `
Hello! Once we pass level 200, the easy path of questing fades, and Arcane River introduces something new — the grind.

For many players, this is their first real training wall, so let’s take a moment to prepare — not just your character, but yourself as well.

Get into comfortable clothes, grab some water, use the bathroom, and have snacks ready. Play some music, a movie, or your favorite YouTuber in the background — whatever keeps you focused but not bored.

Training can get repetitive, and staying mentally relaxed helps the time pass faster.

In Arcane River, some major zone has sections gated by level. At 200, your goal is to reach 205 — that’s when Reverse City unlocks.

Khali has great mobility, which lets you use maps that are inefficient for most classes. Take advantage of that.

Focus on finding burning stages — they’ll dramatically improve your EXP per hour.

I recommend breaking your grind into 30-minute sessions. Use your EXP coupons as timers, and always keep your Battle Analyzer running.

Just remember: entering event content like Frito’s portals will pause the analyzer — so take note.

With that out of the way, let’s look at the best maps.
`
async function run() {
    const script = finalScript || await scriptGen.generate(topic)
    await generateSRT(script, 'output.kai.leveling.200-205.srt')
    console.log('\n📝 SCRIPT:\n', script)
    await ttsGen.generate(persona, script, `./output-${personaId}.mp3`)
    const outputDir = path.resolve('output')
    await fs.mkdir(outputDir, { recursive: true })
    const outputPath = path.resolve('output/kai-200-205.mp4')
    await mergeVideoAudioSubtitles({
        videoPath: 'src/video-recordings/2025-06-19 02-54-52.mkv',
        audioPath: 'output-p1.mp3',
        subtitlesPath: 'output.kai.leveling.200-205.srt',
        outputPath,
    })
}

run()
