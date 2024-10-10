import {
  Create_Favorite,
  ProductComment,
} from './../../../../contracts/create_product';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import {
  List_Basket_Item,
  PrdComment,
} from 'app/contracts/basket/list_basket_item';
import { List_Product_Image } from 'app/contracts/list_product_image';
import { ProductDetailsModel } from 'app/contracts/productDetails';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
import { BasketService } from '../../../../services/common/models/basket.service';
import { ProductService } from '../../../../services/common/models/product.service';
import { NgImageSliderModule } from 'ng-image-slider';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from '../../../../services/ui/custom-toastr.service';
import { FavoriteService } from 'app/services/common/models/favorite.service';
import { CommentService } from 'app/services/common/models/comment.service';
import { ConvertEngPipe } from 'app/services/ui/convert-eng.pipe';
import { QuestionService } from 'app/services/common/models/question.service';
import { Question } from 'app/services/common/models/question.model';
import { Attribute, AttributeValue } from 'app/contracts/variable_option.model';
@Component({
  selector: 'app-details',
  templateUrl: './detalis.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    NgbRatingModule,
    NgImageSliderModule,
  ],
  providers: [ConvertEngPipe],
})
export class DetailsComponent implements OnInit {
  product: ProductDetailsModel;
  id: string;
  images: List_Product_Image[];
  imageObject = [
    {
      image: '',
      thumbImage: '',
      title: '',
    },
  ];
  firstImage: List_Product_Image;
  quantity: number = 1;
  maxQty: number;
  avgScore: number;
  attributes: Attribute[] = [];
  prdComment: ProductComment[];
  questions: Question[] = [];
  values: AttributeValue[] = [];
  userAuth: boolean = false;
  basketItems: List_Basket_Item[] = [];
  comment: PrdComment[];
  crtPrdFav: Create_Favorite;
  prdFavoriteCount: number;
  basketForm: FormGroup;
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private userAuthService = inject(UserAuthService);
  private commentService = inject(CommentService);
  private basketService = inject(BasketService);
  private customToastrService = inject(CustomToastrService);
  private favoriteService = inject(FavoriteService);
  private convertEng = inject(ConvertEngPipe);
  private questionService = inject(QuestionService);
  constructor() {
    this.activatedRoute.queryParams.subscribe((a) => (this.id = a['p']));
    this.basketForm = this.fb.group({
      productId: [
        this.id,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
        ],
      ],
      colorId: [null, [Validators.required, Validators.maxLength(40)]],
      sizeId: [null, [Validators.required, Validators.maxLength(40)]],
      quantity: [1, [Validators.required, Validators.maxLength(40)]],
    });
  }
  async ngOnInit(): Promise<void> {
    JSON.parse(localStorage.getItem('customer'))
      ? (this.userAuth = true)
      : (this.userAuth = false);
    await this.productService
      .readImages(this.id)
      .then((res) => (this.images = res));
    this.imageObject = this.images.map(({ path }) => ({
      ['image']: path,
      ['thumbImage']: path,
      ['title']: '',
    }));
    (await this.userAuthService.identityCheck())
      ? await this.getFavoritePrd()
      : null;
    await this.commentService
      .getPrdComment(this.id)
      .then((a) => (this.prdComment = a.comment));
    await this.getColor();
    this.prdComment = this.prdComment.filter((c) => {
      if (!c.isNameShow) {
        (c.firstName = c.firstName[0] + '**'),
          (c.lastName = c.lastName[0] + '**');
      }
      return this.prdComment;
    });
    if (this.prdComment.length > 0) {
      this.avgScore =
        this.prdComment.map((a) => a.rankScore).reduce((a, b) => +a + +b) /
        this.prdComment.length;
    }
    if (await this.userAuthService.identityCheck()) {
      await this.basketService.get().then((a) => (this.basketItems = a));
    }
    await this.getQuestionByProduct();
  }

  async getFavoritePrd() {
    this.crtPrdFav = {
      productId: this.id,
      userId: JSON.parse(localStorage.getItem('customer'))?.id,
    };
    await this.favoriteService.getByPrdIdFavorite(this.crtPrdFav).then((a) => {
      this.status = a.prdFavorite.isFavorite;
      this.prdFavoriteCount = a.prdFavorite.count;
      this.favId = a.prdFavorite.id;
    });
  }
  async redirect(id: string) {
    this.router.navigate(
      [this.convertEng.transform(this.product.name) + '/yorumlar'],
      { queryParams: { p: this.id } }
    );
    this.productService.urunId(id);
  }
  status: boolean = false;
  favId: string;
  async getSize(event: any) {
    await this.productService
      .getValuesByAttributeId(this.id)
      .then((a) => (this.values = a.data));
  }
  async getColor() {
    await this.productService
      .getProductById(this.id)
      .then((res) => {
        this.product = res;
      })
      .then(() => (this.attributes = this.product.attributes));
  }
  setQty(b: any) {
    this.maxQty = this.values.length;
    this.basketForm.controls['quantity'].setValue(1);
  }
  async like(a: string) {
    if (await this.userAuthService.identityCheck()) {
      if (a == 'a') {
        await this.favoriteService
          .createPrdFavorite(this.crtPrdFav)
          .then(() => {
            this.prdFavoriteCount++;
            this.status = true;
          })
          .then(async () => await this.getFavoritePrd());
      } else if (a == 'b') {
        await this.favoriteService.deleteFavorite(this.favId).then((a) => {
          this.prdFavoriteCount--;
          this.status = false;
        });
      }
    } else {
      this.router.navigate(['giris'], {
        queryParams: {
          returnUrl: `${this.activatedRoute.snapshot.params['prdname:p']}?p=${this.activatedRoute.snapshot.queryParams['p']}`,
        },
      });
    }
  }
  async minus() {
    if (this.basketForm.controls['quantity'].value > 1) {
      this.basketForm.controls['quantity'].setValue(
        this.basketForm.get('quantity').value - 1
      );
    }
    return;
  }
  async plus() {
    if (this.basketForm.controls['quantity'].value < this.maxQty) {
      this.basketForm.controls['quantity'].setValue(
        this.basketForm.get('quantity').value + 1
      );
    }
    return;
  }
  i: number = 0;
  async prev() {
    if (this.i <= 0) this.i = this.images.length;
    this.i--;
    return await this.setImg(this.i);
  }
  async next() {
    if (this.i >= this.images.length - 1) this.i = -1;
    this.i++;
    return await this.setImg(this.i);
  }
  async setImg(i: number) {
    return document
      .querySelector('#modal-img')
      .setAttribute('src', this.images[i].path);
  }
  async addBasket(product: ProductDetailsModel) {
    if ((await this.userAuthService.identityCheck()) == false) {
      this.customToastrService.message(
        'Sepete ürün eklemek için oturum açmalısınız',
        'Oturum açınız',
        {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.BottomRight,
        }
      );
      this.router.navigate(['/giris']);
      return;
    }
    if (this.basketForm.invalid) {
      this.customToastrService.message(
        'Lütfen ürüne ait renk ve values seçtiğinizden emin olun.',
        'Hata Oluştu',
        {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopFullWidth,
        }
      );
      return;
    }
    const _basketItem: List_Basket_Item = new List_Basket_Item();
    _basketItem.productId = this.id;
    _basketItem.quantity = this.quantity;
    let bitem: List_Basket_Item = new List_Basket_Item();
    if (this.basketItems.length > 0) {
      this.basketItems.filter((a) =>
        a.productId == _basketItem.productId
          ? (bitem = a)
          : (bitem.quantity = 0)
      );
    } else {
      bitem.quantity = 0;
    }
    if (bitem.quantity + this.quantity < 6) {
      await this.basketService.add(this.basketForm.value);
      this.basketItems.push(_basketItem);
      this.customToastrService.message(
        'Ürün sepete eklenmiştir.',
        'Sepete Eklendi',
        {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.BottomRight,
        }
      );
      this.router.navigate(['/basket']);
    } else {
      this.customToastrService.message(
        'Maximum Sepete Eklenme sayısına ulaşıldı',
        'Uyarı',
        {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.BottomRight,
        }
      );
      return;
    }
  }

  redirectQuestions(name: string) {
    this.router.navigate(['/' + this.convertEng.transform(name) + '/sorular'], {
      queryParams: { p: this.id },
    });
  }
  async getQuestionByProduct() {
    await this.questionService
      .getQuestionByProduct(this.id, 0, 4)
      .then((a) => (this.questions = a.questions));
  }
}
