# Linx

Linx is a social media app built with the MERN stack ( mongodb , express , react , node )

If you are new to MERN stack , reading the code would be pretty helpful to get you started .

# Try the demo

You can try this app here : [demo](https://linxx.herokuapp.com/)

[![](https://res.cloudinary.com/ariasalehi/image/upload/v1595913505/minimal_browser_ksdfuj.png)](https://linxx.herokuapp.com/)

# Run it on your computer
#### 1. Clone this repo :

Download the repo from [here](https://github.com/aria-salehi/mern-stack-instagram-clone-social-media-app/archive/master.zip)
    
or
  
Clone the repo by typing the following command in your terminal (you should have git installed) : 
  
    git clone https://github.com/aria-salehi/mern-stack-instagram-clone-social-media-app

#### 2. Create a [cluster in mongodb](https://docs.atlas.mongodb.com/getting-started/) 

#### 3. Create a [dotenv (.env) file](https://dev.to/getd/how-to-manage-secrets-and-configs-using-dotenv-in-node-js-and-docker-2214) in the config folder (inside server folder)

#### 4. Create a [database connection string](https://studio3t.com/knowledge-base/articles/connect-to-mongodb-atlas/#:~:text=Get%20the%20connection%20string%20from%20MongoDB%20Atlas,-Log%20in%20to&text=Choose%20Connect%20Your%20Application.,Copy%20the%20generated%20connection%20string.)

Type the following code in .env file :    

    MONGO_URI=[your connection string]
    JWT_SECRET=[type some random text here]
   
#### 5. Create a config.js file in the src folder located in client folder (/client/src/config.js) and type the following text :

    export const API_URL =[your api url]
       
#### 6. Install [yarn](https://classic.yarnpkg.com/)
#### 7. Navigate to server folder in your terminal and run yarn install
#### 8. Navigate to client folder in your terminal and run yarn install
#### 9. Run yarn run dev (this is a custom command that I added to the package.json) in the server folder in your terminal
#### 10. Run yarn start in the client folder in your terminal
