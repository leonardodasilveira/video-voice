export interface IScriptGenerator {
    generate(topic: string): Promise<string>
}
