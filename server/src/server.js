require("dotenv").config();
const env=require("./config/env");
const app=require("./app");
const {connectDatabase}=require("./config/db");

(async()=>{
  try{
    await connectDatabase();
    app.listen(env.PORT,()=>console.log(`Blogify API listening on port ${env.PORT}`));
  }catch(error){ console.error("Startup failed",error); process.exit(1); }
})();
