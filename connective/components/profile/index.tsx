import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
import * as Routes from 'util/routes'
import { NetworkInvite, User } from 'types/types'
import { inviteToNetwork, getInvites } from "util/network"
import Avatar from 'components/avatar'
import ProfileFileUpload from 'components/file-upload/profile'

type Props = {
  user: User
  data: any
  industry: string
  occupation: string
  isBusiness?: boolean
  getProfile?: () => void
}

const Profile = ({
  user,
  data,
  industry,
  occupation,
  isBusiness,
  getProfile,
}: Props) => {
  const router = useRouter()
  const url = isBusiness ? '/api/profiles/business' : '/api/profiles/individual'
  const [showEdit, setEdit] = useState<boolean>(false)
  const [invites, setInvites] = useState<NetworkInvite[]>([])
  const logo = useMemo(
    () => (isBusiness ? data?.logo : data?.profile_picture),
    [data],
  )

  useEffect(() => {
    if (typeof window != 'undefined' && typeof user == 'undefined') {
      router.push(Routes.SIGNIN)
    }

    getAndSetInvites()
  }, [user])

  console.log(invites)

  const getAndSetInvites = async () => {
    setInvites(await getInvites())
  }

  const updateLogo = async (pfp) => {
    await axios.put(url, {
      pfp: pfp,
      pfpChanged: true,
      url: data.website,
      name: isBusiness ? data.company_name : data.name,
      isSubscribed: data.is_subscribed,
      ...data,
    })
    getProfile()
    setEdit(false)
  }

  return (
    <>
      <div className="xs:hidden md:block">
        <div className="relative">
          <div className={`after:absolute after:top-[20px]`}>
            <img
              className="h-48 w-[100%] object-cover relative shadow-md rounded-[12px]"
              src="/assets/profile/bg.svg"
            />
            {user.id == Number(router.query.id) && (
                <div
                    className="absolute top-[20px] right-[20px] cursor-pointer bg-white/[0.2] rounded-full w-[40px] h-[40px] flex items-center justify-center"
                    onClick={() => console.log('asdf')}
                    >
                    <Image
                        src="/assets/profile/edit-white.svg"
                        height={24}
                        width={24}
                    />
                </div>
            )}
          </div>
        </div>
        <div className="w-[100%] flex flex-row justify-between items-start">
          <div className="relative flex flex-row items-center gap-[40px] pl-[50px]">
            <div
              className={`w-[140px] h-[140px] border-4 border-white absolute top-0 -translate-y-1/2 rounded-full ${user.id == Number(router.query.id) ? "after:absolute after:right-[-10px] after:bottom-[14px] after:w-[40px] after:h-[40px] after:bg-[url('/assets/profile/edit.svg')] after:bg-[leng:24px_24px] after:bg-no-repeat after:bg-center  after:z-50 after:bg-white after:rounded-full after:cursor-pointer": ""}`}
              onClick={() => user.id == Number(router.query.id) ? setEdit(true) : ''}
            >
              {!logo ? (
                <Avatar
                  width={140}
                  height={140}
                  title={data?.company_name || data?.name}
                  className="rounded-full"
                />
              ) : (
                <Image
                  className="rounded-full z-10 backdrop-blur-sm bg-white/20 shadow-md object-cover"
                  height="140"
                  width="140"
                  src={logo}
                />
              )}
            </div>

            <div className="flex flex-col mt-[80px]">
              <div className="flex flex-row">
                <p className="font-bold text-xl mb-1 text-[#0D1011]">
                  {data?.company_name}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-[14px] 2xl:text-xl mt-4 ">
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    height={24}
                    width={24}
                    src="/assets/profile/message-purple.svg"
                  />
                  <p>{data?.email}</p>
                  {data?.location && (
                    <>
                      <div className="text-gray"> | </div>
                      <Image
                        src="/assets/profile/location.svg"
                        height={24}
                        width={24}
                      />
                      <p>{data?.location}</p>
                    </>
                  )}
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    height={24}
                    width={24}
                    src="/assets/profile/setting.svg"
                  />
                  <p>Industry: {industry}</p>
                </div>
                {
                  !isBusiness && 
                <div className="flex flex-row gap-2 items-center">
                  <Image height={22} width={22} src="/assets/profile/bag.svg" />
                  <p>Occupation: {occupation}</p>
                </div>
                }
              </div>
            </div>
          </div>
          <div className="absolute right-0 flex gap-3 mr-5">
            <div className="flex flex-col gap-3">
              {user.id != Number(router.query.id) && (
                  <div
                      className="flex flex-row gap-[12px] cursor-pointer text-white bg-purple mr-5 items-center py-[11px] px-[17px] mt-7 border-2 border-purple rounded-full"
                      onClick={() => router.push(Routes.MESSAGES)}
                      >
                      <img
                          className="w-[20px] h-[20px]"
                          src="/assets/profile/message.svg"
                      />
                      <p className="text-center text-[14px]">Message</p>
                  </div>
              )}
              
              {(user.id != Number(router.query.id)) && (invites.filter(a => a.invitee_user_id == Number(router.query.id)).length == 0) && (
                  <div
                      className="flex flex-row gap-[12px] cursor-pointer text-white bg-purple mr-5 items-center py-[11px] px-[17px] mt-7 border-2 border-purple rounded-full"
                      onClick={() => inviteToNetwork(Number(router.query.id))}
                      >
                      <img
                          className="w-[20px] h-[20px]"
                          src="/assets/profile/alert.svg"
                      />
                      <p className="text-center text-[14px]">Invite to Network</p>
                  </div>
              )}
            </div>
            

            {user.id == Number(router.query.id) && (
                <div
                    className="flex flex-row gap-[12px] cursor-pointer text-black bg-white items-center py-[11px] px-[17px] mt-7 border-2 border-purple rounded-full"
                    onClick={() => router.push(Routes.EDITPROFILE)}
                    >
                    <img className="w-[20px] h-[20px]" src="/assets/profile/edit.svg" />
                    <p className="text-center text-[14px]">Edit Profile</p>
                </div>
            )}
          </div>
        </div>
        <div className="mt-3 ml-[50px]">
          <div className="bg-purple  w-fit rounded-full py-[11px] px-[15px] flex items-center justify-center gap-2">
            <Image src="/assets/profile/alert.svg" height={16} width={16} />
            <p className="text-white text-[14px]  listing-[21px]">
              {data?.status}
            </p>
          </div>
          <div className="w-100 h-[1px] bg-gray/[0.3] my-5"></div>
          <div className="mb-5">
            <p className="text-[28px] leading-[42px] text-purple font-[700] mb-3">
              About
            </p>
            <div className="max-w-[800px] font-normal text-[16px] leading-[24px] text-[#718096]">
              <p>{isBusiness ? data?.description : data?.bio}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative xs:block md:hidden bg-[#f5f5f5]">
        <div className="relative w-full mx-auto">
          <div className={`after:absolute after:top-[20px]`}>
            <img
              className="h-48 w-[90%] h-[195px] mx-auto object-cover relative shadow-md rounded-[12px]"
              src="/assets/profile/bg.svg"
            />
            {user.id == Number(router.query.id) && (
                <div
                    className="absolute top-[10px] right-[30px] cursor-pointer bg-white rounded-full w-[30px] h-[30px] flex items-center justify-center"
                    onClick={() => console.log('asdf')}
                    >
                    <Image
                        src="/assets/profile/edit.svg"
                        height={19}
                        width={19}
                    />
                </div>
            )}
          </div>
        </div>

        <div className="flex flex-row w-[85%] mx-auto mb-[15px]">
          <div
            className="mx-auto w-[140px] h-[140px] z-1 border-4 border-white rounded-full mt-[-70px]"
            onClick={() => user.id == Number(router.query.id) ? setEdit(true) : ''}
          >
            {!logo ? (
              <Avatar
                width={140}
                height={140}
                title={data?.company_name}
                className="rounded-full"
              />
            ) : (
              <Image
                className="rounded-full backdrop-blur-sm bg-white/20 shadow-md object-cover"
                height="140"
                width="140"
                src={logo}
              />
            )}
          </div>
        </div>

        <div className="flex flex-row w-[85%] mx-auto mb-[15px]">
          <div 
            className="mx-auto mt-[-40px] z-1 bg-white bg-center rounded-full w-[40px] h-[40px] flex items-center justify-center"
            onClick={() => user.id == Number(router.query.id) ? setEdit(true) : ''}
          >
            <Image
              className="bg-center"
              src="/assets/profile/edit.svg"
              height={24}
              width={24}
            />
          </div>
        </div>

        <div className="flex flex-row justify-center w-[85%] mx-auto mb-[35px]">
            {user.id != Number(router.query.id) && (
                <div
                    className="flex flex-row mx-auto gap-[12px] cursor-pointer text-white bg-purple mr-5 items-center py-[11px] px-[17px] mt-7 border-2 border-purple rounded-full"
                    onClick={() => router.push(Routes.MESSAGES)}
                    >
                    <img
                        className="w-[20px] h-[20px]"
                        src="/assets/profile/message.svg"
                    />
                    <p className="text-center text-[14px]">Message</p>
                </div>
            )}

            {user.id == Number(router.query.id) && (
                <div
                    className="flex flex-row gap-[12px] cursor-pointer text-black bg-white items-center py-[11px] px-[17px] mt-7 border-2 border-purple rounded-full"
                    onClick={() => router.push(Routes.EDITPROFILE)}
                    >
                    <img className="w-[20px] h-[20px]" src="/assets/profile/edit.svg" />
                    <p className="text-center text-[14px]">Edit Profile</p>
                </div>
            )}
        </div>

        <div className="flex flex-row justify-center w-[85%] mx-auto mb-[35px]">
          <div className="flex flex-col gap-2 text-[14px] 2xl:text-xl mt-4 ">
            <div className="flex flex-row gap-2 items-center">
              <Image
                height={24}
                width={24}
                src="/assets/profile/message-purple.svg"
              />
              <p>{data?.email}</p>
              {/* {data?.location && (
                <>
                  <div className="text-gray"> | </div>
                  <Image
                    src="/assets/profile/location.svg"
                    height={24}
                    width={24}
                  />
                  <p>{data?.location}</p>
                </>
              )} */}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Image
                height={24}
                width={24}
                src="/assets/profile/setting.svg"
              />
              <p>Industry: {industry}</p>
            </div>
            {
              !isBusiness && 
            <div className="flex flex-row gap-2 items-center">
              <Image height={22} width={22} src="/assets/profile/bag.svg" />
              <p>Occupation: {occupation}</p>
            </div>
            }
          </div>
        </div>
        
        <div className='ml-[16px]'>
          <div className="mx-auto bg-purple  w-fit rounded-full py-[11px] px-[15px] flex items-center justify-center gap-2">
            <Image src="/assets/profile/alert.svg" height={16} width={16} />
            <p className="text-white text-[14px]  listing-[21px]">
              {data?.status}
            </p>
          </div>
        </div>
        <div className="w-100 h-[1px] bg-gray/[0.3] my-5"></div>
        <div className="flex flex-row justify-center ml-[-50px] mb-[35px]">
          <div className="ml-[80px] mb-5">
            <p className="text-[28px] leading-[42px] text-purple font-[700] mb-3">
              About
            </p>
            <div className="w-full font-normal text-[16px] leading-[24px] text-[#718096] mb-[55px]">
              <p>{isBusiness ? data?.description : data?.bio}</p>
            </div>
          </div>
        </div>

      </div>

      <ProfileFileUpload
        show={showEdit}
        onClose={() => setEdit(false)}
        data={data}
        onSubmit={updateLogo}
      />
    </>
  )
}

export default Profile
