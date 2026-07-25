export class CategoryUpdatedEvent {
  constructor(
    public readonly categoryId: string,
    public readonly userId: string,
    public readonly name: string,
  ) {}
}
