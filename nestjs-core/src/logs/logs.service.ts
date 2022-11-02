import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Log } from './log.entity';

import CreateLogDto from './dto/create-log.dto';

@Injectable()
export default class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}

  async createLog(log: CreateLogDto) {
    const newLog = await this.logsRepository.create(log);

    await this.logsRepository.save(newLog, {
      data: {
        isCreatingLogs: true, // avoid infinite loop when logging
      },
    });

    return newLog;
  }
}
