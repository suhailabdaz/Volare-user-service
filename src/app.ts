import { connectDB } from "./config/mongoDB.config";


class App{
  constructor(){
      connectDB()
  }
}

export default App