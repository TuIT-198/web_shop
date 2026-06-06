import AdminPage from "../pages/AdminPage/AdminPage";
import DetailsOrderPage from "../pages/DetailsOrderPage/DetailsOrderPage";
import HomePage from "../pages/HomePage/HomePage";
import MyOrderPage from "../pages/MyOrder/MyOrder";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderSucess from "../pages/OrderSuccess/OrderSuccess";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import AboutPage from "../pages/AboutPage/AboutPage";
import WarrantyPolicyPage from "../pages/WarrantyPolicyPage/WarrantyPolicyPage";
import ReturnPolicyPage from "../pages/ReturnPolicyPage/ReturnPolicyPage";
import PurchaseGuidePage from "../pages/PurchaseGuidePage/PurchaseGuidePage";
import FaqPage from "../pages/FaqPage/FaqPage";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
  },
  {
    path: "/my-order",
    page: MyOrderPage,
    isShowHeader: true,
  },
  {
    path: "/details-order/:id",
    page: DetailsOrderPage,
    isShowHeader: true,
  },
  {
    path: "/payment",
    page: PaymentPage,
    isShowHeader: true,
  },
  {
    path: "/orderSuccess",
    page: OrderSucess,
    isShowHeader: true,
  },
  {
    path: "/products",
    page: ProductsPage,
    isShowHeader: true,
  },
  {
    path: "/product/:type",
    page: TypeProductPage,
    isShowHeader: true,
  },
  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false,
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false,
  },
  {
    path: "/product-details/:id",
    page: ProductDetailsPage,
    isShowHeader: true,
  },
  {
    path: "/profile-user",
    page: ProfilePage,
    isShowHeader: true,
  },
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: false,
    isPrivated: true,
    isAdmin: true,
  },
  {
    path: "/gioi-thieu",
    page: AboutPage,
    isShowHeader: true,
  },
  {
    path: "/chinh-sach-bao-hanh",
    page: WarrantyPolicyPage,
    isShowHeader: true,
  },
  {
    path: "/chinh-sach-doi-tra",
    page: ReturnPolicyPage,
    isShowHeader: true,
  },
  {
    path: "/huong-dan-mua-hang",
    page: PurchaseGuidePage,
    isShowHeader: true,
  },
  {
    path: "/cau-hoi-thuong-gap",
    page: FaqPage,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
