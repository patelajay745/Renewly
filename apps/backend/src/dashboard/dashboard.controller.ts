import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { Protected } from 'src/decorators/protected.decorator';
import { ClerkAuthGuard } from 'src/auth/guards/clerkGuard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { User } from '@clerk/backend';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Protected()
  @UseGuards(ClerkAuthGuard)
  @Get('/admin')
  getGlobalDashboard(@CurrentUser() user: User) {
    return this.dashboardService.getGlobalDashboard(user);
  }
}
