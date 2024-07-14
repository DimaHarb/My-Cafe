import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/shared/models/Cart';
import { CartItem } from 'src/app/shared/models/CartItem';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cart!: Cart;
  constructor(private cartService: CartService) {
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    });
  }

  ngOnInit(): void {}

  removeFromCart(cartItem: CartItem): void {
    this.cartService.removeFromCart(cartItem.food.id);
  }

  incrementQuantity(cartItem: CartItem): void {
    this.cartService.changeQuantity(cartItem.food.id, cartItem.quantity + 1);
  }

  decrementQuantity(cartItem: CartItem): void {
    if (cartItem.quantity > 1) {
      this.cartService.changeQuantity(cartItem.food.id, cartItem.quantity - 1);
    }
  }
}
