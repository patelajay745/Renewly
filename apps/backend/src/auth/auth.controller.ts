import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Protected } from '../decorators/protected.decorator';
import { ClerkAuthGuard } from './guards/clerkGuard';
import type { User } from '@clerk/backend';

@Controller('auth')
export class AuthController {}