import React, { HtmlHTMLAttributes, InputHTMLAttributes } from 'react'
import { none, isNone, some, getOrElse, Option } from 'fp-ts/lib/Option'
import { useRef, useState, useCallback, useEffect } from 'react'
import { useToggle } from '~/hooks'
import { IGhostTextInput } from './interfaces'
import { EditActiveIcon } from '../icons'

export const GhostTextInput = ({
  value,
  baseBlock,
  type,
  callback,
  ...props
}: IGhostTextInput & HtmlHTMLAttributes<HTMLDivElement> & InputHTMLAttributes<HTMLInputElement>): JSX.Element => {
  const [toggledState, toggle] = useToggle()
  const input = useRef<HTMLInputElement>(null)
  const inputWrapper = useRef<HTMLDivElement>(null)
  const [localText, setLocalText] = useState<Option<string>>(none)

  const handleToggle = useCallback(() => {
    toggle()
    if (isNone(localText)) return
  }, [toggle, localText])

  const handleEnter: React.KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    if (e.keyCode === 13) {
      input?.current?.blur()
    }
  }, [])

  const handleChangeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalText(some(e.target.value))
      if (callback) {
        callback(e.target.value)
      }
    },
    [callback]
  )

  useEffect(() => {
    if (inputWrapper?.current?.className.includes('block')) {
      input?.current?.focus()
    }
  }, [toggledState, inputWrapper?.current?.style])

  return (
    <div {...props} className={`flex items-center gap-2 ${props.className}`}>
      <div
        className={`
        ${baseBlock}__label--static
        font-bold w-fit max-w-max text-ellipsis overflow-hidden
        ${toggledState ? 'hidden' : 'block'}
      `}
      >
        {value}
      </div>
      <div
        className={`
        ${baseBlock}__label--inputable
        font-bold
        ${toggledState ? 'block' : 'hidden'}
      `}
        ref={inputWrapper}
      >
        <input
          className={`
            ${baseBlock}__input
            caret-base-content
            input input-bordered input-primary
            input-sm
          `}
          ref={input}
          type={type ?? 'text'}
          minLength={props.minLength}
          maxLength={props.maxLength}
          min={props.min}
          max={props.max}
          value={getOrElse(() => value)(localText)}
          onChange={handleChangeValue}
          onKeyDown={handleEnter}
          onBlur={handleToggle}
        />
      </div>
      <div>
        <EditActiveIcon className={`h-5 w-5 cursor-pointer`} onClick={handleToggle} />
      </div>
    </div>
  )
}
