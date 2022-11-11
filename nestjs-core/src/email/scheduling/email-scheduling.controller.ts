import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import JwtAuthenticationGuard from 'src/authentication/guards/jwt-authentication.guard';

import EmailScheduleDto from './dto/email-schedule.dto';

import EmailSchedulingService from './email-scheduling.service';

@Controller('email-scheduling')
export default class EmailSchedulingController {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}

  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    return this.emailSchedulingService.scheduleEmail(emailSchedule);
  }
}
