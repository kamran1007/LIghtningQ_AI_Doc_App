import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
  } from '@nestjs/common';
  
  @Injectable()
  export class ParseJsonPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new BadRequestException(`${metadata.data} must be valid JSON`);
      }
    }
  }
  