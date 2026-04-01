export type TEcommerceConfig = {
  id?: string;
  storeName: string;
  storeDescription: string;
  logoUrl: string;
  bannerUrl: string;
  enabled: boolean;
  primaryColor: string;
  shippingEnabled: boolean;
  shippingFixedPrice: number;
  shippingFreeAbove: number;
  shippingDescription: string;
  plan: string;
  company: string;
  store: string;
};

export const ResetEcommerceConfig: TEcommerceConfig = {
  storeName: "",
  storeDescription: "",
  logoUrl: "",
  bannerUrl: "",
  enabled: false,
  primaryColor: "#7C3AED",
  shippingEnabled: false,
  shippingFixedPrice: 0,
  shippingFreeAbove: 0,
  shippingDescription: "",
  plan: "",
  company: "",
  store: ""
};

export type TEcommerceProduct = {
  id: string;
  name: string;
  description: string;
  descriptionComplet: string;
  code: string;
  categoryId: string;
  brandId: string;
  price: number;
  quantity: number;
  stocks: TEcommerceStock[];
};

export type TEcommerceStock = {
  id: string;
  price: number;
  priceDiscount: number;
  quantityAvailable: number;
  variations: any[];
  hasProductVariations: string;
  hasProductSerial: string;
};

export type TEcommerceCustomer = {
  id: string;
  name: string;
  email: string;
  token: string;
};

export type TEcommerceCartItem = {
  productId: string;
  stockId: string;
  productName: string;
  quantity: number;
  price: number;
};

export type TEcommerceOrder = {
  id: string;
  code: string;
  status: string;
  billingType: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentUrl: string;
  pixQrCode: string;
  pixQrCodeImage: string;
  identificationField: string;
  items: TEcommerceOrderItem[];
};

export type TEcommerceOrderItem = {
  productName: string;
  quantity: number;
  price: number;
  total: number;
};
