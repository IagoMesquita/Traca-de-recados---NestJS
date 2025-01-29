import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }

    console.log(value);
    console.log(metadata);

    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('ParseIntIdPipe expects a numeric string');
    }

    if (parsedValue < 0) {
      throw new BadRequestException('ParseIntIdPipe expects a number greater than zero')
    }

    return parsedValue;
  }
}

// Criando proprio Pipe: implemtar a Interface PipeTransform
// Pdoe ser usado de forma Global no app.ValidationPipes
/*    app.useGlobalPipes(
          new ValidationPipe(
            {},
            new ParseIntPipe(),
            )
) */   
