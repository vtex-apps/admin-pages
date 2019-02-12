import { NativeType, Option } from '../typings/typings'

export const formatOptions = <T extends NativeType>(values: T[]) => values.map(value => ({ value, label: value.name }) as Option)