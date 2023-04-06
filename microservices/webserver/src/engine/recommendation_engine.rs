use sqlx::{Pool, mysql::MySqlRow, MySql};
use rand::Rng;
use serde::Serialize;
use crate::user::{User, UserFactory};
use super::engine_weights::EngineWeights;

#[derive(Debug, Serialize, Clone)]
pub struct RecommendationUser {
    pub user: User,
    pub points: f64
}

pub struct RecommendationEngine {
    pub industry: String,
    pub weights: EngineWeights
}

impl RecommendationEngine {
    pub async fn get_reccomended_accounts(self, pool: &Pool<MySql>, user: &User) -> Vec<RecommendationUser> {
        let mut accounts_in_industry: Vec<User> = Vec::new();
        
        sqlx::query("SELECT 
                            Business.id,
                            user_id, 
                            industry, 
                            occupation, 
                            status, 
                            username, 
                            logo, 
                            description, 
                            email, 
                            show_on_discover 
                            FROM Business 
                            JOIN Users on Business.user_id = Users.id 
                            WHERE industry = ? 
                            AND show_on_discover = 1
                            UNION ALL 
                            SELECT 
                            Individual.id,
                            user_id, 
                            industry, 
                            occupation, 
                            status, 
                            username, 
                            profile_picture AS logo, 
                            bio AS description, 
                            email, 
                            show_on_discover 
                            FROM Individual 
                            JOIN Users on Individual.user_id = Users.id 
                            WHERE industry = ?
                            AND show_on_discover = 1
                    ")
            .bind(&user.industry)
            .bind(&user.industry)
            .fetch_all(pool)
            .await
            .map(|rows: Vec<MySqlRow>| {
                for row in rows {
                    accounts_in_industry.push(UserFactory::from_row(row));
                }
            }).unwrap();
    
        let recommendations = self.sort_recommendations(accounts_in_industry, user);
        recommendations.to_vec()
    }

    fn sort_recommendations(self, accounts: Vec<User>, user: &User) -> Vec<RecommendationUser> {
        let mut rng = rand::thread_rng();
        let mut recommendations: Vec<RecommendationUser> = Vec::new();
    
        for account in accounts {
            let mut temp_user = RecommendationUser {
                user: account.clone(),
                points: 0.0
            };

            //Prioritize same industry
            if account.industry == user.industry && account.status != user.status {
                temp_user.points += 100.0 * self.weights.industry_weight;
            }

            //Deprioritize same occupation (web dev doesn't want to see another web dev)
            if account.occupation != user.occupation && account.occupation != "-1" {
                if (account.occupation == "10" && user.occupation == "11") || (account.occupation == "11" && user.occupation == "10") {
                    //Designer & design studio are the same
                } else if (account.occupation == "12" && user.occupation == "13") || (account.occupation == "13" && user.occupation == "12") {
                    //Marketer & marketing studio are the same
                } else if (account.occupation == "8" && user.occupation == "9") || (account.occupation == "9" && user.occupation == "8") {
                    //Developer & dev studio are the same
                } else {
                    temp_user.points += 100.0 * self.weights.occupation_weight;
                }                
            }

            //Deprioritize same status (a user looking for clients will gain no value from another user also looking for clients)
            if account.status != "" && account.status != user.status {
                temp_user.points += 100.0 * self.weights.status_weight;
            }

            //Randomnize the points a little bit to change the order around
            temp_user.points += 100.0 * self.weights.random_weight * rng.gen::<f64>();

            //println!("{}", temp_user.points);
            recommendations.push(temp_user);
        }
        recommendations.sort_by(|a,b| b.points.partial_cmp(&a.points).unwrap());
        recommendations
    }
}