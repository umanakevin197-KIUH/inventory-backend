import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IUsersService } from './../../Application/interfaces/users.service.interface';

@injectable()
export class UsersController {

  private readonly _usersService: IUsersService;

  constructor(@inject("IUsersService") service: IUsersService) {
    this._usersService = service;
  }

  getAll = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 100;
    const result = await this._usersService.findAll(page, pageSize);
    res.json(result);
  }

  create = async (req: Request, res: Response) => {
    const result = await this._usersService.create(req.body);
    res.status(201).json(result);
  }

  getById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this._usersService.findById(id);
    res.json(result);
  }

  update = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this._usersService.update(id, req.body);
    res.json(result);
  }

  delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this._usersService.delete(id);
    res.status(204).send();
  }

  resetPassword = async (
    req: Request,
    res: Response
  ) => {

    const password =
      await this._usersService.resetPassword(
        req.params.id as string
      );

    res.json({
      password
    });

  };
}
