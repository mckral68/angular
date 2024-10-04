import { DiscountComponent } from './../admin/components/discount/discount.component';
import { GuardService } from './../guards/guard.service';
import { Routes } from "@angular/router";
import { DashboardComponent } from 'app/admin/components/dashboard/dashboard.component';
import { LayoutComponent } from 'app/admin/layout/layout.component';
import { inject } from "@angular/core";


export const AppRoute: Routes = [
    {
        path: "admin", canActivateChild: [() => inject(GuardService).checkAuthentication], component: LayoutComponent, children: [
            { path: "", component: DashboardComponent },
            { path: "customers", loadComponent: () => import("../admin/components/customer/customer.component").then(module => module.CustomerComponent) },
            { path: "products", loadComponent: () => import("../admin/components/products/products.component").then(module => module.ProductsComponent) },
            { path: "comments", loadComponent: () => import("../admin/components/comments/comments.component").then(module => module.CommentsComponent) },
            { path: "subjects", loadComponent: () => import("../admin/components/subject/subject.component").then(module => module.SubjectComponent) },
            { path: "discounts", loadComponent: () => import("../admin/components/discount/discount.component").then(module => module.DiscountComponent) },
            { path: "attribute", loadComponent: () => import("../admin/components/product-variation/product-variation.component").then(module => module.ProductVariationComponent)},
            { path:"attribute/:id",loadComponent:()=>import("../admin/components/attribute-values/attribute-values.component").then(m=>m.AttributeValuesComponent)},
            { path: "category", loadComponent: () => import("../admin/components/category/category.component").then(module => module.CategoryComponent) },
            { path: "questions", loadComponent: () => import("../admin/components/question/question.component").then(module => module.QuestionComponent) },
            { path: "sellerquestions", loadComponent: () => import("../admin/components/sellerquestions/sellerquestions.component").then(module => module.SellerquestionsComponent) },
            { path: "shipment", loadComponent: () => import("../admin/components/cargo/shipment.component").then(module => module.ShipmentComponent) },
            { path: "orders", loadComponent: () => import("../admin/components/order/order.component").then(module => module.OrderComponent) },
            { path: "authorize-menu", loadComponent: () => import("../admin/components/authorize-menu/authorize-menu.component").then(module => module.AuthorizeMenuComponent) },
            { path: "roles", loadComponent: () => import("../admin/components/role/role.component").then(module => module.RoleComponent) },
            { path: "users", loadComponent: () => import("../admin/components/user/list.component").then(module => module.ListComponent) },
        ]
    },
    { path: "giris", loadComponent: () => import("../ui/components/login/login.component").then(module => module.LoginComponent) },
    { path: "kayit", loadComponent: () => import("../ui/components/register/register.component").then(module => module.RegisterComponent) },
    { path: "sepetim",canActivate:[()=>inject(GuardService).checkAuth] ,loadComponent: () => import("../ui/components/baskets/baskets.component").then(module => module.BasketsComponent) },
    { path: "orders",canActivate:[()=>inject(GuardService).checkAuth], loadComponent: () => import("../ui/components/orders/orders.component").then(module => module.OrdersComponent) },
    { path: "sifresifirlama/:userId/:Token", loadComponent: () => import("../ui/components/password-reset/password-reset.component").then(a => a.PasswordResetComponent) },
    {
        path: '', loadComponent: () => import('../ui/components/default/default.component').then(m => m.DefaultComponent),

        children: [
            { path: '', pathMatch: "full", loadComponent: () => import('../ui/components/home/home.component').then(m => m.HomeComponent) },
            { path: "products", pathMatch: "full", loadComponent: () => import("../ui/components/products/products.component").then(c => c.ProductsComponent) },
            { path: "products/:pageNo", pathMatch: "full", loadComponent: () => import("../ui/components/products/products.component").then(a => a.ProductsComponent) },
            { path: "hesabim", pathMatch: "full", loadComponent: () => import("../ui/components/myaccount/myaccount.component").then(a => a.MyaccountComponent)},
            { path: "SifreGuncelleme", pathMatch: "full", loadComponent: () => import("../ui/components/myaccount/updatepassword/updatepassword.component").then(a => a.UpdatepasswordComponent) },
            { path: "hesabim/adresBilgileri",pathMatch: "full",  loadComponent: () => import("../ui/components/myaccount/user-address/user-address.component").then(a => a.UserAddressComponent) },
            { path: "hesabim/kullaniciBilgileri", pathMatch: "full", loadComponent: () => import("../ui/components/myaccount/user-info/user-info.component").then(a => a.UserInfoComponent) },
            { path: "hesabim/degerlendirmelerim", pathMatch: "full", loadComponent: () => import("../ui/components/assessments/assessments.component").then(a => a.AssessmentsComponent) },
            { path: "hesabim/favorilerim", canActivate:[()=>inject(GuardService).checkAuth], pathMatch: "full", loadComponent: () => import("../ui/components/favorite/favorite.component").then(a => a.FavoriteComponent) },
            { path: "hesabim/siparislerim", pathMatch: "full", loadComponent: () => import("../ui/components/myaccount/orders/orders.component").then(a => a.OrdersComponent) },
            { path: "hesabim/siparislerim/:od", pathMatch: "full", loadComponent: () => import("../ui/components/myaccount/orders/orderdetails/orderdetails.component").then(a => a.OrderdetailsComponent) },
            { path: "hesabim/sorularim", pathMatch: "full", loadComponent: () => import("../ui/components/myaccount/userquestions/userquestions.component").then(a => a.UserquestionsComponent) },
            { path: "hesabim/sorularim/:id", pathMatch: "full", loadComponent: () => import("../ui/components/myaccount/userquestions/question-details/question-details.component").then(a => a.QuestionDetailsComponent) },
            { path: "faq", pathMatch: "full", loadComponent: () => import("../ui/components/faq/faq.component").then(a => a.FaqComponent) },
            { path: "confirmemail/:userId/:token", pathMatch: "full", loadComponent: () => import("../ui/components/verifyemail/verifyemail.component").then(a => a.VerifyEmailComponent) },
            { path: "aydinlatma-metni", pathMatch: "full", loadComponent: () => import("../ui/components/aydinlatma-metni/aydinlatma-metni.component").then(a => a.AydinlatmaMetniComponent) },
            { path: "kurumsal-politika", pathMatch: "full", loadComponent: () => import("../ui/components/kurumsal-politika/kurumsal-politika.component").then(a => a.KurumsalPolitikaComponent) },
            { path: ":name/sorular", pathMatch: "full", loadComponent: () => import("../ui/components/questions/questions.component").then(a => a.QuestionsComponent) },
            { path: "veri-gizliligi", pathMatch: "full", loadComponent: () => import("../ui/components/veri-gizliligi/veri-gizliligi.component").then(a => a.VeriGizliligiComponent) },
            { path: "mesafeli-satis", pathMatch: "full", loadComponent: () => import("../ui/components/mesafeli-satis/mesafeli-satis.component").then(a => a.MesafeliSatisComponent) },
            { path: "iade-degisim", pathMatch: "full", loadComponent: () => import("../ui/components/iade-degisim/iade-degisim.component").then(a => a.IadeDegisimComponent) },
            { path: ':prdname:p', pathMatch: "full", loadComponent: () => import("../ui/components/products/details/details.component").then(a => a.DetailsComponent) },
            { path: ":name/yorumlar", pathMatch: "full", loadComponent: () => import("../ui/components/products/comment/comment.component").then(a => a.CommentComponent) },
            { path: ":prdName/yorum-yap/:p",canActivate:[()=>inject(GuardService).checkAuth], pathMatch: "full", loadComponent: () => import("../ui/components/comment/comment.component").then(a => a.CommentComponent) },
            { path: "**", loadComponent: () => import("../ui/components/shared/not-found/not-found.component").then(a => a.NotFoundComponent) },
        ],
    },
]
