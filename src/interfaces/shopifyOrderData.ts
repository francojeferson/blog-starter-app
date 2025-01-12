export type ShopifyOrderType = {
  line_items: LineItem[];
  customer: Customer;
  shipping_address: Address;
  billing_address: Address;
  financial_status: "voided" | "paid";
  total_tax: string;
  currency: string;
  note: string;
  tags: string[];
  total_price: string;
  shipping_lines: ShippingLine[];
  transactions: Transaction[];
};

type LineItem = {
  variant_id: number;
  quantity: number;
  price: string;
  title: string;
  tax_lines: TaxLine[];
};

type Customer = {
  first_name: string;
  last_name: string;
  email: string;
};

type Address = {
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  phone: string;
  city: string;
  province: string;
  country: string;
  zip: string;
};

type ShippingLine = {
  price: string;
  title: string;
};

type Transaction = {
  kind: "sale";
  status: "failure" | "success";
  amount: string;
};

type TaxLine = {
  price: string;
  rate: number;
  title: string;
};
