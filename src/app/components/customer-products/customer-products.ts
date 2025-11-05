import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { Product } from '../../models/product';

@Component({
  selector: 'app-customer-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './customer-products.html',
  styleUrls: ['./customer-products.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  categories: string[] = ['all'];
  cartCount: number = 0;
  userName: string = '';
  showSuccessMessage: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'Customer';

    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
      
      // Extract unique categories
      const uniqueCategories = new Set(products.map(p => p.category));
      this.categories = ['all', ...Array.from(uniqueCategories)];
    });

    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = this.cartService.getCartCount();
    });
  }

  filterProducts(): void {
    let filtered = this.products;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    this.filteredProducts = filtered;
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  addToCart(product: Product): void {
    if (product.stock > 0) {
      // Check if product already in cart and if adding one more would exceed stock
      const currentCartItems = this.cartService['cartItemsSubject'].value;
      const existingItem = currentCartItems.find((item: any) => item.product.id === product.id);
      
      if (existingItem) {
        const totalQuantityAfterAdd = existingItem.quantity + 1;
        if (totalQuantityAfterAdd > product.stock) {
          alert(`Cannot add more. Only ${product.stock} items available for ${product.name}`);
          return;
        }
      }
      
      this.cartService.addToCart(product, 1);
      console.log(`✅ Added ${product.name} to cart. Stock available: ${product.stock}`);
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 2000);
    } else {
      alert(`${product.name} is currently out of stock`);
    }
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onImageError(event: any): void {
    // Fallback image if the original fails to load
    event.target.src = 'https://via.placeholder.com/400x400/667eea/ffffff?text=Product+Image';
  }
}
