import { useState, useRef, useEffect } from 'react'
import { io } from 'socket.io-client'
import Image from 'next/image'
import axios from 'axios'
import MessageFun from './MessageFun'
import { Events } from '../../../common/events'
import { User, Conversation } from '../../../types/types'
import { IsSameDate } from '../../../util/validation/onboarding'
import Avatar from 'components/avatar'

let socketIO

type PropsChat = {
  userList: Array<User>
  selectedUser: Conversation
  currentAccountUser: Conversation
  conversations: Array<Conversation>
  setConversations: () => Promise<void>
  getConversations: () => Promise<void>
}

const Chat = ({
  user,
  userList,
  selectedUser,
  showUserDetail,
  conversations,
  getConversations,
  setConversations,
}) => {
  const [messages, setMessages] = useState([])
  const [isNewMessageArrived, setIsNewMessageArrived] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const [socketToken, setSocketToken] = useState('abcd')
  const [isLoading, setLoading] = useState<boolean>(false)
  const timeoutRef = useRef<any>(null)
  const [userOptions, setUserOptions] = useState([])
  const [text, setText] = useState('')
  const [screenWidth, setScreenWidth] = useState(0)
  let prevMessages = 0


  const scrollWindow = () => {
    document.getElementById('messages-container').scroll({
      top: document.getElementById('messages-container').scrollHeight,
      behavior: 'smooth',
    })
  }

  setTimeout(() => {
    window.addEventListener('resize', () => setScreenWidth(window.screen.width))
  }, 1500)

  useEffect(() => {
    let temp = []
    userList.forEach((user) => {
      temp.push({
        value: user.id,
        label: user.username + ' (' + user.email + ')',
      })
    })
    setUserOptions(temp)
  }, [userList])

  // useEffect(()=>{
  //   if(user?.id && !socketToken){
  //     (async()=>{
  //       try {
  //         const { data: { key } } = await axios.get(`${process.env.NEXT_PUBLIC_SOCKET_HOST}/socket/connection/key/${user.id}`,
  //         { withCredentials: true })
  //         setSocketToken(key)
  //       } catch (error) {
  //         setShowError(true);
  //       }
  //     })()
  //   }
  // },[user, socketToken])

  useEffect(() => {
    if (user && selectedUser && socketToken) {
      if (!socketIO) {
        socketIO = io(process.env.NEXT_PUBLIC_SOCKET_HOST)

        socketIO.on(Events.DISCONNECT, () => {
          setShowError(true)
          socketIO = null
          setSocketToken('')
        })
      }
      if (typeof Events.NEW_MESSAGE_TO_ID === 'function') {
        socketIO.on(
          Events.NEW_MESSAGE_TO_ID(`${selectedUser.id}_${user.id}`),
          (msg) => {
            setMessages((prevMsgs) => {
              const msgs = [...prevMsgs]
              msgs.push({...msg, timestamp: new Date()})
              return msgs
            })
            setIsNewMessageArrived(true)
            readMessages({ sender: selectedUser.id, receiver: user.id })
          },
        )
      }
      if (typeof Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID === 'function') {
        socketIO.on(
          Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID(user.id.toString()),
          (conversations) => {
            const mappedConversations = conversations.map((conversation) => {
              if (conversation.id === selectedUser?.id) {
                return {
                  ...conversation,
                  unread: 0,
                }
              }
              return conversation
            })
            setConversations(mappedConversations)
          },
        )
      }
      return () => {
        if (typeof Events.NEW_MESSAGE_TO_ID === 'function') {
          socketIO?.off(
            Events.NEW_MESSAGE_TO_ID(`${selectedUser.id}_${user.id}`),
          )
        }
        if (typeof Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID === 'function') {
          socketIO?.off(
            Events.NEW_UNREAD_CONVERSATION_RECEIVER_ID(user.id.toString()),
          )
        }
      }
    }
  }, [user, selectedUser, socketToken])

  useEffect(() => {
    if (isNewMessageArrived) {
      scrollWindow()
      setIsNewMessageArrived(false)
    }
  }, [isNewMessageArrived])

  useEffect(() => {
    if (selectedUser != null) {
      setLoading(true)
      getMessages()
      const clonedConversations = [...conversations]
      const foundIndex = clonedConversations.findIndex(({ id }) => {
        return selectedUser.id === id
      })

      if (foundIndex > -1) {
        clonedConversations[foundIndex].unread = 0
      }
      setConversations(clonedConversations)
    } else {
      setMessages([])
    }
  }, [selectedUser])

  useEffect(() => {
    if (showError) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setShowError(false)
      }, 1500)
    }
  }, [showError])

  const sendMessage = async () => {
    if (
      (document.getElementById('message-input') as HTMLInputElement).value != ''
    ) {
      try {
        if (socketIO.connected) {
          ;(document.getElementById(
            'message-input',
          ) as HTMLInputElement).value = ''
          setMessages([
            ...messages,
            { sender: user.id, text, timestamp: new Date() },
          ])
          setIsNewMessageArrived(true)
          await axios.post('/api/messages/' + selectedUser.id, { text })
          socketIO.emit(Events.SEND_MESSAGE, {
            receiver: selectedUser.id,
            sender: user.id,
            text,
          })
          //Re-fetch the list of conversations if the message was sent to a new conversation

          if (
            conversations.filter((a) => a.id == selectedUser.id).length == 0
          ) {
            getConversations()
          }
        } else {
          setShowError(true)
        }
      } catch (e) {
        setShowError(true)
      }
    }
  }
  const getMessages = async () => {
    let temp = messages
    const { data } = await axios.get('/api/messages/' + selectedUser.id)
    prevMessages = data.length
    setMessages(data.messages)
    setLoading(false)
    setIsNewMessageArrived(true)

    const emailz = await axios('/api/messages/unread-messages-mailer', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    await readMessages({ sender: selectedUser.id, receiver: user.id })
  }

  const readMessages = async ({ sender, receiver }) => {
    const data = {
      sender,
      receiver,
    }
    await axios.post('/api/messages/read-message', {
      header: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data,
    })
  }

  // Send message on pressing Enter key
  const messageInputRef = useRef(null)
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (
        event.key === 'Enter' &&
        document.activeElement === messageInputRef.current
      ) {
        document.getElementById('message-submit-button').click()
      }
    }
    document.addEventListener('keydown', keyDownHandler)
    return () => {
      document.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  const handleShowDate = (item, index) => {
    return index === 0
      ? false
      : !IsSameDate(item.timestamp, messages[index - 1]?.timestamp)
  }

  const handleShowName = (item, index) => {
    return index === 0 ? true : item.sender !== messages[index - 1].sender
  }

  const handleShowAvatar = (item, index) => {
    return (
      (index === messages.length - 1
        ? true
        : !IsSameDate(item.timestamp, messages[index + 1]?.timestamp)) ||
      (item.sender !== user?.id && item.sender !== messages[index + 1].sender)
    )
  }

  return (
    <>
      {/* {
        screenWidth > 768 || screenWidth === 0 ?
        <> */}
          <div className="flex flex-col h-full w-full rounded-r-lg xs:mb-[100px] md:mb-[0px]">
            {selectedUser && (
              <>
                <div className="flex flex-row justify-between items-center w-full p-2">
                  <div
                    className="flex flex-row items-center cursor-pointer"
                    onClick={showUserDetail}
                  >
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
                    <p className="font-medium font-bold  text-md ml-2 border-slate-100">
                      {selectedUser?.username}
                    </p>
                    <div className="flex items-center">
                      <div
                        className={`rounded-full w-[6px] h-[6px] ml-2 ${
                          selectedUser.isOnline ? 'bg-green' : 'bg-gray'
                        }`}
                      ></div>
                      <div className="text-gray text-sm ml-2">
                        {/* last seen 5 min ago */}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mr-5">
                    <div className="cursor-pointer">
                      <Image
                        src="/assets/messages/searchIcon.svg"
                        alt="Search"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className="ml-5 cursor-pointer">
                      <Image
                        src="/assets/messages/spread.svg"
                        alt="Spread"
                        width={24}
                        height={24}
                      />
                    </div>
                  </div>
                </div>
                <div
                  id="messages-container"
                  className="h-full overflow-y-scroll p-5 flex flex-col gap-10 bg-[#F8F9FA]"
                >
                  {isLoading ? (
                    <div className="text-center my-auto">Loading...</div>
                  ) : (
                    messages?.map((item, index) => {
                      return (
                        <MessageFun
                          key={index}
                          message={item}
                          showDate={handleShowDate(item, index)}
                          showName={handleShowName(item, index)}
                          showAvatar={handleShowAvatar(item, index)}
                          isSender={item.sender === user?.id}
                          selectedUser={selectedUser}
                        />
                      )
                    })
                  )}
                </div>
              </>
            )}
            {selectedUser && (
              <div className="flex flex-row p-3 items-center justify-center">
                <div className="cursor-pointer my-auto">
                  <Image src="/assets/messages/emoticon.svg" width={24} height={24} />
                </div>
                <div className="cursor-pointer mx-2 my-auto">
                  <Image
                    src="/assets/messages/attachment.svg"
                    width={24}
                    height={24}
                  />
                </div>
                <input
                  ref={messageInputRef}
                  id="message-input"
                  placeholder="Write a message"
                  onChange={(e) => {
                    setText(e.target.value)
                  }}
                  className="bg-gray/[.2] outline-none w-full pl-[14px] pr-[14px] text-[14px] h-[46px] border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"
                />
                <div
                  id="message-submit-button"
                  className="cursor-pointer flex ml-2"
                  onClick={sendMessage}
                >
                  <Image
                    src="/assets/messages/arrow.svg"
                    width="50px"
                    height="50px"
                  />
                </div>
              </div>
            )}
            {showError && (
              <div className="ml-3 text-sm font-normal text-red-400 mb-4">
                Error connecting to server!
              </div>
            )}
          </div>
        {/* </> :
        <>
          <div className="flex flex-col h-full w-full rounded-r-lg mb-[100px]">
            {selectedUser && (
              <>
                <div className="flex flex-row justify-between items-center w-full p-2">
                  <div
                    className="flex items-center cursor-pointer ml-[20px] mb-[30px]"
                    onClick={showUserDetail}
                  >
                    <Image
                      src={selectedUser.logo}
                      width={53}
                      height={53}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className='item-center'>
                      <p className="font-medium font-bold  text-md ml-2 border-slate-100">
                        {selectedUser?.username}
                      </p>
                      <div className="flex items-center">
                        <div
                          className={`rounded-full w-[6px] h-[6px] ml-2 ${
                            selectedUser.isOnline ? 'bg-green' : 'bg-gray'
                          }`}
                        ></div>
                        <div className="text-gray text-sm ml-2">
                          last seen 5 min ago
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mb-3 pl-[20px] pr-[20px]'>
                  <div className="mt-7 flex items-center">
                    <div
                      className=""
                      style={{
                        borderBottom: '2px solid #eaeaea',
                        width: '100%',
                      }}
                    ></div>
                    <span
                      style={{
                        padding: '0 10px 0 10px',
                        color: '#111',
                        width: '-webkit-fill-available',
                        textAlign: 'center',
                        fontSize: '14px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      August 21{' '}
                    </span>{' '}
                    <div
                      style={{
                        borderBottom: '2px solid #eaeaea',
                        width: '100%',
                      }}
                    ></div>
                  </div>
                </div>

                <div
                  id="messages-container"
                  className="h-full overflow-y-scroll p-5 flex flex-col gap-10 bg-[#F8F9FA]"
                >
                  {isLoading ? (
                    <div className="text-center my-auto">Loading...</div>
                  ) : (
                    messages?.map((item, index) => {
                      return (
                        <MessageFun
                          key={index}
                          message={item}
                          showDate={handleShowDate(item, index)}
                          showName={handleShowName(item, index)}
                          showAvatar={handleShowAvatar(item, index)}
                          isSender={item.sender === user?.id}
                        />
                      )
                    })
                  )}
                </div>
              </>
            )}
            {selectedUser && (
              <div className="flex flex-row p-3 items-center justify-center">
                <div className="cursor-pointer my-auto">
                  <Image src="/assets/messages/emoticon.svg" width={24} height={24} />
                </div>
                <div className="cursor-pointer mx-2 my-auto">
                  <Image
                    src="/assets/messages/attachment.svg"
                    width={24}
                    height={24}
                  />
                </div>
                <input
                  ref={messageInputRef}
                  id="message-input"
                  placeholder="Write a message"
                  onChange={(e) => {
                    setText(e.target.value)
                  }}
                  className="bg-gray/[.2] outline-none w-full pl-[14px] pr-[14px] text-[14px] h-[46px] border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300"
                />
                <div
                  id="message-submit-button"
                  className="cursor-pointer flex ml-2"
                  onClick={sendMessage}
                >
                  <Image
                    src="/assets/messages/arrow.svg"
                    width="50px"
                    height="50px"
                  />
                </div>
              </div>
            )}
            {showError && (
              <div className="ml-3 text-sm font-normal text-red-400 mb-4">
                Error connecting to server!
              </div>
            )}        
          </div>
        </>
      } */}
    </>
  )
}

export default Chat
