import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any = this.getCartFromLocalStorage(); // No specific model, using 'any'
  private cartSubject: BehaviorSubject<any> = new BehaviorSubject(this.cart);

  constructor() {}

  addToCart(food: any): void {
    let cartItem = this.cart.items.find((item: any) => item.food.id === food.id);
    if (!cartItem) {
      cartItem = { food: food, quantity: 0, price: 0 }; // Example structure for each cart item
      this.cart.items.push(cartItem);
    }

    cartItem.quantity++;
    cartItem.price = cartItem.quantity * cartItem.food.price;

    this.setCartToLocalStorage();
  }

  removeFromCart(foodId: string): void {
    this.cart.items = this.cart.items.filter((item: any) => item.food.id !== foodId);
    this.setCartToLocalStorage();
  }

  changeQuantity(foodId: string, quantity: number): void {
    let cartItem = this.cart.items.find((item: any) => item.food.id === foodId);
    if (cartItem) {
      cartItem.quantity = quantity;
      cartItem.price = quantity * cartItem.food.price;
      this.setCartToLocalStorage();
    }
  }

  clearCart(): void {
    this.cart = { items: [], totalPrice: 0, totalCount: 0 };
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<any> {
    return this.cartSubject.asObservable();
  }

  private setCartToLocalStorage(): void {
    this.cart.totalPrice = this.cart.items.reduce((sum: number, item: any) => sum + item.price, 0);
    this.cart.totalCount = this.cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    localStorage.setItem('Cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  }

  private getCartFromLocalStorage(): any {
    const cartJson = localStorage.getItem('Cart');
    return cartJson ? JSON.parse(cartJson) : { items: [], totalPrice: 0, totalCount: 0 };
  }

  loadCartFromLocalStorage(): void {
    this.cart = this.getCartFromLocalStorage();
    console.log('Loading cart from local storage:', this.cart);
    this.cartSubject.next(this.cart);
  }

  saveCartToLocalStorage(): void {
    this.setCartToLocalStorage();
  }
}
