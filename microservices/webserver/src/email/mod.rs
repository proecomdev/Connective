use crate::EnvVars;
mod email_builder;
use email_builder::EmailBuilder;

pub async fn test_email(env_vars: EnvVars) {
    let mut builder = EmailBuilder {
        to: Vec::new(),
        subject: "Yet another test email".to_string(),
        body: "<a href=\"https://www.google.com\">Another test link</a>".to_string(),
        env_vars
    };

    builder.add_recipient("kkingsbe@gmail.com".to_string());
    
    let email_send_result = builder.send().await;

    if email_send_result.is_err() {
        println!("Error sending email: {:?}", email_send_result.err().unwrap());
    }
}