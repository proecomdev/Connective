pub struct EngineWeights {
    pub industry_weight: f64,
    pub occupation_weight: f64, 
    pub status_weight: f64,
    pub random_weight: f64
}

impl EngineWeights {
    /*
    pub fn is_valid(self) -> bool {
        self.industry_weight + self.occupation_weight + self.status_weight + self.random_weight == 1.0
    }
    */

    //Usage: Weights::get_standard_weights("5".to_string());
    pub fn get_standard_weights() -> EngineWeights {
        EngineWeights {
            industry_weight: 0.7,
            occupation_weight: 0.15,
            status_weight: 0.1,
            random_weight: 0.05
        }
    }

    pub fn get_weights(industry: String) -> EngineWeights {
        if industry == "0" { //Event management / planning
            EngineWeights {
                industry_weight: 0.7,
                occupation_weight: 0.15,
                status_weight: 0.1,
                random_weight: 0.05
            }
        } else if industry == "1" { //Web design / development
            EngineWeights {
                industry_weight: 0.5,
                occupation_weight: 0.15,
                status_weight: 0.3,
                random_weight: 0.05
            }
        } else if industry == "2" { //Other
            EngineWeights {
                industry_weight: 0.7,
                occupation_weight: 0.15,
                status_weight: 0.1,
                random_weight: 0.05
            }
        } else if industry == "3" { //SAAS
            EngineWeights {
                industry_weight: 0.7,
                occupation_weight: 0.15,
                status_weight: 0.1,
                random_weight: 0.05
            }
        } else {
            EngineWeights::get_standard_weights()
        }
    }
}