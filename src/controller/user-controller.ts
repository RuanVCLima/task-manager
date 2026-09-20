import {Request, Response} from "express"

class UserController{
    async create(request: Request, response: Response){
        return response.json({message: "ok"})
    }
}

export {UserController}