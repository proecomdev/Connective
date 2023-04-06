import axios from "axios"
import { UserRecommendation, DiscoverUser } from "types/types"

export const getRecommendedUsers = async (userId: number): Promise<UserRecommendation[]> => {
    const {data} = await axios.get(`http://45.79.157.137:6969/recommendations/${userId}`)

    //console.log(raw_recommendations)
    let recommendations: UserRecommendation[] = data.map(recommendation => {
        if(typeof(recommendation.id) == "number" ||
            typeof(recommendation.show_on_discover) == "boolean" ||
            typeof(recommendation.email) == "string" ||
            typeof(recommendation.industry) == "number" ||
            typeof(recommendation.username) == "string" ||
            typeof(recommendation.logo) == "string" ||
            typeof(recommendation.description) == "string" ||
            typeof(recommendation.status) == "string") {
            console.log("Invalid response.")
        }

        return recommendation as UserRecommendation
    })

    console.log(recommendations)
    return recommendations
}
