import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const productService = container.resolve(CreateProductService);
    const product = await productService.execute(request.body);

    return response.json(product);
  }
}
