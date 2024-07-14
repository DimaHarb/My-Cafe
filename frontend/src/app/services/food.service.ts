import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FOODS_BY_SEARCH_URL, FOODS_BY_TAG_URL, FOODS_TAGS_URL, FOODS_URL, FOOD_BY_ID_URL } from '../shared/constants/urls';
import { Food } from '../shared/models/Food';
import { Tag } from '../shared/models/Tag';
  
@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private favoriteItems: Food[] = [];
  private favoriteSubject: BehaviorSubject<Food[]> = new BehaviorSubject<Food[]>([]);

  constructor(private http: HttpClient) { }

  getAll(): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_URL);
  }

  getAllFoodsBySearchTerm(searchTerm: string): Observable<Food[]> {
    const lowercaseSearchTerm = searchTerm.toLowerCase();

    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + lowercaseSearchTerm)
      .pipe(
        catchError((error: any) => {
          console.error('Error in getAllFoodsBySearchTerm:', error);
          // Return an empty array or handle the error as needed
          return of([]);
        })
      );
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL);
  }

  getAllFoodsByTag(tag: string): Observable<Food[]> {
    return tag.toLowerCase() === "all" ?
      this.getAll() :
      this.http.get<Food[]>(FOODS_BY_TAG_URL + tag.toLowerCase());
  }

  getFoodById(foodId: string): Observable<Food> {
    return this.http.get<Food>(FOOD_BY_ID_URL + foodId);
  }

  addToFavorites(food: Food): void {
    if (!this.isInFavorites(food)) {
      this.favoriteItems.push(food);
      this.favoriteSubject.next([...this.favoriteItems]);
      console.log('Added to favorites:', food);
    }
  }
  
  removeFromFavorites(food: Food): void {
    this.favoriteItems = this.favoriteItems.filter((item) => item.id !== food.id);
    this.favoriteSubject.next([...this.favoriteItems]);
    console.log('Removed from favorites:', food);
  }
  
  getFavorites(): Observable<Food[]> {
    return this.favoriteSubject.asObservable();
  }
  
  isInFavorites(food: Food): boolean {
    const isInFavorites = this.favoriteItems.some((item) => item.id === food.id);
    console.log(`${food.name} is in favorites: ${isInFavorites}`);
    return isInFavorites;
  }

  toggleFavorite(food: Food): void {
    food.favorite = !food.favorite;

    // Update the favorite status in the service
    if (food.favorite) {
      this.addToFavorites(food);
    } else {
      this.removeFromFavorites(food);
    }
  }
}
