export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  userId: string;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  icon?: string;
  color?: string;
}
