import { Response } from 'express';
import { json } from 'body-parser';

import { RequestWithRawBody } from '../../stripe-webhook/request-with-raw-body.interface';

export function rawBodyMiddleware() {
  return json({
    verify: (
      request: RequestWithRawBody,
      response: Response,
      buffer: Buffer,
    ) => {
      if (request.url === '/webhook' && Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
}
