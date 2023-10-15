const totp = require("totp-generator")

export default async function handler(req, res){
    if(req.method === "POST"){
        return await TOTPValue(req, res)
    }else{
        res.status(405).json({error: `${req.method} is not allowed!`})
    }

}

async function TOTPValue(req, res){
    const token = totp(req.body.token)
    if(token){
        res.status(200).json({otp: token})
    }
}