import consola from 'consola'
import { Either, left, right } from 'fp-ts/lib/Either'

export const wrapErr = async <T>(p: Promise<T>): Promise<Either<any, T | undefined>> => {
  try {
    const result = await p
    return right(result)
  } catch (err) {
    consola.error(err)
    return left(err)
  }
}
