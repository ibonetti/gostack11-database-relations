import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) { }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    const ids = products.map(item => ({ id: item.id }));
    const prods = await this.productsRepository.findAllById(ids);

    const productsDto = prods.map(item => {
      const prod = products.find(i => i.id === item.id);
      const quantity = prod ? prod.quantity : 0;

      return { product_id: item.id, price: item.price, quantity };
    });

    if (!customer) {
      throw new AppError('Customer not Found');
    }

    return this.ordersRepository.create({ customer, products: productsDto });
  }
}

export default CreateOrderService;
