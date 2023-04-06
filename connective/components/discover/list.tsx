import Image from 'next/image'
import { useRouter } from 'next/router'
import * as Routes from '../../util/routes'
import Avatar from '../avatar'

type Props = {
  id: string | number
  title: string
  description: string
  imgURL: string
  status: string
}

const DiscoverList = ({ id, title, description, imgURL, status }: Props) => {
  const router = useRouter()

  let statusStyle
  if (status) {
    statusStyle = {
      marginTop: description.length > 195 ? '5px' : '45px',
      backgroundColor:
        status === 'Looking to give client for commission.'
          ? '#4b5e6d'
          : '#c2cfd8',
      textColor:
        status === 'Looking to give client for commission.' ? 'white' : 'black',
      textMarginBottom: description.length > 195 ? '1px' : '',
    }
  }

  return (
    <div className="flex flex-col min-w-[300px] items-center h-full justify-center text-center w-full bg-white rounded-2xl gap-2 border border-gray p-3 shadow-[0px_2px_5.5px_rgba(0,0,0,0.06)]">
      <div className="text-sm min-h-[50px] w-full">
        {status ? (
          <div className="rounded-2xl p-2 w-full flex items-center justify-center w-fit bg-blueLight">
            <Image src="/assets/alert.svg" height={15} width={15} />
            {' '}
            <p className="text-white text-[10px] ml-1"> {`Status: ${status}`}</p>
          </div>
        ) : null}
      </div>
      <div className="w-full h-full overflow-y-clip flex flex-col items-center py-3">
        <div className="w-[120px] h-[120px] m-3 rounded-sm ">
          {imgURL ? (
            <Image
              className="rounded-full"
              height={120}
              width={120}
              src={imgURL}
            />
          ) : (
            <Avatar title={title} width={120} height={120} />
          )}
        </div>
        <p className="text-md font-bold">{title}</p>
        <p className="text-xs flex-1 h-full text-gray">
          {description.length > 195
            ? description.slice(0, 195) + '...'
            : description}
        </p>
      </div>
      <div className="w-full shrink-0 flex flex-col justify-center items-center gap-3 mt-2">
        <button
          className="w-full text-sm font-normal text-white bg-purple font-[Poppins] flex justify-between items-center px-7 py-2 rounded-full"
          onClick={() => router.push(`${Routes.MESSAGES}?newUser=${id}`)}
        >
          <div>Start a chat</div>
          <Image src="/assets/spread.svg" width={22} height={5} />
        </button>
        <button
          className="w-full text-sm font-normal text-purple bg-transparent border !border-purple font-[Poppins] flex justify-between  items-center px-7 py-2 rounded-full"
          onClick={() => router.push(`${Routes.PROFILE}/${id}`)}
        >
          <div>View Profile</div>
          <Image src="/assets/arrow-right.svg" width={22} height={11} />
        </button>
      </div>
    </div>
  )
}

export default DiscoverList
