import { Dispatch, useMemo, useState } from 'react'
import InputField from '../../components/input-field'
import { validateEmail } from '../../util/validation/onboarding'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  onClick: (email: string) => Promise<void>
  onClose: () => void
  isShow: boolean
  emailSet: Dispatch<string>
}

const SigninModal = ({ onClick, onClose, emailSet, isShow }: Props) => {
  const [email, setEmail] = useState<string>('')
  const disabled = useMemo(() => {
    return email === '' || !validateEmail(email) ? true : false
  }, [email])

  const handleContinue = async () => {
    emailSet(email)
    await onClick(email)
    onClose()
  }
  return (
    <>
      {isShow ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-[#ffffff]/[0.4] backdrop-blur-[8.5px]"
            onClick={onClose}
          ></div>
          <div className="flex items-center h-[100vh] md:min-h-screen md:px-4 md:py-8">
            <div className="relative w-3/4 w-[984px] max-w-3xl xs:h-[100vh] md:h-[96%] p-4 mx-auto bg-white overflow-x-hidden md:rounded-[10px]">
              <div className="mt-1">
                <div className="cursor-pointer text-center mt-[50px] mb-[140px]">
                  <Link href="https://www.connective-app.xyz" passHref>
                    <a>
                      <Image
                        src="/assets/logo.svg"
                        alt="Connective logo"
                        width="453.83px"
                        height="69.57px"
                      />
                    </a>
                  </Link>
                </div>
                <div className="mt-2 text-center sm:ml-4 sm:text-left font-poppins">
                  <h1 className="text-[29px] font-bold font-[Poppins] leading-[60px] text-black">
                    Forgot Password?
                  </h1>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-500 font-[Poppins]">
                    Please enter your email. We will send a link<br/>
                    to your email to reset your password.
                  </p>
                  <div className="xs:w-[90%] md:w-3/4 mx-auto h-[30px] text-left mt-4">
                    <InputField
                      placeholder={'Enter your email'}
                      updateValue={setEmail}
                    />
                  </div>
                  <div className="gap-2 my-10">
                    <button
                      className="xs:w-[90%] md:w-3/4 mx-auto mt-2 p-2.5 flex-1 text-white bg-purple rounded-full font-poppins text-[14px]"
                      disabled={disabled}
                      onClick={handleContinue}
                    >
                      Continue
                    </button>
                    <button
                      className="xs:w-[90%] md:w-3/4 mx-auto mt-4 mb-[160px] p-2.5 flex-1 text-purple bg-white border-2 border-solid border-purple rounded-full font-poppins text-[14px]"
                      onClick={onClose}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default SigninModal
