// src/core/VideoCreationFlow.ts
import { IPersona } from './interfaces/IPersona'
import { IScriptGenerator } from './interfaces/IScriptGenerator'
import { IAudioGenerator } from './interfaces/IAudioGenerator'
import { generateSRT } from './services/subtitleGenerator'
import { mergeVideoAudioSubtitles } from './services/videoAssembler'
import path from 'path'
import fs from 'fs/promises'

export class VideoCreationFlow {
    constructor(
        private readonly persona: IPersona,
        private readonly scriptGen: IScriptGenerator,
        private readonly ttsGen: IAudioGenerator
    ) {}

    async create(topic: string) {
        const script = await this.scriptGen.generate(topic)

        const outputBase = path.resolve('output')
        const audioDir = path.join(outputBase, 'audios')
        const subtitleDir = path.join(outputBase, 'subtitles')
        const videoDir = path.join(outputBase, 'videos')
        const scriptDir = path.join(outputBase, 'scripts')

        await Promise.all([
            fs.mkdir(audioDir, { recursive: true }),
            fs.mkdir(subtitleDir, { recursive: true }),
            fs.mkdir(videoDir, { recursive: true }),
            fs.mkdir(scriptDir, { recursive: true })
        ])

        const videoPath = 'src/video-recordings/2025-06-19 02-54-52.mkv'

        const audioPath = path.join(audioDir, `${this.persona.id}.mp3`)
        const srtPath = path.join(subtitleDir, `${this.persona.id}.srt`)
        const finalOutputPath = path.join(videoDir, `${this.persona.id}.mp4`)

        await fs.writeFile(path.join(scriptDir, `${this.persona.id}.txt`), script)

        await generateSRT(script, srtPath)
        await this.ttsGen.generate(this.persona, script, audioPath)

        await mergeVideoAudioSubtitles({
            videoPath,
            audioPath,
            subtitlesPath: srtPath,
            outputPath: finalOutputPath,
        })
    }
}
