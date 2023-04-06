use dao::init_connection;
use sqlx::{Pool, MySql};
use warp::Filter;
use dotenv;
use std::env;

mod engine;
mod dao;
mod user;
mod email;
mod referral_network;

#[derive(Debug)]
pub struct EnvVars {
    pub key: String,
    pub email: String,
    pub name: String
}

#[tokio::main]
async fn main() {
    let env_vars = get_env_vars();
    println!("{:?}", env_vars);

    let pool_result = dao::init_connection().await;
    if pool_result.is_err() {
        println!("Failed to connect to database");
        return;
    };

    let pool = pool_result.unwrap();

    //email::test_email(env_vars).await;
    let rnf = referral_network::ReferralNetworkFactory {
        pool: pool.clone()
    };

    let user_network_result = rnf.from_user_id(1).await;
    if user_network_result.is_err() {
        println!("Failed to get user network");
    };

    let reccomendations_route = warp::path!("recommendations" / String)
        .and(warp::any().map(move || pool.clone())) // allows passing "pool" argument
        .and_then(|id, pool: Pool<MySql>| engine::get_recommendations(pool, id))
        .with(warp::cors().allow_any_origin().allow_methods(vec!["OPTIONS", "GET", "POST", "DELETE", "PUT"]));

    warp::serve(reccomendations_route)
        .run(([0, 0, 0, 0], 6969))
        .await;
}

fn get_env_vars() -> EnvVars {
    dotenv::dotenv().ok();

    EnvVars {
        key: env::var("SENDGRID_API_KEY").expect("SENDGRID_API_KEY must be set"),
        email: env::var("SENDER_EMAIL").expect("SENDER_EMAIL must be set"),
        name: env::var("SENDER_NAME").expect("SENDER_NAME must be set")
    }
}