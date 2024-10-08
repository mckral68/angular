import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoadComponentService {
  viewContainerRef(BasketsComponent: ComponentType, viewContainerRef: any) {
    throw new Error('Method not implemented.');
  }

  //ViewContainerRef : Dinamik olarak yüklenecek componenti içerisinde barındıran container'dır. (Her dinamik yükleme sürecinde önceki view'leri clear etmemiz gerekmektedir.)
  //ComponentFactory : COmponent'lerin instance'larını oluşturmak için kullanılan nesnedir.
  //ComponentFactoryResolver : Belirli bir component için ComponentFactory'i resolve eden sınıftır. İçerisindeki resolveComponentFactory fonksiyonu aracılığıyla ilgili componente dair bir ComponentFactory nesnesi oluşturup, döner.
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }
  async loadComponent(component: ComponentType, viewContainerRef: ViewContainerRef) {
    let _component: any = null;
    switch (component) {
      case ComponentType.BasketsComponent:
        _component = (await import("../../ui/components/baskets/baskets.component")).BasketsComponent;
        break;
    }
    viewContainerRef.clear();
    return viewContainerRef.createComponent(this.componentFactoryResolver.resolveComponentFactory(_component))
  }
}

export enum ComponentType {
  BasketsComponent
}
