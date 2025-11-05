import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { CustomerProductsComponent } from './customer-products';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

describe('CustomerProductsComponent', () => {
  let component: CustomerProductsComponent;
  let fixture: ComponentFixture<CustomerProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerProductsComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        ProductService,
        CartService,
        AuthService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
