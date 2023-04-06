import { withIronSession } from 'next-iron-session'
import type { NextApiRequest, NextApiResponse } from 'next'
import { IApiResponseError, ProfileApiResponse } from 'types/apiResponseTypes'
import axios from 'axios'

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  try {
    // @ts-ignore
    let user = req.session.get().user
    if (typeof user == 'undefined') {
      return res
        .status(500)
        .json({ success: false, error: 'Not signed in' } as IApiResponseError)
    }
    if (req.method == 'POST') {
      let res = await axios.post(`${process.env.WEBSERVER_HOST}:6969/network/invites`, {
        invitee_id: id.toString(),
        requestor_id: user.id.toString(),
        referral_type: "GiveClient"
      })

      console.log(res)
    }
  } catch (e) {
    console.log(e)
    return res.status(500).json({ success: false, error: e })
  }
}

export default withIronSession(handler, {
  password: process.env.APPLICATION_SECRET || '',
  cookieName: 'Connective',
  // if your localhost is served on http:// then disable the secure flag
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
})
