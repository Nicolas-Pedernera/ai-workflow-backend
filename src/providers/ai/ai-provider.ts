export interface AIProvider {
  generate(input: string): Promise<string>;
}
