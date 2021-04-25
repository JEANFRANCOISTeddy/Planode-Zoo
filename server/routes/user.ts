import express from 'express';
import { UserController } from '../controllers/user.controller';
import { Pass, PassInstance, SpaceInstance, UserInstance } from '../models';

const userRouter = express.Router();

/**
 * Creation of new user
 */
userRouter.post("/create", async function (req, res) {
    const lastname = req.body.lastname;
    const firstname = req.body.firstname;
    const mail = req.body.mail;
    const phone = req.body.phone;
    const password = req.body.password;
    const admin = req.body.admin;
    const id_pass = req.body.id_pass;

    if (lastname === undefined || firstname === undefined || mail === undefined || phone === undefined || password === undefined || admin === undefined || id_pass === undefined) {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.create({
        lastname,
        firstname,
        mail,
        phone,
        password,
        admin,
        id_pass
    });

    if (user !== null) {
        res.status(201);
        res.json(user);
    } else {
        res.status(409).end();
    }
});

/*
function visit(user: UserInstance,pass : PassInstance, space:SpaceInstance){
    
    if(pass.route != undefined){
    var route  = pass.route?.split('/');
    if(route.length != undefined){
    const len = route.length;
    for(let i = 0; i < len ; i++){
        if(space.id == route[i]){
            
     //   space.infoHebdo ++ ;

        console.log("Welcome to the " + space.name + "space");

            
    
    }else {
        console.log("Error Pas de parcours");
    }

}

    }
}

}*/
export {
    userRouter
};