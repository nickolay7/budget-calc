export class CategoryDeletedEvent {
  constructor(
    public readonly categoryId: string,
    public readonly userId: string,
  ) {}
}
