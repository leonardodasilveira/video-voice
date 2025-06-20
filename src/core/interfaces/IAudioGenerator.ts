import {IPersona} from "./IPersona";

export interface IAudioGenerator {
    generate(persona: IPersona, text: string, outputPath: string): Promise<void>
}
