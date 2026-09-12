export interface Product {
    id: string;
    name: string;
    imageProduct?: string | null;
    price: number;
    sellprice: number;
    stock: number;
    cat: 'ELECTRO' | 'DRINK' | 'FOOD' | 'FASHION';
}

export interface TransactionData {
    id: string;
    productId: string;
    quantity: number;
    saledate: Date;
    transactionId: string;
    product: Product;
}