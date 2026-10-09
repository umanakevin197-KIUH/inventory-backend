import { LoginDto } from "../dtos/login.dto";
import { RegisterDto } from "../dtos/register.dto";

export interface IAuthService {
  login(data: LoginDto): Promise<string>;
  register(data: RegisterDto): Promise<any>
}