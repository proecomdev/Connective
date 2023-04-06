import { DAO } from "lib/dao";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import { IApiResponseError } from "types/apiResponseTypes";
import { NetworkInvite } from "types/types";

export async function handler(req: NextApiRequest, res: NextApiResponse<NetworkInvite[] | any>) {
    try {
        // @ts-ignore
        let user = req.session.get().user
        if (typeof user == 'undefined') {
          res
            .status(500)
            .json({ success: false, error: 'Not signed in' } as IApiResponseError)
        }
        if (req.method == 'GET') {
          let invites = await DAO.Network.getInvitesByUserId(user.id)
          res.status(200).json(invites)
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, error: e })
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
  