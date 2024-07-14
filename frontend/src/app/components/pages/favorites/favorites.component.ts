import { Component, OnInit } from '@angular/core';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteItems: Food[] = [];

  constructor(private foodService: FoodService) {}

  ngOnInit(): void {
    this.foodService.getFavorites().subscribe((favorites) => {
      this.favoriteItems = favorites;
    });
  }

  toggleFavorite(food: Food): void {
    this.foodService.toggleFavorite(food);
  }
}
