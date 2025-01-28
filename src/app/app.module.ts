import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from 'src/person/person.module';
import { MessageModule } from 'src/messages/message.module';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware).forRoutes({
      path: '/persons/*', // -> soemente para a persons e qualquer caminho depois
      // path: '*', -> Pata todas as rotas
      method: RequestMethod.ALL
    })
  }
}

// npm i --save @nestjs/typeorm typeorm pg
