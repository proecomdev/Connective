use sqlx::mysql::MySqlRow;
use crate::dao;

#[derive(Debug)]
pub struct NetworkItemRaw {
    pub id: i64,
    pub sender_id: i64,
    pub acceptor_id: i64
}

pub struct NetworkItemRawFactory;

impl NetworkItemRawFactory {
    pub fn from_row(row: MySqlRow) -> NetworkItemRaw {
        NetworkItemRaw {
            id: dao::safe_read_int(&row, &"id".to_string()),
            sender_id: dao::safe_read_int(&row, &"sender_id".to_string()),
            acceptor_id: dao::safe_read_int(&row, &"acceptor_id".to_string())
        }
    }
}