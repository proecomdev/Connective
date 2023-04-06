import { useState, useEffect } from 'react'
import { Recache } from 'recache-client'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { withIronSession } from 'next-iron-session'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { IValidationItem, ValidationResponse } from 'types/types'
import ProfileTypeSelector from 'components/onboarding/profile-type-selector'
import { SelectField } from 'components/select-field/selectField'
import OnboardingSidebar from 'components/onboarding/sidebar'
import InputField from 'components/input-field'
import FileUpload from 'components/file-upload'
import { DAO } from 'lib/dao'
import {
  business as ValidateBusiness,
  individual as ValidateIndividual,
} from 'util/validation/onboarding'
import * as Routes from 'util/routes'
import Util from 'util/index'
import { statusOptions } from 'util/validation/onboarding'

export default function CreateProfile({ user, industries }) {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [pfp, setPfp] = useState<Blob>()
  const [src, setSrc] = useState<string>('')
  const [isIndividual, setIndividual] = useState<boolean>(false)
  const [industry, setIndustry] = useState<number>()
  const [size, setSize] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [processing, setProcessing] = useState<boolean>(false)
  const [occupations, setOccupations] = useState<
    Array<{ value: number; label: string }>
  >([])
  const [occupation, setOccupation] = useState<string>('')
  const [fieldErrors, setFieldErrors] = useState<ValidationResponse>(null)

  const sizeOptions = [
    { value: '1-10', label: '1-10' },
    { value: '10-50', label: '10-50' },
    { value: '50-100', label: '50-100' },
    { value: '100-200', label: '100-200' },
    { value: '200-1000', label: '200-1000' },
    { value: '1000+', label: '1000+' },
  ]

  useEffect(() => {
    try {
      Recache.logEvent_AutodetectIp('onboarding')
    } catch (e) {
      console.log(e)
    }
  }, [])

  function getIndustryOptions() {
    return industries.map((industry) => {
      return { value: industry.id, label: industry.name }
    })
  }

  const router = useRouter()

  useEffect(() => {
    if (pfp == null || pfp == undefined || typeof pfp == 'undefined') return

    setSrc(URL.createObjectURL(pfp))
  }, [pfp])

  useEffect(() => {
    if (industry != null) {
      setOccupations(
        industries
          .filter((_industry) => _industry.id == industry)[0]
          .occupations.map((occupation) => {
            return { value: occupation.id, label: occupation.name }
          }),
      )
    }
  }, [industry])

  useEffect(() => {
    setFieldErrors(null)
  }, [isIndividual])

  // async function forwardIfProfileSetup() {
  //     if(await Util.profileConfigured(user.id)) {
  //         console.log("Forwarding")
  //         router.push("/app/profile")
  //     }
  // }

  const submit = async () => {
    isIndividual ? submitIndividual() : submitBusiness()
  }

  const submitBusiness = async () => {
    if (processing) return
    setProcessing(true)
    let res = ValidateBusiness(
      name,
      size,
      industry,
      occupation,
      description,
      status,
    )
    if (!res.success) {
      setFieldErrors(res)
      setProcessing(false)
      return
    }

    let hasPfp = false
    if (pfp != null && pfp != undefined && typeof pfp != 'undefined') {
      hasPfp = true
    }

    let uploadUrl
    if (hasPfp) {
      uploadUrl = await Util.uploadFile(user.id + '-pfp', pfp)
      setSrc('')
      setPfp(null)
    }

    await axios
      .post('/api/profiles/business', {
        pfp: hasPfp ? uploadUrl : '',
        name,
        description,
        location,
        url,
        industry,
        occupation,
        size,
        status,
      })
      .then((res) => {
        if (res.status == 200) {
          console.log('success')
          router.push(`${Routes.PROFILE}/${user.id}`)
        }
      })
      .catch((e) => {
        if (
          e.response.status == 403 ||
          e.response.data.error == 'Account does not exist'
        ) {
        }
      })

    setProcessing(false)
  }

  const submitIndividual = async () => {
    if (processing) return
    setProcessing(true)

    let res = ValidateIndividual(
      name,
      description,
      industry,
      occupation,
      status,
    )
    if (!res.success) {
      setFieldErrors(res)
      setProcessing(false)
      return
    }

    let hasPfp = false
    if (pfp != null && pfp != undefined && typeof pfp != 'undefined') {
      hasPfp = true
    }

    let uploadUrl
    if (hasPfp) {
      uploadUrl = await Util.uploadFile(user.id + '-pfp', pfp)
      setSrc('')
      setPfp(null)
    }
    console.log(occupation)

    await axios
      .post('/api/profiles/individual', {
        pfp: hasPfp ? uploadUrl : '',
        name,
        bio: description,
        location,
        status,
        industry,
        occupation,
      })
      .then((res) => {
        if (res.status == 200) {
          console.log('success')
          router.push(`${Routes.PROFILE}/${user.id}`)
        }
      })
      .catch((e) => {
        if (
          e.response.status == 403 ||
          e.response.data.error == 'Account does not exist'
        ) {
        }
      })

    setProcessing(false)
  }

  return (
    <main className="flex flex-row min-h-screen min-w-screen bg-[#FCF7FF]">
      <Head>
        <title>Create Profile - Connective</title>
      </Head>
      <OnboardingSidebar />
      <div className="w-100 flex overflow-hidden h-[100vh]">
        <div className="w-100 overflow-x-hidden flex-none overflow-y-scroll">
          <div className="w-3/4 mx-auto">
            <div className="flex flex-col font-[Poppins] my-[40px]">
              <div className="cursor-pointer text-center mt-[35px] mb-[25px]">
                <Link href="https://www.connective-app.xyz" passHref>
                  <a>
                    <Image
                      src="/assets/logo.svg"
                      alt="Connective logo"
                      width="253.83px"
                      height="59.57px"
                    />
                  </a>
                </Link>
              </div>
              <p className="text-[32px] font-[600] text-black text-center">
                Create {!isIndividual ? 'Company' : 'Individual'} Profile
              </p>
              <p className="font-[400] text-[14px] leading-[37px] text-black text-center mb-[20px]">
                Choose which best describes you
              </p>
              <ProfileTypeSelector
                isIndividual={isIndividual}
                setIndividual={setIndividual}
              />
              <div className="flex flex-col gap-3 mt-16">
                <InputField
                  name={'Name'}
                  placeholder={'Enter company name'}
                  updateValue={setName}
                  errorText={
                    fieldErrors
                      ? fieldErrors.fields.filter(
                          (field) => field.name == 'name',
                        )[0]?.error
                      : ''
                  }
                />
                <InputField
                  name={'Description'}
                  placeholder={'Enter company description'}
                  updateValue={setDescription}
                  errorText={
                    fieldErrors
                      ? fieldErrors.fields.filter(
                          (field) => field.name == 'description',
                        )[0]?.error
                      : ''
                  }
                  textarea={true}
                />
                <div className="relative">
                  <p className="text-[14px] leading-[15px] font-bold text-[#0D1011] font-[Montserrat] mb-3 1bp:text-[16.5px]">
                    Logo
                  </p>
                  <FileUpload
                    text={
                      isIndividual
                        ? 'Upload Profile Picture here'
                        : 'Upload company logo here'
                    }
                    file={pfp}
                    setFile={setPfp}
                    src={src}
                    profilePicture={true}
                  /> 
                </div>

                <div className="flex flex-row w-full">
                  {!isIndividual && (
                    <InputField
                      name={'Website'}
                      placeholder={'Enter company website URL'}
                      updateValue={setUrl}
                    />
                  )}
                </div>

                <div className="flex flex-row w-full">
                  <InputField
                    name={'Location'}
                    placeholder={'Enter where your company is located'}
                    updateValue={setLocation}
                  />
                </div>

                <div className="flex flex-row justify-between gap-[24px]">
                  <div className="flex flex-col w-full gap-3">
                    <div className="flex flex-row w-full">
                      <SelectField
                        title="Industry"
                        placeholder="Choose your industry"
                        options={industries.map((industry) => {
                          return { value: industry.id, label: industry.name }
                        })}
                        onChange={(e) => {
                          setIndustry(e.value)
                          setOccupations(
                            industries
                            .filter((_industry) => _industry.id == e.value)[0]
                            .occupations.map((occupation) => {
                                return { value: occupation.id, label: occupation.name }
                            }),
                          )
                        }}
                        value={()=>{
                          const val = industries.find(i=>i.id == industry)
                          return {value: val.id, label: val.name}
                        }}
                        errorText={
                          fieldErrors
                            ? fieldErrors.fields.filter(
                                (field: IValidationItem) =>
                                  field.name == 'industry',
                              )[0]?.error
                            : ''
                        }
                      />
                    </div>

                    <div className="flex flex-row w-full">
                    <SelectField
                        title="Occupation"
                        placeholder="Choose your occupation"
                        options={occupations}
                        onChange={(e) => {
                            setOccupation(e.value)
                        }}
                        value={()=>occupations.find(i=>i.value.toString() === occupation)}
                        errorText={
                            fieldErrors
                            ? fieldErrors.fields.filter(
                                (field: IValidationItem) =>
                                    field.name == 'occupation',
                                )[0]?.error
                            : ''
                        }
                    />
                    </div>

                    <div
                      className={`flex flex-row gap-10 ${
                        isIndividual ? 'w-50 pr-5' : 'w-full'
                      }`}
                    >
                      {!isIndividual && (
                        <SelectField
                          title="Size"
                          placeholder="Choose your company size"
                          options={sizeOptions}
                          onChange={(e) => {
                            setSize(e.value)
                          }}
                          value={()=>sizeOptions.find(i=>i.value===size)}
                          errorText={
                            fieldErrors
                              ? fieldErrors.fields.filter(
                                  (field: IValidationItem) =>
                                    field.name == 'size',
                                )[0]?.error
                              : ''
                          }
                        />
                      )}
                    </div>
                    <div className="flex flex-row w-full gap-10">
                      <SelectField
                        title="Status"
                        placeholder="Choose your status"
                        options={statusOptions}
                        onChange={(e) => {
                          setStatus(e.value)
                        }}
                        value={()=>statusOptions.find(i=>i.value==status)}
                        errorText={
                          fieldErrors
                            ? fieldErrors.fields.filter(
                                (field: IValidationItem) =>
                                  field.name == 'status',
                              )[0]?.error
                            : ''
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={submit}
                disabled={processing}
                className={`w-full h-[47px] font-semibold font-[Poppins] text-[12px] leading-[18px] text-[#F2F4F5] bg-purple mt-10 rounded-full shadow-md transition-all ${
                  !processing
                    ? 'hover:scale-105 hover:shadow-lg bg-[#0F172A]'
                    : 'bg-[#0F172A]/70'
                }`}
              >
                Create Profile
              </button>

              <div className="xs:block lg:hidden">
                <h1 className="text-center w-full font-[Montserrat]  font-bold text-[24px] leading-[52px] mb-[24px] mt-[76px]">
                  Register as a Company <br /> or Individual
                </h1>
                <p className="text-center w-full font-[Montserrat]  font-light text-[13px] leading-[150%]">
                  And enjoy all the benefits that only<br/> Connective offers you.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get('user')

    if (!user) {
      return { props: {} }
    }

    const industries = await DAO.Industries.getAll()

    return {
      props: { user, industries },
    }
  },
  {
    cookieName: 'Connective',
    cookieOptions: {
      secure: process.env.NODE_ENV == 'production' ? true : false,
    },
    password: process.env.APPLICATION_SECRET,
  },
)
