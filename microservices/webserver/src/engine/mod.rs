use sqlx::{MySqlPool, MySql, Pool};
use warp::{Reply, Rejection, reply, hyper::StatusCode};

mod engine_weights;
mod recommendation_engine;

use crate::dao;
use engine_weights::EngineWeights;
use recommendation_engine::RecommendationEngine;

use self::recommendation_engine::RecommendationUser;

pub async fn get_recommendations(pool: Pool<MySql>, id: String) -> Result<impl Reply, Rejection> {
    //Reccomend user if within same industry, and has opposite status

    let account_result = dao::get_account(&pool, &id).await;
    if account_result.is_err() {
        return Ok(
            reply::with_status(
                "No account found".to_string(),
                StatusCode::OK
            )
        )
    };
    let account = account_result.unwrap();

    let engine = RecommendationEngine {
        industry: account.industry.clone(),
        weights: EngineWeights::get_weights(account.industry.clone())
    };

    let recommendations: Vec<RecommendationUser> = engine.get_reccomended_accounts(&pool, &account).await;
    /*
    let mut res: String = "".to_string();
    for recommendation in recommendations {
        res += &format!("{{points:{:?}, id:{:?}, industry:{:?}, occupation:{:?}, status:{:?}}}", recommendation.points, recommendation.user.id, recommendation.user.industry, recommendation.user.occupation, recommendation.user.status);
    }
    */
    let res = serde_json::to_string(&recommendations).unwrap();

    Ok(
        reply::with_status(
            format!("{:?}", res),
            StatusCode::OK
        )
    )
}