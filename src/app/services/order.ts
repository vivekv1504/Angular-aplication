import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();
  private readonly STORAGE_KEY = 'sipstop_orders';
  private useBackend = true;

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.http.get<Order[]>(this.apiUrl).pipe(
      catchError(() => {
        console.log('⚠️ Backend not available for orders, using localStorage');
        this.useBackend = false;
        return of(this.getFromLocalStorage());
      })
    ).subscribe(orders => {
      this.ordersSubject.next(orders);
      this.saveToLocalStorage(orders);
      console.log('✅ Loaded orders:', orders.length);
    });
  }

  private getFromLocalStorage(): Order[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToLocalStorage(orders: Order[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  getOrderById(id: number): Observable<Order | undefined> {
    const orders = this.ordersSubject.value;
    return of(orders.find(o => o.id === id));
  }

  getOrdersByUserId(userId: number): Observable<Order[]> {
    const orders = this.ordersSubject.value;
    return of(orders.filter(o => o.userId === userId));
  }

  addOrder(order: Order): Observable<boolean> {
    console.log('📦 Attempting to save order:', order);
    console.log('🌐 Using backend:', this.useBackend);
    console.log('📍 API URL:', this.apiUrl);
    
    if (this.useBackend) {
      // Use backend API
      return this.http.post<any>(this.apiUrl, order).pipe(
        map(response => {
          console.log('✅ Order saved to backend successfully!');
          console.log('📦 Response from server:', response);
          this.loadOrders(); // Reload from backend
          return true;
        }),
        catchError(error => {
          console.error('❌ Failed to save order to backend:', error);
          console.error('❌ Error details:', error.message);
          console.log('💾 Falling back to localStorage...');
          return this.addOrderLocally(order);
        })
      );
    } else {
      console.log('💾 Backend not available, using localStorage');
      return this.addOrderLocally(order);
    }
  }

  private addOrderLocally(order: Order): Observable<boolean> {
    const currentOrders = this.ordersSubject.value;
    const newId = currentOrders.length > 0 
      ? Math.max(...currentOrders.map(o => o.id)) + 1 
      : 1;
    
    const newOrder = { ...order, id: newId };
    const updatedOrders = [...currentOrders, newOrder];
    
    this.saveToLocalStorage(updatedOrders);
    this.ordersSubject.next(updatedOrders);
    
    console.log('✅ Order placed (localStorage):', newOrder);
    return of(true);
  }

  getAllOrdersCount(): number {
    return this.ordersSubject.value.length;
  }
}
