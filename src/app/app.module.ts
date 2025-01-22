import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from 'src/messages/message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from 'src/person/person.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'iago007',
      database: 'recados_db',
      autoLoadEntities: true, // Carrega entidades sem precisar especifica-las.
      synchronize: true, // No usar em producao
    }),
    MessageModule,
    PersonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// npm i --save @nestjs/typeorm typeorm pg
