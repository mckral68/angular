import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from 'app/services/common/models/product.service';
import { SimpleProduct } from 'app/contracts/simpleProduct';
import { FormsModule } from '@angular/forms';
import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BaseComponent } from 'app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConvertEngPipe } from 'app/services/ui/convert-eng.pipe';
import { CategoryService } from 'app/services/common/models/category.service';
import { Category } from 'app/services/common/models/category.model';
import { Location } from '@angular/common';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgOptimizedImage,
    InfiniteScrollModule,
  ],
  providers: [ConvertEngPipe],
})
export class ProductsComponent extends BaseComponent implements OnInit {
  products: SimpleProduct[];
  productsByCat: SimpleProduct[];
  private productService = inject(ProductService);
  private slugifyPipe = inject(ConvertEngPipe);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);
  constructor(spinner: NgxSpinnerService) {
    super(spinner);
  }
  currentPageNo: number = 0;
  total: number = 0;
  categories: Category[];
  pageSize: number = 6;
  name: string;
  isMobil: boolean;
  catIndex: number;
  catId: string;
  noFilterPrd: boolean = false;
  preloadImg: boolean = false;
  isRefresh: boolean = false;
  params: string;
  async ngOnInit() {
    await this.productService
      .getProducts(
        this.currentPageNo,
        window.innerWidth > 1000 ? 12 : this.pageSize
      )
      .then((p) => {
        this.products = p.products;
        this.total = p.total;
      });
    this.products ? (this.preloadImg = true) : (this.preloadImg = false);
    await this.categoryService.getAllCategories().then((c) => {
      this.categories = c.data;
    });
    window.innerWidth > 1000 ? (this.isMobil = false) : (this.isMobil = true);
    this.productService._isHomePage.subscribe(async (a) => {
      if (a) {
        this.isRefresh = true;
        this.catIndex = -1;
        await this.getProducts();
      }
    });
  }
  async onScrollDown() {
    this.activatedRoute.queryParams.subscribe(async (params) => {
      this.params = params.butik;
    });
    if (this.params && !this.isRefresh) {
      if (this.products.length < this.total) {
        await this.getProductsByCatId(
          this.catId,
          ++this.currentPageNo,
          this.pageSize
        );
      }
    } else if (this.isRefresh) {
      await this.getProducts();
    }
  }
  async getProducts() {
    if (this.products.length < this.total) {
      await this.productService
        .getProducts(++this.currentPageNo, this.pageSize)
        .then((p) => {
          this.products.push(...p.products);
          this.total = p.total;
        });
    } else if (this.isRefresh) {
      await this.productService
        .getProducts(this.currentPageNo, this.pageSize)
        .then((p) => {
          this.products = p.products;
          this.total = p.total;
        });
    }
  }
  redirect(p: SimpleProduct) {
    this.router.navigate([this.slugifyPipe.transform(p.name)], {
      queryParams: { p: p.id },
    });
    this.productService.prevUrl.next(
      this.slugifyPipe.transform(p.name) + '-p-' + p.id
    );
  }

  async categoryActive(i: string, name: string) {
    if (this.catId !== i) {
      this.catId = i;
    }
    this.currentPageNo = 0;
    this.catIndex = this.categories.findIndex((a) => a.id == i);
    this.location.go(
      this.router
        .createUrlTree([], {
          relativeTo: this.activatedRoute,
          queryParams: { butik: this.slugifyPipe.transform(name) },
        })
        .toString()
    );
    this.currentPageNo = 0;
    this.productsByCat = [];
    await this.getProductsByCatId(
      this.catId,
      this.currentPageNo,
      this.pageSize
    );
    this.isRefresh = false;
  }
  async getProductsByCatId(id: string, page: number, size: number) {
    await this.productService.getProductsByCatId(id, page, size).then((p) => {
      this.productsByCat.push(...p.products);
      this.total = p.total;
      this.products = this.productsByCat;
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth > 1000
      ? (this.isMobil = false)
      : (this.isMobil = true);
  }
}
