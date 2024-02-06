import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Supplier } from '../../suppliers/supplier';
import { Product } from '../product';
import { catchError, EMPTY, Subject, map, combineLatest, filter } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private errorMessageSubject = new Subject<string>();
  errorMessageAction$ = this.errorMessageSubject.asObservable();
  
  product$ = this.productService.selectedProduct$
  .pipe(
    catchError(i => {
      this.errorMessageSubject.next(i);
      return EMPTY;
    })
  );

  pageTitle$ = this.product$.pipe(
    map(p => p ? `Product Detail for: ${p.productName}` : null)
  );

  productSuppliers$ = this.productService.selectedProductSupplier$
  .pipe(
    catchError(i => {
      this.errorMessageSubject.next(i);
      return EMPTY;
    })
  );

  vm$ = combineLatest(
    this.product$,
    this.pageTitle$,
    this.productSuppliers$
  ).pipe(
    filter(([product]) => Boolean(product)),
    map(([product, pageTitle, supplier]) => ({product, pageTitle, supplier}))
  );
  
  constructor(private productService: ProductService) { }

}
