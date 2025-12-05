import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ClerkAuthGuard } from 'src/auth/guards/clerkGuard';
import { Protected } from 'src/decorators/protected.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { User } from '@clerk/backend';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Protected()
  @UseGuards(ClerkAuthGuard)
  @ApiBody({ type: CreateSubscriptionDto })
  @Post('/')
  create(
    @CurrentUser() user: User,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(user, createSubscriptionDto);
  }
  @Protected()
  @UseGuards(ClerkAuthGuard)
  @Get('/')
  findAll() {
    return this.subscriptionsService.findAll();
  }
  @Protected()
  @UseGuards(ClerkAuthGuard)
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(+id);
  }
  @Protected()
  @UseGuards(ClerkAuthGuard)
  @ApiBody({ type: UpdateSubscriptionDto })
  @Patch('/:id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(+id, updateSubscriptionDto);
  }
  @Protected()
  @UseGuards(ClerkAuthGuard)
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(+id);
  }
}
