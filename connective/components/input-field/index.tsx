import { useState } from 'react'
import Image from 'next/image'
import dollarIcon from '../../public/assets/dollar.svg'

type Props = {
  name?: string
  placeholder?: string
  password?: boolean
  textarea?: boolean
  price?: boolean
  updateValue?: (value: string) => void
  errorText?: string
  value?: string | number
  disabled?: boolean
  isFull?: boolean
}

const InputField = ({
  name,
  placeholder,
  textarea,
  price,
  password,
  updateValue,
  errorText,
  value,
  disabled,
  isFull,
}: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <div className={`flex flex-col w-full ${isFull ? 'h-full' : ''}`}>
      {name && (
        <p className="text-[16px] leading-[15px] font-[500] text-[#111] font-[Montserrat] mb-3 1bp:text-[16.5px]">
          {name}
        </p>
      )}
      {price && (
        <div className="relative flex items-center h-[38px]">
          <div className="absolute z-[10] pl-[12px] my-auto flex items-center">
            <Image
              src={dollarIcon}
              alt="Search icon"
              width="17.5px"
              height="17.5px"
            />
          </div>
          <input
            disabled={disabled}
            onChange={(e) => {
              updateValue(e.target.value)
            }}
            type="number"
            min="0"
            step="1"
            className="outline-none w-full pl-[32px] pr-[14px] text-[14px] h-[30px] border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"
            value={value}
            placeholder={placeholder}
          ></input>
        </div>
      )}

      {textarea && (
        <textarea
          onChange={(e) => {
            updateValue(e.target.value)
          }}
          className={`outline-none w-full px-[14px] text-[14px] ${
            isFull ? 'h-full' : 'h-[47px]'
          } border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300`}
          placeholder={placeholder}
          value={value}
        />
      )}

      {!textarea && !price && (
        <>
          <input
            onChange={(e) => {
              updateValue(e.target.value)
            }}
            className="outline-none w-full px-[14px] text-[14px] h-[47px] border border-black/20 rounded-full focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"
            type={password && !showPassword ? 'password' : ''}
            placeholder={placeholder}
            value={value}
          />
          {password && (
            <div
              className={"absolute right-[14px] bottom-[5px] cursor-pointer " + (errorText? "bottom-[23px]" : "bottom-[5px]")}
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword && (
                <Image
                  src="/assets/eye-slash.svg"
                  alt="eye slash"
                  width="24px"
                  height="24px"
                />
              )}
              {showPassword && (
                <Image
                  src="/assets/eye.svg"
                  alt="eye"
                  width="24px"
                  height="24px"
                />
              )}
            </div>
          )}
        </>
      )}

      {errorText && (
        <p className="text-red-500 font-[500] text-[12px]">{errorText}</p>
      )}
    </div>
  )
}

export default InputField
