import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SimpleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('SimpleMiddleware: Inicio');

    const authorization = req.headers?.authorization;

    if (authorization) {
      req['user'] = {
        nome: 'Iago',
        sobrenome: 'Middleware',
        role: 'admin'
      };
    } else {
      req['user'] = {
        nome: 'Iago',
        sobrenome: 'Middleware',
        role: 'user'
      };
    } 

    res.setHeader('CABECALHO', 'Do Middleware');

    next();

    console.log('SimpleMiddleware: Depois do Next', req['user']);

    res.on('finish', () => { // Nao e obrigatorio. Executa ao final de tudo, depois que a middle e executada
      console.log('SimpleMiddleware: Terminou');
    });
  }
}

// Apos authenticar cria um usuario Admin, que pode ser validado pelo Gaurd