import ffmpeg from 'fluent-ffmpeg'
import { execSync } from 'child_process'

ffmpeg.setFfmpegPath('/usr/bin/ffmpeg') // Linux default path

export async function mergeVideoAudioSubtitles({
                                                   videoPath,
                                                   audioPath,
                                                   subtitlesPath,
                                                   outputPath,
                                               }: {
    videoPath: string
    audioPath: string
    subtitlesPath?: string
    outputPath: string
}): Promise<void> {
    return new Promise((resolve, reject) => {
        const command = ffmpeg(videoPath)
            .addInput(audioPath)
            .videoCodec('libx264') // ✅ Agora podemos aplicar filtros como legendas
            .outputOptions('-c:a aac')  // Encode audio in AAC
            .outputOptions('-map', '0:v:0', '-map', '1:a:0') // ✅ correto!
            .format('mp4') // 👈 force mp4 output format
            .on('end', () => {
                console.log(`✅ Final video saved to: ${outputPath}`)
                resolve()
            })
            .on('error', (err) => {
                console.error('❌ FFmpeg error:', err.message)
                reject(err)
            })

        command
            .on('start', cmd => console.log('🎬 FFmpeg start:\n', cmd))
            .on('stderr', line => console.log('⚙️ FFmpeg stderr:', line))
            .on('error', (err, stdout, stderr) => {
                console.error('❌ FFmpeg error:', err.message)
                console.error('STDOUT:\n', stdout)
                console.error('STDERR:\n', stderr)
            })

        if (subtitlesPath) {
            command.videoFilter(`subtitles='${subtitlesPath.replace(/'/g, "'\\''")}':charenc=UTF-8`)
        }

        command.save(outputPath)
    })
}
