import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Message, User } from 'types/types'
import { getFormatDate, getFormatTime } from 'util/validation/onboarding'
import Avatar from 'components/avatar'

type PropsMessage = {
  message: Message
  showDate: boolean
  showAvatar: boolean
  showName: boolean
  isSender: boolean
  selectedUser: User
}

const MessageFun = ({
  message,
  showDate,
  showAvatar,
  showName,
  isSender,
  selectedUser
}: PropsMessage) => {
  const { text, timestamp } = message

  return (
    <>
      {showDate && (
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-lightGray opacity-20"></div>
          <span className="flex-shrink mx-4 text-gray">
            {getFormatDate(new Date(timestamp))}
          </span>
          <div className="flex-grow border-t border-lightGray opacity-20"></div>
        </div>
      )}
      {isSender ? (
        <div>
          <p className="ml-auto text-right bg-[#F2E3FF] w-fit rounded-t-xl rounded-bl-xl p-[18px]">
            {text}
          </p>
          <div className="float-right mr-2 mt-1 text-[14px]">
            {getFormatTime(new Date(timestamp))}
          </div>
        </div>
      ) : (
        <div>
          {(showDate || showName) && (
            <p className="text-lg text-purple ml-[52px] mb-1">
              {selectedUser?.username}
            </p>
          )}
          <div className="flex">
            {showAvatar ? (
              <div className="flex items-end mr-2 rounded-full">
                
                {selectedUser.logo ? (
                  <div className="min-w-[40px] min-y-[40px] rounded-full ">
                    <Image
                      className="bg-white rounded-full"
                      width="50px"
                      height="50px"
                      src={selectedUser.logo}
                    />
                  </div>
                ) : (
                  <Avatar
                    className="rounded-full shadow-lg"
                    width="50px"
                    height="50px"
                    title={selectedUser.username}
                  />
                )}
              </div>
            ) : (
              <div className="w-[44px] h-[44px] mr-2"></div>
            )}
            <p className="bg-gray w-fit rounded-t-xl rounded-br-xl bg-gray/[.2] p-[18px]">
              {text}
            </p>
          </div>
          <div className="text-[14px] ml-[52px]">
            {getFormatTime(new Date(timestamp))}
          </div>
        </div>
      )}
    </>
  )
}

export default MessageFun
