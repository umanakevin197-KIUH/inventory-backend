import { inject, injectable } from "tsyringe";
import { IAuthService } from "../interfaces/auth.service.interface";
import { LoginDto } from "../dtos/login.dto";
import { IUsersRepository } from "../../Domain/repositories/usersRepository.interface";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { RegisterDto } from "../dtos/register.dto";
import { generateId } from "../../shared/utils/generateId";

@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject("IUsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async login(data: LoginDto): Promise<string> {

    const users = await this.usersRepository.findAll(1, 100);

    const user = users.find(
      x => x.email === data.email
    );

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.password
     );

     if (!isPasswordValid) {
     throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || "secretkey",
      {
        expiresIn: "8h"
      }
    );

    return token;
  }

  async register(data: RegisterDto) {

  const users = await this.usersRepository.findAll(1, 1000);

  const existingUser = users.find(
    (user) => user.email === data.email
  );

  if (existingUser) {
    throw new Error("El correo ya existe");
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    10
  );

  const newUser = {
    id: generateId(),
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
    status: true,
    created_at: new Date().toISOString(),
  };

  await this.usersRepository.create(newUser);

  const token = jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
  };
}
}