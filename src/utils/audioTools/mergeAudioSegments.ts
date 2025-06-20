import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs/promises'
import path from 'path'

ffmpeg.setFfmpegPath('/usr/bin/ffmpeg') // ajuste se estiver em outro caminho

export async function mergeAudioSegments(inputFiles: string[], outputFile: string): Promise<void> {
    const listPath = path.join(path.dirname(outputFile), 'concat-list.txt')
    const listContent = inputFiles.map(file => `file '${file}'`).join('\n')

    await fs.writeFile(listPath, listContent)

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(listPath)
            .inputOptions(['-f', 'concat', '-safe', '0'])
            .outputOptions('-c', 'copy')
            .output(outputFile)
            .on('end', () => {
                console.log(`✅ Merged audio saved to: ${outputFile}`)
                resolve()
            })
            .on('error', (err, stdout, stderr) => {
                console.error('❌ FFmpeg merge error:', err.message)
                console.error('STDOUT:\n', stdout)
                console.error('STDERR:\n', stderr)
                reject(err)
            })
            .run()
    })
}
