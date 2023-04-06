import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Avatar from '../avatar'

type Props = {
  text: string
  profilePicture?: boolean
  file: Blob
  setFile: (file: File) => void
  accept?: string
  src: string
  user?: string
  editProfile?: boolean
}

const FileUpload = ({
  text,
  profilePicture = false,
  file,
  setFile,
  accept = '*',
  src,
  user = null,
  editProfile = false,
}: Props) => {
  const ref = useRef<HTMLInputElement>()
  const [showModal, setShowModal] = useState<boolean>(false)
  const handleClick = () => {
    ref.current.click()
  }

  const handleClose = () => {
    setShowModal(false)
  }

  const handleChange = (e) => {
    setFile(e.target.files[0])
    setShowModal(false)
  }

  return (
    <>
      <label className="w-full" onClick={() => setShowModal(true)}>
        <div className="cursor-pointer mx-auto flex flex-col items-center bg-transparent p-4 border border-black/40 border-dashed rounded-md transition-all hover:bg-[#D9D9D9]/10 pt-[86px]">
          <div className="flex justify-center">
            {(src !== '' || !!file) && (
              <img
                className={`mx-auto mt-auto h-[${
                  editProfile ? '75px' : '130px'
                }] w-[${
                  editProfile ? '75px' : '130px'
                }] rounded-full object-cover`}
                src={src}
                style={
                  editProfile?{width: '75px',height: '75px'}:{
                    width: '75px', height: '75px'
                  }
                }
              />
            )}
          </div>

          {!editProfile &&
          (file == null || file == undefined || typeof file == 'undefined') ? (
            <div className="w-fit rounded-full">
              <Image src="/assets/cloud.svg" width={44} height={35} />
            </div>
          ) : null}
          {file ? (
            <div className="text-purple text-[14px] listing-[24px] mt-3">
              Change Profile Photo
            </div>
          ) : (
            <>
              <p className="mb-auto text-center text-black">
                {file == null || file == undefined || typeof file == 'undefined'
                  ? text
                  : file.name}
              </p>
              <p className="text-[12px] text-gray leading-[18px] text-center mt-1">
                Supported formates: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
              </p>
            </>
          )}
        </div>
      </label>
      <input
        type="file"
        accept={accept}
        ref={ref}
        hidden
        onChange={(e) => handleChange(e)}
        className=""
      />
      {showModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-[#0b0b0b]/[0.4] backdrop-blur-[8.5px]"
            onClick={handleClose}
          ></div>
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full w-[984px] max-w-3xl py-4 mx-auto rounded-xl bg-[#FCF7FF]">
              <div className="mt-3">
                <div className="mt-2 text-center sm:ml-4 sm:text-left">
                  <div className="cursor-pointer text-center mt-[73px] mb-[38px]">
                    <Link href="https://www.connective-app.xyz" passHref>
                      <a>
                        <Image
                          src="/assets/logo.svg"
                          alt="Connective logo"
                          width="353.83px"
                          height="69.57px"
                        />
                      </a>
                    </Link>
                  </div>
                  <h1 className="text-[35px] font-bold font-[Poppins] leading-[60px] text-black ">
                    Upload Profile <br/>
                    Picture
                  </h1>
                  <div 
                    className='w-[190px] h-[190px] mx-auto mt-[50px] rounded-full border-solid border-1 mt-[25px]'
                    style={{border: '1px solid #a0aec033'}}
                  >
                    <div
                      className="w-[160px] h-[160px] bg-gray/[0.2] mx-auto mt-[15px] flex items-center justify-center flex-col rounded-full cursor-pointer"
                      onClick={handleClick}
                    >
                      <Image src="/assets/camera.svg" width={30} height={30} />
                      <div className="text-[14px] listing-[30px] text-black font-[Poppins]">
                        Upload photo
                      </div>
                    </div>
                  </div>
                  <button
                    // onClick={() => setFile(undefined)}
                    className="my-[30px] w-[86%] h-[50px] mx-auto bg-transparent border borders-gray flex items-center justify-center text-gray/[0.8] rounded-full px-[30px] mt-[50px] font-[Poppins]"
                  >
                    <Image src="/assets/trash.svg" width={30} height={30} />
                    &nbsp;&nbsp;&nbsp;Delete
                  </button>
                  <button
                    className="w-[86%] h-[50px] mx-auto mt-4 mb-[100px] p-2.5 flex-1 text-purple bg-white border-2 border-solid border-purple rounded-full font-[Poppins]"
                  >
                    Back
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FileUpload
