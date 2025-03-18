import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message';
import { PersonModule } from 'src/person/person.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    TypeOrmModule.forFeature([Message]),
    PersonModule,
    EmailModule
  ]
})
export class MessageModule {}
