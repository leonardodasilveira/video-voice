// src/run.ts
import 'dotenv/config'
import { personas } from './config/personas'
import { OpenAIScriptGenerator } from './core/services/OpenAIScriptGenerator'
import { OpenAITTSGenerator } from './core/services/OpenAITTSGenerator'
import { VideoCreationFlow } from './core/VideoCreationFlow'

const persona = personas.p1
const topic = 'introduce yourself as a maplestory content creator'

const apiKey = process.env.OPENAI_API_KEY!
const scriptGen = new OpenAIScriptGenerator(persona, apiKey)
const ttsGen = new OpenAITTSGenerator(apiKey)

const flow = new VideoCreationFlow(persona, scriptGen, ttsGen)
flow.create(topic)
