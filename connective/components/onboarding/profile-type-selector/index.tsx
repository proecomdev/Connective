import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  isIndividual: boolean
  setIndividual: Dispatch<SetStateAction<boolean>>
}

const ProfileTypeSelector = ({ isIndividual, setIndividual }: Props) => {
  let unselectedClass =
    'font-[Poppins] cursor-pointer text-black bg-white flex flex-row gap-2 px-10 py-2  h-[47px] flex items-center justify-center rounded-full w-fill flex flex-row items-center justify-center'
  let selectedClass =
    'font-[Poppins] cursor-pointer bg-purple text-white flex flex-row gap-2 px-10 py-2  h-[47px] flex items-center justify-center rounded-full w-fill flex flex-row items-center justify-center'

  return (
    <div className="flex justify-around flex-row w-full gap-[24]">
      <div className="w-auto rounded-lg">
        <div
          onClick={() => setIndividual(false)}
          className={!isIndividual ? selectedClass : unselectedClass}
        >
          <div className="h-fit mt-[5px]">
            <Image
              src={
                isIndividual
                  ? '/assets/business.svg'
                  : '/assets/business-white.svg'
              }
              alt="Connective logo"
              width="20px"
              height="20px"
            />
          </div>
          <p className="font-bold text-[10px] leading-[15px]">
            I am a business
          </p>
        </div>
      </div>

      <div className="w-auto rounded-lg">
        <div
          onClick={() => setIndividual(true)}
          className={isIndividual ? selectedClass : unselectedClass}
        >
          <div className="h-fit mt-[5px]">
            <Image
              src={
                isIndividual ? '/assets/person-white.svg' : '/assets/person-black.svg'
              }
              alt="Connective logo"
              width="20px"
              height="20px"
            />
          </div>
          <p className="font-bold text-[12px] leading-[15px]">
            I am an Individual
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProfileTypeSelector
