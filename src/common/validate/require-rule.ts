import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator"
import {Injectable} from "@nestjs/common"
@ValidatorConstraint({name: 'FieldRequired', async: true})
@Injectable()
export class requiredRule implements ValidatorConstraintInterface {
  validate(field: string) {
    return (field !== undefined && field !== null)
  }
  defaultMessage(arg?: ValidationArguments): string {
    return 'is required field'
  }
}