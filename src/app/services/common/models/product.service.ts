import {
  Create_Product,
  Edit_Product,
} from './../../../contracts/create_product';
import { SimpleProduct } from './../../../contracts/simpleProduct';
import { AttributeValue, Attribute } from 'app/contracts/variable_option.model';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { List_Product_Image } from '../../../contracts/list_product_image';
import { HttpClientService } from '../http-client.service';
import { ProductDetailsModel } from 'app/contracts/productDetails';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private id = new BehaviorSubject<string>('null');
  prevUrl = new BehaviorSubject<string>(null);
  pid = this.id.asObservable();
  imagePath = new Subject<string>();
  _isHomePage = new Subject<boolean>();
  constructor(private httpClientService: HttpClientService) {}
  async createProduct(product: Create_Product): Promise<Create_Product> {
    const observable: Observable<Create_Product> =
      this.httpClientService.post<Create_Product>(
        {
          controller: 'products',
          action: 'CreateProduct',
        },
        product
      );
    return (await firstValueFrom(observable)) as Create_Product;
  }
  async read(
    page: number = 0,
    size: number = 2,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ totalProductCount: number; products: Edit_Product[] }> {
    const observable: Observable<{
      totalProductCount: number;
      products: Edit_Product[];
    }> = this.httpClientService.get<{
      totalProductCount: number;
      products: Edit_Product[];
    }>({
      controller: 'products',
      queryString: `page=${page}&size=${size}`,
    });
    return await firstValueFrom(observable);
  }
  async getProducts(
    page: number,
    size: number
  ): Promise<{ total: number; products: SimpleProduct[] }> {
    const observable: Observable<{
      total: number;
      products: SimpleProduct[];
    }> = this.httpClientService.get<{
      total: number;
      products: SimpleProduct[];
    }>({
      controller: 'products',
      action: 'SimpleProduct',
      queryString: `page=${page}&size=${size}`,
    });
    return await firstValueFrom(observable);
  }
  async urunId(id: string) {
    this.id.next(id);
  }
  async delete(id: string) {
    const deleteObservable: Observable<any> =
      this.httpClientService.delete<any>(
        {
          controller: 'products',
        },
        id
      );
    await firstValueFrom(deleteObservable);
  }
  async readImages(
    id: string,
    successCallBack?: () => void
  ): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> =
      this.httpClientService.get<List_Product_Image[]>(
        {
          action: 'getproductimages',
          controller: 'products',
        },
        id
      );

    const images: List_Product_Image[] = await firstValueFrom(getObservable);
    return images;
  }
  async getProductById(id: string, successCallBack?: () => void) {
    const observable: Observable<ProductDetailsModel> =
      this.httpClientService.get<ProductDetailsModel>(
        {
          controller: 'products',
          action: 'GetProductById',
        },
        id
      );
    return await firstValueFrom(observable);
  }
  async getProductByName(name: string, successCallBack?: () => void) {
    const observable: Observable<{
      isSucceeded: boolean;
      products: SimpleProduct[];
    }> = this.httpClientService.get<any>(
      {
        controller: 'products',
        action: 'FilterProductByName',
      },
      name
    );
    return await firstValueFrom(observable);
  }
  async getProductsByCatId(
    id: string,
    page: number,
    size: number
  ): Promise<{ products: SimpleProduct[]; total: number }> {
    const observable: Observable<{ products: SimpleProduct[]; total: number }> =
      this.httpClientService.get({
        controller: 'products',
        action: 'GetProductsByCatId',
        queryString: `id=${id}&page=${page}&size=${size}`,
      });
    return await firstValueFrom(observable);
  }

  async deleteImage(id: string, imageId: string, successCallBack?: () => void) {
    const deleteObservable = this.httpClientService.delete(
      {
        action: 'deleteproductimage',
        controller: 'products',
        queryString: `imageId=${imageId}`,
      },
      id
    );
    await firstValueFrom(deleteObservable);
    successCallBack();
  }

  async changeShowcaseImage(imageId: string, productId: string): Promise<void> {
    const changeShowcaseImageObservable = this.httpClientService.get({
      controller: 'products',
      action: 'ChangeShowcaseImage',
      queryString: `imageId=${imageId}&productId=${productId}`,
    });
    await firstValueFrom(changeShowcaseImageObservable);
  }

  async updateStockQrCodeToProduct(productId: string, stock: number) {
    const observable = this.httpClientService.put(
      {
        action: 'qrcode',
        controller: 'products',
      },
      {
        productId,
        stock,
      }
    );
    await firstValueFrom(observable);
  }
  async updateProduct(product: Create_Product, successCallBack?: () => void) {
    const observable: Observable<any> = this.httpClientService.put(
      {
        controller: 'products',
        action: 'UpdateProduct',
      },
      { product: product }
    );
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack);
    return (await promiseData) as { succeeded: boolean };
  }

  async createAttribute(name: string) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        action: 'CreateAttribute',
        controller: 'Variation',
      },
      { name }
    );
    const promiseData = firstValueFrom(observable);
    return (await promiseData) as { succeeded: boolean };
  }

  async createAttributeValue(attributeId: string, value: string) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        action: 'CreateAttributeValue',
        controller: 'Variation',
      },
      { attributeId, value }
    );
    const promiseData = firstValueFrom(observable);
    return (await promiseData) as { succeeded: boolean };
  }
  async getAllAttributes(
    successCallBack?: () => void
  ): Promise<{ attributes: Attribute[] }> {
    const observable: Observable<{ attributes: Attribute[] }> =
      this.httpClientService.get({
        action: 'GetAllAttributes',
        controller: 'Variation',
      });
    const promiseData = firstValueFrom(observable);
    return await promiseData;
  }
  async getAllAttributeValues(
    successCallBack?: () => void
  ): Promise<{ values: AttributeValue[] }> {
    const observable: Observable<{ values: AttributeValue[] }> =
      this.httpClientService.get({
        action: 'GetAllAttributeValues',
        controller: 'Variation',
      });
    const promiseData = firstValueFrom(observable);
    return await promiseData;
  }
  async getValuesByAttributeId(productId: string) {
    const observable: Observable<{ values: AttributeValue[] }> =
      this.httpClientService.get<{ values: AttributeValue[] }>({
        controller: 'Variation',
        action: 'GetAtttributeValueById',
        queryString: `id=${productId}`,
      });
    return await firstValueFrom(observable);
  }
  async updateAttValue(attributevalue: AttributeValue) {
    const observable: Observable<any> = this.httpClientService.put(
      {
        action: 'UpdateAttributeValue',
        controller: 'Variation',
      },
      {
        attributevalue,
      }
    );
    const promiseData = firstValueFrom(observable);
    return (await promiseData) as { succeeded: boolean };
  }
  async updateAttribute(attribute: Attribute) {
    const observable: Observable<any> = this.httpClientService.put(
      {
        action: 'UpdateAttribute',
        controller: 'Variation',
      },
      {
        attribute,
      }
    );
    const promiseData = firstValueFrom(observable);
    return await promiseData;
  }
  async updateAttributeList(ids: number[]) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        action: 'UpdateAttributes',
        controller: 'Variation',
      },
      {
        ids,
      }
    );
    const promiseData = firstValueFrom(observable);
    return await promiseData;
  }
  async updateAttributeValues(ids: number[]) {
    const observable: Observable<any> = this.httpClientService.post(
      {
        action: 'UpdateAttributeValues',
        controller: 'Variation',
      },
      {
        ids,
      }
    );
    const promiseData = firstValueFrom(observable);
    return await promiseData;
  }
  async deleteColor(id: string) {
    const deleteObservable: Observable<any> =
      this.httpClientService.delete<any>(
        {
          controller: 'Variation',
          action: 'DeleteColor',
        },
        id
      );
    await firstValueFrom(deleteObservable);
  }
  async deleteSize(id: string) {
    const deleteObservable: Observable<any> =
      this.httpClientService.delete<any>(
        {
          controller: 'Variation',
          action: 'DeleteSize',
        },
        id
      );
    await firstValueFrom(deleteObservable);
  }
}
