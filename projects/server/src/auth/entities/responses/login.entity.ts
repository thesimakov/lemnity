import { User } from "src/user/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class LoginResponse {
  @ApiProperty() user: User
  @ApiProperty() accessToken: string
}