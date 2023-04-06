pub mod network_item_raw;
use crate::{dao, user::User};

/**
 * Handle network invite request
 *  - Check if the user is already in the network
 *  - Send email
 *  - Add to db
 * Get network graph for user
 */

pub struct NetworkNode {
    pub user: User,
    pub network: Vec<NetworkNode>
}

pub struct ReferralNetwork {

}

pub struct ReferralNetworkFactory {
    pub pool: sqlx::MySqlPool
}

impl ReferralNetworkFactory {
    pub async fn from_user(&self, user: User) -> Result<ReferralNetwork, ()> {
        let res = self.from_user_id(user.id).await;

        if res.is_err() {
            return Err(());
        }

        Ok(res.unwrap())
    }

    pub async fn from_user_id(&self, user_id: i64) -> Result<ReferralNetwork, ()> {
        //TODO: Convert into Network Node Graph

        let network_raw_result = dao::get_users_in_network(&self.pool, &user_id.to_string()).await;

        if network_raw_result.is_err() {
            println!("{:?}", network_raw_result);
            return Err(());
        }

        let network_raw = network_raw_result.unwrap();
        println!("Network:");
        println!("{:?}", network_raw);

        Ok(ReferralNetwork {

        })
    }
}

pub fn send_email() {
    println!("referral_network::send_email unimplemented");
}

/*
pub async fn invite(sender_id: String, reciever_id: String) -> Result<bool, _> {
    /**
     * Check if the user is already in the network
     * Send email
     * Add to db
     */


}

pub async fn get_user_network(user_id: String) -> Result<(), _> {
    /**
     * Get network graph for user
     */
}
*/