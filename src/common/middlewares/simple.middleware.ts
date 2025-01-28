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
      };
    }

    res.setHeader('CABECALHO', 'Do Middleware');

    next();

    console.log('SimpleMiddleware: Depois do Next');

    res.on('finish', () => {
      console.log('SimpleMiddleware: Terminou');
    });
  }
}

// O exemplo nao faz muito sentido, e mais para entender como e o que pode ser feito com as Middleware