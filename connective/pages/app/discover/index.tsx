import axios from 'axios'
import { useState, useEffect, useRef, ReactNode } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/layout'
import { withIronSession } from 'next-iron-session'
import Select from 'react-select'
import searchIcon from '../../../public/assets/search-2.svg'
import Image from 'next/image'
import Head from 'next/head'
import ReactPaginate from 'react-paginate'
import * as Routes from '../../../util/routes'
import DiscoverList from '../../../components/discover/list'
import { getRecommendedUsers } from 'util/get-recommended-users'
import {
  Business,
  DiscoverUser,
  Individual,
  Industry,
  User,
} from '../../../types/types'
import { business, individual } from '../../../util/validation/onboarding'
import {
  ProfileApiResponse,
  IApiResponseError,
} from '../../../types/apiResponseTypes'
import { DAO } from '../../../lib/dao'
import { ActivityFeed } from 'services/activity/activityFeed'

function Items({ currentItems }: { currentItems: Array<ReactNode> }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item: ReactNode, index: number) => (
          <div key={index}>{item}</div>
        ))}
    </>
  )
}

export default function Discover({ user, industries, users, recommendations }) {
  const router = useRouter()
  const discoverRef = useRef(null)
  const [userInfo, setUserInfo] = useState<any>()
  const [filter, setFilter] = useState<string>('')
  const [filteredUsers, setFilteredUsers] = useState<DiscoverUser[]>([])
  const [page, setPage] = useState<number>(0)

  const RECOMMENDED_ACCOUNTS_SELECT = {value: -100, label: "Recommended"}
  
  const [defaultIndustry, setDefaultIndustry] = useState<{
    value: string | number
    label: string
  }>()
  const [selectedIndustry, setSelectedIndustry] = useState<{
    value: string | number
    label: string
  }>()

  const getAndSetRecommendations = (setItems) => {
    console.log("Getting recommendations")
    let tempUsers = recommendations.map(a => a.user)
    setItems(tempUsers.filter(a => a.username.toLowerCase().includes(filter.toLowerCase())))
  } 

  const getAndSetUsers = (setItems) => {
    console.log("Getting users")
    setItems(users.filter(
      (a) =>
        a.username.toLowerCase().includes(filter.toLowerCase()) &&
        a?.industry == selectedIndustry?.value,
    ))    
  }

  useEffect(() => {
    getAndSetRecommendations(setFilteredUsers)
  }, [])

  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState<number>(0)

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  // items per page = 8
  const endOffset = itemOffset + 8
  console.log(`Loading items from ${itemOffset} to ${endOffset}`)
  const currentItems = filteredUsers.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(filteredUsers.length / 8)

  // Invoke when user click to request another page.
  const handlePageClick = (page) => {
    setPage(page.selected)
    const newOffset = (page.selected * 8) % filteredUsers.length
    setItemOffset(newOffset)
  }

  const getIndustry = async () => {
    let account
    let individual: Individual = (
      await axios.get(`/api/profiles/individual/${user.id}`)
    ).data.individual
    let business: Business = (
      await axios.get(`/api/profiles/business/${user.id}`)
    ).data.business
    if (!individual && business) {
      account = business
    } else if (individual && !business) {
      account = individual
    }
    let temp = industries
      .map((industry) => {
        return { value: industry.id.toString(), label: industry.name }
      })
      .find((a) => a.value == account?.industry)

    setDefaultIndustry(RECOMMENDED_ACCOUNTS_SELECT)
    setSelectedIndustry(RECOMMENDED_ACCOUNTS_SELECT)
  }

  useEffect(() => {
    if (typeof user == 'undefined') {
      router.push(Routes.SIGNIN)
    } else {
      getIndustry()
    }
  }, [user])

  useEffect(() => {
    console.log(selectedIndustry)
    if(selectedIndustry?.label == "Recommended") {
      getAndSetRecommendations(setFilteredUsers)
    } else {
      getAndSetUsers(setFilteredUsers)
      setFilteredUsers(
        users.filter(
          (a) =>
            a.username.toLowerCase().includes(filter.toLowerCase()) &&
            a?.industry == selectedIndustry?.value,
        ),
      )
    }
  }, [users, filter, selectedIndustry, defaultIndustry])

  return (
    <Layout user={{ ...user, name: userInfo?.username }} title="Discover">
      <Head>
        <title>Discover - Connective</title>
      </Head>
      <div className="ml-[64px] mr-20 h-screen xs:hidden md:block">
        <div className="flex flex-row w-[100%] mb-20 gap-10 items-center mt-20">
          <div className="w-full relative">
            <div className="absolute z-[10] p-[10px]">
              <Image
                src={searchIcon}
                alt="Search icon"
                width="16px"
                height="16px"
              />
            </div>
            <input
              onChange={(e) => {
                setFilter(e.target.value)
              }}
              placeholder="Search for lists"
              className="w-full z-[5] h-fit outline-none pl-10 px-5 py-2 border border-black/20 rounded-md focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300 text-[14px]"
            ></input>
          </div>
          {defaultIndustry && (
            <Select
              placeholder="Industry"
              isMulti={false}
              options={[RECOMMENDED_ACCOUNTS_SELECT, ...industries.map((industry) => {
                return { value: industry.id, label: industry.name }
              })]}
              defaultValue={RECOMMENDED_ACCOUNTS_SELECT}
              onChange={(e) => {
                setSelectedIndustry(e)
              }}
              className="w-[250px] text-[12px]"
            ></Select>
          )}

          {/*
          <Select placeholder="Sort"  className="w-[250px] text-[12px]"></Select>
          */}
        </div>
        <div
          className="grid grid-cols-3 2bp:grid-cols-2 5bp:grid-cols-4 gap-10 w-full pb-20 items-stretch"
          ref={discoverRef}
        >
          <Items
            currentItems={currentItems.map((item) => {
              return (
                <DiscoverList
                  id={item.id}
                  title={item.username}
                  description={item.description}
                  imgURL={item.logo}
                  status={item?.status ? item.status : null}
                />
              )
            })}
          />
        </div>
        <div className="w-full flex justify-center pb-5">
          <ReactPaginate
            forcePage={page}
            breakLabel="..."
            nextLabel=">"
            onPageChange={function (page) {
              handlePageClick(page)
              discoverRef.current.scrollIntoView({ behavior: 'smooth' })
            }}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link text-black rounded-lg border-0 mx-2'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            activeClassName={'active'}
            activeLinkClassName={'text-white !bg-purple'}
          />
        </div>
      </div>

      <div className="relative w-full bg-[#f5f5f5] xs:block md:hidden">
        <div className="w-3/4 relative mx-auto mb-[20px]">
          <div className="absolute z-[10] p-[10px]">
            <Image
              src={searchIcon}
              alt="Search icon"
              width="16px"
              height="16px"
            />
          </div>
          <input
            onChange={(e) => {
              setFilter(e.target.value)
            }}
            placeholder="Search for lists"
            className="w-full z-[5] h-fit outline-none pl-10 px-5 py-2 border border-black/20 focus:outline-blue-200 transition-all hover:outline hover:outline-blue-300 text-[14px]"
          ></input>
        </div>

        <div className="w-3/4 relative mx-auto mb-[20px] rounded-full">
          {defaultIndustry && (
            <div className="rounded-full">
              <Select
                placeholder="Industry"
                isMulti={false}
                options={industries.map((industry) => {
                  return { value: industry.id, label: industry.name }
                })}
                defaultValue={defaultIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e)
                }}
                className="text-[12px]"
              ></Select>
            </div>
          )}          
        </div> 
        <div
          className="grid grid-cols-1 gap-10 w-full pb-20 items-stretch"
          ref={discoverRef}
        >
          <Items
            currentItems={currentItems.map((item) => {
              return (
                <DiscoverList
                  id={item.id}
                  title={item.username}
                  description={item.description}
                  imgURL={item.logo}
                  status={item?.status ? item.status : null}
                />
              )
            })}
          />
        </div>

        <div className="w-3/4 mx-auto flex justify-center pb-5 mb-[100px]">
          <ReactPaginate
            forcePage={page}
            breakLabel="..."
            nextLabel=">"
            onPageChange={function (page) {
              handlePageClick(page)
              discoverRef.current.scrollIntoView({ behavior: 'smooth' })
            }}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link text-black rounded-lg border-0 mx-2'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            activeClassName={'active'}
            activeLinkClassName={'text-white !bg-purple'}
          />
        </div>
      </div>
    </Layout>
  )
}

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

    const industries = await DAO.Industries.getAll();
    let recommendations = await getRecommendedUsers(user.id)
    console.log("Reqs")
    console.log(recommendations)
    let users = await DAO.Discover.getAll()
    
    ActivityFeed.Discover.viewDiscover(user.id.toString())

    return {
      props: { 
        user, 
        industries,
        recommendations,
        users
      },
    };
  },
  {
    cookieName: 'Connective',
    cookieOptions: {
      secure: process.env.NODE_ENV == 'production' ? true : false,
    },
    password: process.env.APPLICATION_SECRET,
  },
)
