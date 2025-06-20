import fs from 'fs/promises'

function formatTime(seconds: number): string {
    const date = new Date(0)
    date.setSeconds(seconds)
    return date.toISOString().substr(11, 8) + ',000'
}

export async function generateSRT(script: string, outputPath: string) {
    const lines = script
        .replace(/\n+/g, '\n')              // remove extra empty lines
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('[')) // skip [PAUSE] lines if any

    const srtLines: string[] = []
    let startTime = 0
    let index = 1

    for (const line of lines) {
        const wordCount = line.split(/\s+/).length
        const duration = Math.max(2, wordCount / 3) // ~3 words per second, min 2s

        const endTime = startTime + duration
        srtLines.push(`${index}`)
        srtLines.push(`${formatTime(startTime)} --> ${formatTime(endTime)}`)
        srtLines.push(line)
        srtLines.push('') // empty line

        startTime = endTime
        index++
    }

    await fs.writeFile(outputPath, srtLines.join('\n'))
    console.log(`✅ Subtitles saved to: ${outputPath}`)
}
