import { Injectable, inject } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import {
  Create_Favorite,
  Favorite_List,
  Get_Favorite,
} from 'app/contracts/create_product';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private httpClientService = inject(HttpClientService);
  async createPrdFavorite(
    product: Create_Favorite
  ): Promise<{ isSuccess: boolean }> {
    const observable: Observable<any> =
      this.httpClientService.post<Create_Favorite>(
        {
          controller: 'favorite',
        },
        { productId: product.productId, userId: product.userId }
      );
    return (await firstValueFrom(observable)) as { isSuccess: boolean };
  }
  async getByPrdIdFavorite(
    product: Create_Favorite
  ): Promise<{ prdFavorite: Get_Favorite }> {
    const observable: Observable<{ prdFavorite: Get_Favorite }> =
      this.httpClientService.get<{ prdFavorite: Get_Favorite }>({
        controller: 'favorite',
        action: 'GetByPrdIdFavorites',
        queryString: `productId=${product.productId}&userId=${product.userId}`,
      });
    return (await firstValueFrom(observable)) as { prdFavorite: Get_Favorite };
  }
  async getByUserIdFavorite(
    userId: string
  ): Promise<{ favoriteProducts: Favorite_List[] }> {
    const observable: Observable<{ favoriteProducts: Favorite_List[] }> =
      this.httpClientService.get<{ favoriteProducts: Favorite_List[] }>(
        {
          controller: 'Favorite',
          action: 'GetByUserIdFavorites',
        },
        userId
      );
    return (await firstValueFrom(observable)) as {
      favoriteProducts: Favorite_List[];
    };
  }
  async deleteFavorite(id: string) {
    const deleteObservable: Observable<any> =
      this.httpClientService.delete<any>(
        {
          controller: 'favorite',
        },
        id
      );
    await firstValueFrom(deleteObservable);
  }
}
