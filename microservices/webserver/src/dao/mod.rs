use sqlx::{Pool, MySql, Row};
use sqlx::mysql::MySqlRow;

use crate::user::{User, UserFactory};
use crate::referral_network::network_item_raw::{NetworkItemRaw, NetworkItemRawFactory};

pub async fn init_connection() -> Result<Pool<MySql>, sqlx::Error> {
    let pool = Pool::connect("mysql://vvgd8mawgfzp3a7te50o:pscale_pw_bLR8mW7ILIVgsTl5MogEVwtNtkq8cGIzxwEdha0IBx2@us-east.connect.psdb.cloud/connective-app?ssl={\"rejectUnauthorized\":true}").await;
    pool
}

pub async fn get_account(pool: &Pool<MySql>, id: &str) -> Result<User, ()> {
    let account = sqlx::query("SELECT Business.id, user_id, industry, occupation, status FROM Users JOIN Business ON Business.user_id = Users.id WHERE user_id = ? UNION ALL SELECT Individual.id, user_id, industry, occupation, status FROM Users JOIN Individual ON Individual.user_id = Users.id WHERE user_id = ?")
        .bind(id)
        .bind(id)
        .fetch_optional(pool)
        .await
        .map(|row: Option<MySqlRow>| {
            //Check to make sure the query found a value
            match row {
                //If it did, deserialize it into a User struct
                Some(row) => Ok(UserFactory::from_row(row)),
                //If not, return an error
                None => Err(())
            }
        }).unwrap(); //Not sure why we have to use unwrap here, but it works
        
    account //Return the account result
}

pub async fn get_users_in_network(pool: &Pool<MySql>, id: &str) -> Result<Vec<NetworkItemRaw>, ()> {
    println!("{}", id);
    let network = sqlx::query("SELECT * FROM network WHERE sender_id = ? or acceptor_id = ?")
        .bind(id)
        .bind(id)
        .fetch_all(pool)
        .await
        .map(|rows: Vec<MySqlRow>| {
            //Check to make sure the query found a value
            match rows.len() {
                //If it did, deserialize it into a NetworkItemRaw struct
                0 => Ok(Vec::<NetworkItemRaw>::new()),
                //If not, return an error
                _ => {
                    let mut network_items: Vec<NetworkItemRaw> = Vec::new();
                    for row in rows {
                        network_items.push(NetworkItemRawFactory::from_row(row));
                    }
                    Ok(network_items)
                }
            }
        }).unwrap(); //Not sure why we have to use unwrap here, but it works

    network //Return the network result
}

//Reads a column from the supplied row, and returns its value if it contains one or an empty string if not
pub fn safe_read_str(row: &MySqlRow, name: &str) -> String {
    row.try_get(name).unwrap_or("".to_string())
}

//Reads a column from the supplied row, and returns its value if it contains one or -1 if not
pub fn safe_read_int(row: &MySqlRow, name: &str) -> i64 {
    row.try_get(name).unwrap_or(-1)
}