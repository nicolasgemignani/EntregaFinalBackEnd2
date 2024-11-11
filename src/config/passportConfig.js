import passport from "passport";
import jwt from 'passport-jwt'
import { variables } from "./var.entorno.js";


const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

export const initializePassport = () => {

    const cookieExtractor = req => {
        let token = null
        if (req && req.cookies){
            token = req.cookies['token']
        }
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: variables.PRIVATE_KEY
    }, async (jwt_payload, done) =>{
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

}