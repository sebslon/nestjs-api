import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Timestamp', () => Date)
export class Timestamp implements CustomScalar<number, Date> {
  description =
    '`Date` type as integer. Type represents date and time as number of milliseconds from start of UNIX epoch.';

  serialize(value: Date) {
    return value instanceof Date ? value.getTime() : null;
  }

  // arguments from graphql variables
  parseValue(value: string | number | null) {
    try {
      const number = Number(value);

      return value !== null ? new Date(number) : null;
    } catch {
      return null;
    }
  }

  // arguments from graphql query
  parseLiteral(valueNode: ValueNode) {
    if (valueNode.kind === Kind.INT || valueNode.kind === Kind.STRING) {
      try {
        const number = Number(valueNode.value);

        return new Date(number);
      } catch {
        return null;
      }
    }
  }
}
