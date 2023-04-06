import { ChangeEvent, useState, useRef, useEffect } from 'react'
import Util from 'util/index'
import Image from 'next/image'
import Link from 'next/link'

const FileUploadEdit = ({ show, onClose, data, onSubmit }) => {
  const ref = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File>()
  const [src, setSrc] = useState<string>()
  const [isDeleted, setDeleted] = useState<boolean>(false)
  const [clickDelete, setClickDelete] = useState<boolean>(false)
  const [clickUpload, setClickUpload] = useState<boolean>(false)

  useEffect(() => {
    setSrc(data?.logo || data?.profile_picture)
  }, [data])

  const handleClick = () => {
    if (!src) {
      ref.current?.click()
    }
  }

  const handleUploadNew = () => {
    ref.current?.click()
  }
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    setDeleted(false)
    setClickUpload(true)
    setFile(e.target.files[0])
    setSrc(URL.createObjectURL(e.target.files[0]))
  }

  const handleUpload = async () => {
    console.log('handleUpload')
    let uploadUrl = await Util.uploadFile(data.user_id + '-pfp', file)
    console.log('handleUpload sucess')
    onSubmit(uploadUrl + '?' + new Date().getTime())
    setClickUpload(false)
  }

  const handleDelete = () => {
    setSrc(null)
    setClickDelete(false)
    setDeleted(true)
    onSubmit('')
  }

  const handleClose = () => {
    setFile(null)
    setSrc(data?.logo || data?.profile_picture)
    setDeleted(false)
    setClickDelete(false)
    setClickUpload(false)
    onClose()
  }

  return (
    <div className="font-[Poppins]">
      <input
        type="file"
        ref={ref}
        onChange={handleFileChange}
        className="hidden"
      />
      {show && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-[#0b0b0b]/[0.4] backdrop-blur-[8.5px]"
            onClick={handleClose}
          ></div>
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-[984px] max-w-3xl py-4 mx-auto rounded-xl bg-[#FCF7FF]">
              <div className="mt-3">
                <div className="mt-2 text-center sm:ml-4 sm:text-left">
                  <div className="cursor-pointer text-center mt-[76px] mb-[30px]">
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
                  <h1 className="text-[33px] font-bold leading-[60px] text-black">
                    {clickDelete
                      ? 'Delete Profile photo'
                      : 'Edit Profile Picture'}
                  </h1>
                  <div
                    className="w-[140px] h-[140px] bg-gray/[0.2] mx-auto mt-3 flex items-center justify-center flex-col rounded-full cursor-pointer"
                    onClick={handleClick}
                  >
                    {src !== undefined && src && !isDeleted ? (
                      <img
                        src={src}
                        className="rounded-full w-full h-full"
                        loading="eager"
                      />
                    ) : (
                      <>
                        <Image
                          src="/assets/camera.svg"
                          width={40}
                          height={40}
                        />
                        <div className="text-[20px] listing-[30px] text-black">
                          Upload photo
                        </div>
                      </>
                    )}
                  </div>
                  {/* <div className="h-[1px] bg-gray/[0.2] w-full mt-20"></div> */}

                  {clickUpload ? (
                    <div className="gap-2 my-4">
                      <div className="my-3 mx-auto">
                        <button
                          className="mx-auto w-[80%] h-[44px] bg-purple font-[400] text-white rounded-full text-[20px] listing-[30px] py-[9px] px-[33px]"
                          onClick={handleUpload}
                        >
                          Save Changes
                        </button>
                        <button
                          className="mx-auto mt-4 w-[80%] h-[44px] border !border-purple font-[400] bg-transparent text-purple rounded-full text-[20px] listing-[30px] py-[9px] px-[33px] font-[Poppins]"
                          onClick={handleUploadNew}
                        >
                          Upload New
                        </button>
                      </div>
                      <button
                        className="mx-auto w-[80%] h-[44px] mb-8 border border-purple border !border-purple font-[400] bg-transparent text-purple rounded-full text-[20px] listing-[30px] py-[9px] px-[33px] font-[Poppins]"
                        onClick={handleClose}
                      >
                        Discard Changes
                      </button>
                    </div>
                  ) : !clickDelete ? (
                    <div className='mt-[43px]'>
                      <button
                        onClick={() => setClickDelete(true)}
                        className="my-[30px] cursor-pointer w-[80%] h-[44px] mx-auto bg-transparent border !border-purple flex items-center justify-center text-black font-[400] rounded-full px-[25px] py-[9px] font-[Poppins]"
                        disabled={!src}
                      >
                        <Image
                          src="/assets/profile/trash.svg"
                          width={30}
                          height={30}
                        />
                        Delete
                      </button>
                      
                      <button
                        className="w-[80%] h-[44px] mx-auto mb-8 flex-1 text-purple bg-white border !border-purple rounded-full px-[25px] py-[9px] font-[Poppins]"
                        onClick={onClose}
                      >
                        Back
                      </button>
                    </div>
                  ) : (
                    <div className="gap-2 my-4">
                      <button
                        className="w-[70%] mx-auto bg-gray font-[400] text-white rounded-full text-[20px] listing-[30px] py-[9px]"
                        onClick={handleDelete}
                      >
                        Delete Photo
                      </button>
                      <button
                        className="w-[80%] h-[44px] mt-4 mb-8 mx-auto border border-purple border text-purple !border-purple font-[600] bg-transparent rounded-full listing-[30px] py-[9px] font-[Poppins]"
                        onClick={() => setClickDelete(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploadEdit
