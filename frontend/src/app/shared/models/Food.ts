export class Food {
    id!: string;
    name!: string;
    price!: number;
    tags?: string[];
    favorite?: boolean;
    stars: number = 0;
    imageUrl!: string;
    origins!: string[];
    cookTime!: string;
  }
  