import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export async function generateHashPassword(password: string) {
  if (!password)
    throw new BadRequestException('Password is required.');

  const hashedPassword: string = await bcrypt.hash( password, saltRounds );
  return hashedPassword;
}

export async function compareHashPassword(password: string, hashedPassword: string) {
  if (!password)
    throw new BadRequestException('Password is required.');
  if (!hashedPassword)
    throw new BadRequestException('Hashed Password is required.');

  const compare: boolean = await bcrypt.compare( password, hashedPassword );
  return compare;
}