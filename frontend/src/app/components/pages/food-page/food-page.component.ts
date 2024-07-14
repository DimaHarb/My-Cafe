import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { UserService } from 'src/app/services/user.service'; // Import UserService
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-food-page',   
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css']
})
export class FoodPageComponent implements OnInit {
  food!: Food;
  isLoggedIn: boolean = false; // Add a property to track login status

  constructor(
    private activatedRoute: ActivatedRoute,
    private foodService: FoodService,
    private cartService: CartService,
    private userService: UserService, // Inject UserService
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        this.foodService.getFoodById(params.id).subscribe((serverFood) => {
          this.food = serverFood;
        });
      }
    });

    // Subscribe to the userObservable to track login status
    this.userService.userObservable.subscribe(user => {
      this.isLoggedIn = !!user.token;
    });
  }

  toggleFavorite(food: Food): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']); // Redirect to login page
      return;
    }

    food.favorite = !food.favorite;
  
    if (food.favorite) {
      this.foodService.addToFavorites(food);
    } else {
      this.foodService.removeFromFavorites(food);
    }
  }

  addToCart(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']); // Redirect to login page
      return;
    }

    this.cartService.addToCart(this.food);
    this.router.navigateByUrl('/cart-page');
  }
}
