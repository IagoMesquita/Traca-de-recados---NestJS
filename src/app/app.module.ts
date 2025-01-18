import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    RecadosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


// npm i --save @nestjs/typeorm typeorm pg 