import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';

@Module({
  controllers: [PersonController],
  providers: [PersonService],
  imports: [TypeOrmModule.forFeature([Person])],
  exports:[PersonService]
})
export class PersonModule {}
