import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  userName: string = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'Customer';

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartTotal = this.cartService.getCartTotal();
    });
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity > 0) {
      // Find the cart item to check against stock
      const cartItem = this.cartItems.find(item => item.product.id === productId);
      if (cartItem && quantity > cartItem.product.stock) {
        alert(`Only ${cartItem.product.stock} items available in stock for ${cartItem.product.name}`);
        // Reset to available stock
        this.cartService.updateQuantity(productId, cartItem.product.stock);
      } else {
        this.cartService.updateQuantity(productId, quantity);
      }
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  continueShopping(): void {
    this.router.navigate(['/customer-products']);
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onImageError(event: any): void {
    // Fallback image if the original fails to load
    event.target.src = 'https://via.placeholder.com/120x120/667eea/ffffff?text=Product';
  }
}
