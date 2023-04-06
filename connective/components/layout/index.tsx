import Image from 'next/image'
import Link from 'next/link'
import { User } from '../../types/types'
import Sidebar from '../sidebar'

type Props = {
  title: string
  scroll?: boolean
  user: any
  children: React.ReactNode
}

const Layout = ({ title, scroll = true, user, children }: Props) => {
  const splitArray = title.split('/')
  const restTitle = title.slice(0, title.lastIndexOf('/'))
  const lastTitle = splitArray.pop()
  return (
    <main
      className={`relative flex flex-row ${
        scroll ? 'min-h-screen' : 'h-screen max-h-screen'
      } min-w-screen font-[Montserrat]`}
    >
      <Sidebar user={user} />
      <div
        className={`w-screen h-screen flex flex-col relative 
        ${scroll ? 'overflow-y-scroll' : 'h-full max-h-screen'} xs:hidden md:block overflow-hidden
        `}
      >
        <div className="flex justify-between items-cener bg-[#F8F9FA] py-5">
          <p className="text-[#A0AEC0] text-sm">
            General / {splitArray.length > 0 && restTitle + '/ '}
            <span className="font-bold text-3xl leading-[29px] text-[#0D1011]">
              {lastTitle}
            </span>
          </p>
          <div className="flex flex-row gap-1">
            <div className="flex items-center">
              <div className="relative mr-5">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  placeholder="Search here..."
                  className={`placeholder:text-sm outline-none w-full pl-[36px] pr-[14px] text-sm py-2 rounded-lg outline-gray/5 focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300`}
                />
              </div>
              <div className="bg-gray/[0.2] rounded-full items-center flex p-[10px]">
                <Image
                  src="/assets/messages/alarm.svg"
                  height={20}
                  width={20}
                />
              </div>
              <div className="flex items-center ml-5 mr-3">
                {!!user.logo && (
                  <img
                    src={`${user.logo}`}
                    className="rounded-full w-[40px] h-[40px]"
                  />
                )}
                <div className="ml-3 mr-5">
                  <div className="font-bold text-sm">{user?.name}</div>
                  <div className="text-sm text-gray"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>

      <div className="w-full h-[100vh] xs:block md:hidden xs:bg-[#f5f5f5] md:bg-white">
        <div className="w-full h-[100vh] overflow-x-hidden flex-none bg-[#f5f5f5]">
          <div className="w-[100%] mx-auto">
            <div className="flex flex-col font-[Poppins] my-[40px]">
              <div className="cursor-pointer text-center mt-[45px] mb-[31px]">
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
              <div>
                {
                  lastTitle === "Messages" ?
                  <>
                    <a href='/app/discover'>
                      <img 
                        src="/assets/navbar/before.png"
                        className='ml-[30px]'
                      />
                    </a>
                  </>:''
                }
              </div>

              <p className="mx-auto mb-[25px] font-semibold text-[35px] leading-[39px] text-[#0D1011]">
                {lastTitle === "Messages" ? "" :lastTitle }
              </p>

              {/* <div className="relative flex flex-row w-[85%] mx-auto mb-[35px]">
                <div className={`after:absolute after:top-[20px]`}>
                  <img
                    className="h-48 w-[100%] object-cover relative shadow-md rounded-[12px]"
                    src="/assets/profile/bg.svg"
                  />
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
                </div>
              </div>
              
              <div className=''>

              </div> */}
            {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Layout
