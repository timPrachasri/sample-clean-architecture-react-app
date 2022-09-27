export interface EntityProps {
  [index: string]: any
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export abstract class Entity<T extends EntityProps> {
  public props: T

  constructor(props: T) {
    this.props = props
  }

  public equals(vo?: Entity<T>): boolean {
    if (vo === null || vo === undefined) {
      return false
    }
    if (vo.props === undefined) {
      return false
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}
