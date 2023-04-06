use sqlx::{FromRow, mysql::MySqlRow};
use serde::Serialize;
use crate::dao;

#[derive(Clone, Debug, FromRow, Serialize)]
pub struct User {
    pub id: i64,
    pub user_id: i64,
    pub industry: String,
    pub occupation: String,
    pub status: String,
    pub show_on_discover: bool,
    pub email: String,
    pub username: String,
    pub logo: String,
    pub description: String
}

pub struct UserFactory {}

impl UserFactory {
    pub fn from_row(row: MySqlRow) -> User {
        User {
            id: dao::safe_read_int(&row, &"user_id".to_string()),
            user_id: dao::safe_read_int(&row, &"user_id".to_string()),
            industry: dao::safe_read_str(&row, &"industry".to_string()),
            occupation: dao::safe_read_str(&row, &"occupation".to_string()),
            status: dao::safe_read_str(&row, &"status".to_string()),
            show_on_discover: dao::safe_read_int(&row, &"show_on_discover".to_string()) == 1,
            email: dao::safe_read_str(&row, &"email".to_string()),
            username: dao::safe_read_str(&row, &"username".to_string()),
            logo: dao::safe_read_str(&row, &"logo".to_string()),
            description: dao::safe_read_str(&row, &"description".to_string())
        }
    }
}