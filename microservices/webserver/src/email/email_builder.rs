use http::StatusCode;
use reqwest::{Client, Error};
use reqwest::header;
use serde_json::json;
use crate::EnvVars;

pub struct EmailBuilder {
    pub to: Vec<String>,
    pub subject: String,
    pub body: String,
    pub env_vars: EnvVars
}

impl EmailBuilder {
    //Adds a recipient to the email
    pub fn add_recipient(&mut self, recipient: String) {
        self.to.push(recipient);
    }

    //Sends an email with the set parameters
    pub async fn send(&self) -> Result<(), Error> {
        let recipients = self.to.iter().map(|to| {
            json!({"email": to})
        }).collect::<Vec<_>>();
        
        let body = json!(
            {
                "personalizations": [{
                    "to": recipients,
                }],
                "from": {
                    "email": self.env_vars.email,
                    "name": self.env_vars.name
                },
                "subject": self.subject,
                "content": [
                    {
                        "type": "text/html",
                        "value": self.body
                    }
                ]
            }
        );
    
        let client = Client::new()
            .post("https://api.sendgrid.com/v3/mail/send")
            .json(&body)
            .bearer_auth(&self.env_vars.key)
            .header(
                header::CONTENT_TYPE, 
                header::HeaderValue::from_static("application/json")
            );
    
        let response_result = client.send().await;
        if response_result.is_err() {
            return Err(response_result.err().unwrap());
        }
        let response = response_result.unwrap();

        match response.status() {
            StatusCode::OK | StatusCode::CREATED | StatusCode::ACCEPTED => println!("Email sent!"),
            _ => {
                    eprintln!(
                        "Unable to send your email. Status code was: {}. Body content was: {:?}",
                        response.status(),
                        response.text().await
                    )
            }
        }

        Ok(())
    }
}