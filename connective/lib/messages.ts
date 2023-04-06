import axios from "axios"
import { IApiResponseError, MessagesApiResponse, ProfileApiResponse } from "types/apiResponseTypes"
import { Conversation, DiscoverUser, User } from "types/types"

export const getUsers = async (): Promise<User[]> => {
    const data: ProfileApiResponse.IProfiles = (
        await axios.get('/api/profiles/all')
    ).data

    return data.users
}

export const getUserInfo = async (user_id: number): Promise<DiscoverUser> => {
    const res: ProfileApiResponse.IDiscoverProfiles | IApiResponseError = (
        await axios.get('/api/profiles')
    ).data
    if (res.type == 'IApiResponseError') throw res
    else {
        return res.users.find((item) => item.id === user_id)
    }
}

export const getConversations = async (selectedUserId: number) => {
    const data: MessagesApiResponse.IConversations = (
        await axios.get('/api/messages/conversations')
    ).data

    let conversations = data.conversations
    conversations = conversations.map((conversation) => {
        if (conversation.id === selectedUserId) {
            return {
                ...conversation,
                unread: 0,
            }
        }
        return conversation
    })

    return conversations
}
