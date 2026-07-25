export class CreateCategoryCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly icon?: string,
    public readonly color?: string,
  ) {}
}
