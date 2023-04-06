import axios from "axios"
export const inviteToNetwork = async (inviteeId: number) => {
    await axios.post(`/api/profiles/network/invite?id=${inviteeId}`)
}

export const getInvites = async () => {
    const {data} = await axios.get(`/api/profiles/network`)
    return data
}