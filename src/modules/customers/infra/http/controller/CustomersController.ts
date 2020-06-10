import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(CreateCustomerService);
    const customer = await service.execute(request.body);

    return response.json(customer);
  }
}
