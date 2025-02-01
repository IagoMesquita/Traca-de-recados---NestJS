import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PersonModule } from 'src/person/person.module';
import { MessageModule } from 'src/messages/message.module';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalExceptionsFilter } from 'src/common/ExceptionsFilter/global-exceptions.filter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: ['env/.env'], Passar mais de um arquivo de variaveis, ou com nome diferente de .env
      // ignoreEnvFile: true, // Caso as variaveis sejam setadas direto no servidor, como Heroku
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as "postgres",
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      autoLoadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), // Carrega entidades sem precisar especifica-las.
      synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), // No usar em producao 
    }),
    MessageModule,
    PersonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter
    }, 
    // {
    //   provide: APP_GUARD,
      // useClass: AuthGuard
    // }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware).forRoutes({
      path: '/persons/*', // -> soemente para a persons e qualquer caminho depois
      // path: '*', -> Pata todas as rotas
      method: RequestMethod.ALL
    }),
    consumer.apply(SimpleMiddleware).forRoutes({
      path: '/recados/*',
      method: RequestMethod.GET
    })
  }
}

// npm i --save @nestjs/typeorm typeorm pg
