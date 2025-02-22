import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonModule } from 'src/person/person.module';
import { MessageModule } from 'src/messages/message.module';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middleware';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import * as Joi from '@hapi/joi';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: ['env/.env'], Passar mais de um arquivo de variaveis, ou com nome diferente de .env
      // ignoreEnvFile: true, // Caso as variaveis sejam setadas direto no servidor, como Heroku,
      validationSchema: Joi.object({
        DATABASE_TYPE: Joi.required(),
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_USERNAME: Joi.required(),
        DATABASE_DATABASE: Joi.required(),
        DATABASE_PASSWORD: Joi.required(),
        DATABASE_AUTOLOADENTITIES: Joi.boolean().default(false), 
        DATABASE_SYNCHRONIZE: Joi.boolean().default(false) 
      })
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
    AuthModule,

    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', '..', 'pictures'),
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: GlobalExceptionsFilter
    // }, 
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
    })
    // consumer.apply(SimpleMiddleware).forRoutes({
    //   path: '/recados/*',
    //   method: RequestMethod.GET
    // })
  }
}

// npm i --save @nestjs/typeorm typeorm pg
// npm i joi
// npm i -D @types/hapi__join 

// server Static
// https://docs.nestjs.com/recipes/serve-static