export class CategoryCreatedEvent {
  constructor(
    public readonly categoryId: string,
    public readonly userId: string,
    public readonly name: string,
  ) {}
}
