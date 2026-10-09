import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IAuthService } from "../../Application/interfaces/auth.service.interface";

@injectable()
export class AuthController {

  constructor(
    @inject("IAuthService")
    private readonly authService: IAuthService
  ) {}

  login = async (req: Request, res: Response) => {
    try {

      const token = await this.authService.login(req.body);

      return res.status(200).json({
        token
      });

    } catch (error: any) {

      return res.status(400).json({
        message: error.message
      });

    }
  };
  async register(req: Request, res: Response) {

  try {

    const result = await this.authService.register(
      req.body
    );

    return res.status(201).json(result);

  } catch (error: any) {

    return res.status(400).json({
      message: error.message,
    });

  }
}


}