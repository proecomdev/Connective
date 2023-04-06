import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import * as Routes from '../../../../util/routes'
import InputField from '../../../../components/input-field'
import { AuthApiResponse } from '../../../../types/apiResponseTypes'
import axios from 'axios'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const ResetPassword: NextPage<Props> = ({ email, token }) => {
  const router = useRouter()
  const [linkExpired, setLinkExpired] = useState<boolean>(false)
  const [linkVerified, setLinkVerified] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<string>('')
  const [linkError, setLinkError] = useState<string>('')
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>('')
  // const { email, token } = router.query;

  useEffect(() => {
    async function verifyLink() {
      if (email && token) {
        await axios({
          method: 'post',
          url: '/api/auth/verifyLink',
          data: { email, token },
        })
          .then((res) => {
            setLinkExpired(false)
            setLinkVerified(true)
          })
          .catch((err) => {
            if (err?.response.data.error) {
              setLinkExpired(true)
              setLinkVerified(false)
              setLinkError(err?.response.data.error)
            }
          })
      }
    }
    verifyLink()
  }, [email, token])

  const showPasswordHandler = () => {
    setShowPassword((prevState) => !prevState)
  }

  const showPasswordConfirmHandler = () => {
    setShowPasswordConfirm((prevState) => !prevState)
  }

  const submitNewPassword = async () => {
    if (password == '') {
      setPasswordError('You must enter a password.')
      setPasswordConfirmError('')
      return
    }
    if (passwordConfirm == '') {
      setPasswordConfirmError('You must enter a password.')
      setPasswordError('')
      return
    }
    if (password !== passwordConfirm) {
      setPasswordConfirmError('Passwords must match')
    } else {
      await axios({
        method: 'post',
        url: '/api/auth/resetPassword',
        data: { email, password, token },
      })
        .then(async (res) => {
          if (res.data.success === true) {
            router.push(Routes.SIGNIN)
          }
        })
        .catch(async (err) => {
          if (err?.response.data.error) {
            setLinkExpired(true)
            setLinkVerified(false)
            setLinkError(err?.response.data.error)
          }
        })
    }
  }

  const toSignIn = () => {
    router.push(Routes.SIGNIN)
  }

  return (
    <main>
      <Head>
        <title>Reset Password - Connective</title>
      </Head>
      <div id="content" role="main" className="w-full max-w-md mx-auto p-6">
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="fixed inset-0 w-full h-full bg-[#0b0b0b]/[0.4] backdrop-blur-[8.5px]"></div>
          <div className="flex items-center xs:h-full md:min-h-screen md:px-4 md:py-8">
            <div className="relative w-full md:[90%] w-[984px] max-w-3xl p-4 mx-auto bg-white md:rounded-xl">
              <div className="mt-7 dark:bg-gray-800 dark:border-gray-700">
                {linkExpired && !linkVerified && (
                  <div className="p-4 sm:p-7 text-center">
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                      {linkError}
                    </h1>
                    <button
                      onClick={toSignIn}
                      className="w-[40%] h-[47px] bg-[#061A40] font-semibold font-[Poppins] text-[#F2F4F5] text-[12px] leading-[18px] text-center rounded-[8px] shadow-md transition-all hover:scale-105 hover:shadow-lg 1bp:text-[16px] mb-2 mt-4 ml-auto mr-auto"
                    >
                      Sign In
                    </button>
                  </div>
                )}
                {!linkExpired && linkVerified && (
                  <div className="p-4 sm:p-7 flex flex-col">
                    <div className="cursor-pointer text-center mt-[36px] mb-[150px]">
                      <Link href="https://www.connective-app.xyz" passHref>
                        <a>
                          <Image
                            src="/assets/logo.svg"
                            alt="Connective logo"
                            width="253.83px"
                            height="69.57px"
                          />
                        </a>
                      </Link>
                    </div>

                    <div className="text-center">
                      <h1 className="text-[30px] font-bold font-[Poppins] leading-[60px] text-black">
                        Reset password
                      </h1>
                      <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                        Please setup new password so you can login  <br/>and get
                        access to connective.
                      </p>
                    </div>

                    <div className="relative xs:w-[90%] md:w-[65%] mx-auto text-left mt-5  flex flex-col items-center gap-4 mt-4">
                      <InputField
                        placeholder={'Enter new password'}
                        updateValue={setPassword}
                        errorText={passwordError}
                        password
                      />
                      <InputField
                        placeholder={'Confirm new password'}
                        password
                        updateValue={setPasswordConfirm}
                        errorText={passwordConfirmError}
                      />
                    </div>
                    <button
                      onClick={submitNewPassword}
                      className="xs:w-[90%] md:w-[65%] mx-auto mt-5 p-2.5 flex-1 text-white bg-purple rounded-full"
                    >
                      Submit
                    </button>
                    <button
                      className="xs:w-[90%] md:w-[65%] mx-auto mt-4 p-2.5 flex-1 text-purple bg-white border-2 border-solid border-purple rounded-full"
                    >
                      Back
                    </button>

                    {/* <div className="mt-2">
                  <div className="grid gap-y-4">
                    <div>
                      {otpError ? (
                        <p className="text-center text-xs text-red-600 mt-2">
                          {otpError}
                        </p>
                      ) : null}
                      <p
                        className="text-center text-xs text-red-600 mt-2"
                        id="email-error"
                        // onClick={handleResendEmail}
                      >
                        Didn't get an email?{" "}
                        <span className=" cursor-pointer">Click to resend</span>
                      </p>
                    </div>
                    <div className="w-full text-center">
                      <div className="w-7/12 inline-block mt-2">
                        <button
                          type="button"
                          className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                          // onClick={toSignInPage}
                        >
                          Enter new password
                        </button>
                      </div>
                    </div>
                  </div>
                </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default ResetPassword

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { email, token } = context?.params

  return {
    props: {
      email,
      token,
    },
  }
}
