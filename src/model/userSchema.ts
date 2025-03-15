import mongoose, { Date } from "mongoose"
interface User{
    name:string,
    email:string,
    password:string,
    isAdmin:boolean,
    createdAt:Date
}
const UserSchema = new mongoose.Schema<User>({
    name: { type: String, required: true },
    email:{type :String, required:true,unique:true},
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, 
    createdAt: { type: Date, default: Date.now }

})

const User=mongoose.model('User',UserSchema)

export default User;