import { useState, useEffect, createContext, useLayoutEffect } from 'react'
import { useRouter } from 'next/router'
import { withIronSession } from 'next-iron-session'

import Layout from 'components/layout'
import { Conversations, Chat, UserDetails } from 'components/messages'
import { User, Conversation } from 'types/types'
import {getFormatTime} from 'util/validation/onboarding'

import { getUsers, getUserInfo, getConversations } from "../../lib/messages"

export const MessagesContext = createContext<{
  conversations?: Conversation[]
}>({ conversations: [] })

export const MessagesProvider = MessagesContext.Provider

let initialUser = undefined;

const Messages = ({ user }) => {
  const router = useRouter()
  const { newUser } = router.query
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<Conversation>()
  const [userInfo, setUserInfo] = useState<any>()
  const [showUserdetail, setShowUserDetail] = useState<boolean>(false)
  const [screenWidth, setScreenWidth] = useState(0)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [sum, setSum] = useState()
  const [unreadMessages, setUnreadMessages] = useState([])

  async function getAndSetUserInfo() {
    const _userInfo = await getUserInfo(user.id)
    setUserInfo(_userInfo)
  }

  async function initialLoad() {
    let _users = await getUsers()
    setUsers(_users)

    let _conversations = await getConversations(selectedUser?.id)
    setConversations(_conversations)

    console.log("HI")
    console.log(selectedUser)

    
    if(newUser) {
      const temp = users.filter((item) => item.id.toString() == newUser)[0]
      
      const selectedUser = {
        id: temp.id,
        email: temp.email,
        username: temp.username,
        location: '',
        logo: temp.logo,
      } as Conversation

      setSelectedUser(selectedUser)
    } else {
      let x: Conversation;
      if (localStorage.selectedUser) x = JSON.parse(localStorage.selectedUser)
      if (x !== undefined && _conversations.filter(a => a.id == x.id).length > 0) {
        setSelectedUser(x)
        initialUser = x.username
      } else {
        setSelectedUser(_conversations[0])
      }
    }

    getAndSetUserInfo()

    try {
      setScreenWidth(window.screen.width)
    } catch (e) {
      console.log(e)
    }

    
  }

  // Automatically open latest (last opened) conversation when navigating to messages page
  useEffect(() => {
    initialLoad()
  }, [])

  // Automatically open latest (last opened) conversation when navigating to messages page
  // useEffect(() => {
  //   let x: Conversation;
  //   if (sessionStorage.selectedUser) x = JSON.parse(sessionStorage.selectedUser)
  //   if (x !== undefined) {
  //     setSelectedUser(x)
  //     initialUser = x.username
  //   }
  // }, [])
  // useEffect(() => {
  //   window.sessionStorage.setItem('currentUser', JSON.stringify(user))
  //   if (selectedUser != undefined) {
  //     window.sessionStorage.setItem(
  //       'selectedUser',
  //       JSON.stringify(selectedUser),
  //     )
  //   }

  // }, [selectedUser])

  useEffect(() => {
    window.localStorage.setItem('currentUser', JSON.stringify(user))
    if (selectedUser != undefined) {
      window.localStorage.setItem(
        'selectedUser',
        JSON.stringify(selectedUser),
      )
    }

    getAndSetUserInfo()
    
  }, [selectedUser])

  useEffect(() => {
    console.log(selectedUser)
    console.log(screenWidth)
    console.log(showUserdetail)
  }, [conversations, selectedUser, screenWidth, showUserdetail])

  // setTimeout(() => {
  //   window.addEventListener('resize', () => setScreenWidth(window.screen.width))
  // }, 1500)

  return (
    <MessagesProvider value={{ conversations }}>
      <Layout
        user={{ ...user, logo: userInfo?.logo, name: userInfo?.username }}
        title="Messages"
      >
        <div className="w-[103%] h-[calc(100vh-140px)] overflow-clip flex flex-row mr-[-19px]">
          {
              screenWidth < 768 && initialUser !== selectedUser?.username ?
              <>
              {
                !showUserdetail ? 
                <>
                  <Chat
                    userList={users}
                    user={user}
                    selectedUser={selectedUser? selectedUser : conversations[0]}
                    conversations={conversations}
                    getConversations={getConversations}
                    setConversations={setConversations}
                    showUserDetail={() => setShowUserDetail(!showUserdetail)}
                  />
                  <div className="h-full w-[5px] bg-[#F8F9FA]"></div>
                </>:
                <>
                  <UserDetails
                    selectedUser={selectedUser}
                    onClose={() => setShowUserDetail(false)}
                  />
                </>
              }
              </>
              :
              <>
                <Conversations
                  unreadMessages={unreadMessages}
                  selectedUser={selectedUser? selectedUser : conversations[0]}
                  conversations={conversations}
                  setSelectedUser={setSelectedUser}
                />
              </>
            }
          <div className="h-full w-[5px] bg-[#F8F9FA]"></div>
          {
            screenWidth >= 768  ?
              <>
                <Chat
                  userList={users}
                  user={user}
                  selectedUser={selectedUser? selectedUser : conversations[0]}
                  conversations={conversations}
                  getConversations={getConversations}
                  setConversations={setConversations}
                  showUserDetail={() => setShowUserDetail(!showUserdetail)}
                />
                <div className="h-full w-[5px] bg-[#F8F9FA]"></div>
                {showUserdetail && (
                  <UserDetails
                    selectedUser={selectedUser}
                    onClose={() => setShowUserDetail(false)}
                  />
                )} 
              </>
              : ''
          }

        </div>

      </Layout>
    </MessagesProvider>
  )
}

export default Messages

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get('user')
    if (!user) {
        return { 
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            }, 
        }
    }

    return {
      props: { user },
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
