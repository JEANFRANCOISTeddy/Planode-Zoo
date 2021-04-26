import express from 'express';
import { PassController } from '../controllers';


import { SpaceController } from '../controllers';
import { UserController } from '../controllers';
import { Pass, PassInstance, SpaceInstance, UserInstance } from '../models';
import { verification } from '../index';
import { reset } from 'chalk';
import { spaceRouter } from './space';
import { resolveModuleName } from 'typescript';
const chalk = require('chalk');
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

userRouter.get("/enter/:id", async function (req, res) {
    const requestedId = req.params.id;

    UserController.getInstance().then(function (resultUser) {
        const user = resultUser.findById({
            where: { id: requestedId }
        });
        user.then(function (resU) {
            if (resU === null) {
                return "User existe pas";
            }


            PassController.getInstance().then(function (resultPass) {
                const pass = resultPass.findById({
                    where: { id: resU?.id_pass }
                });

                pass.then(function (resP) {

                    if (resP != null && resP.valid != true) {
                        if (verification(resP) == true) {
                            if (resP.valid == false) {
                                resP.valid = true;
                                resP.save();
                                console.log(chalk.green("------------------- Welcome to Planode-Zoo ----------------------"));

                                res.status(200).end();
                            } else {
                                console.log(chalk.red("Your pass is useless"));
                                res.status(401).end();
                            }
                        } else {
                            res.status(402).end();
                        }
                    }

                });

            });
        });
    });
});


userRouter.get("/visit/:id/:id_space", async function (req, res) {
    const requestedId = req.params.id;
    const requestedIdSpace = req.params.id_space;

    UserController.getInstance().then(function (resultUser) {
        const user = resultUser.findById({
            where: { id: requestedId }
        });
        user.then(function (resU) {
            if (resU === null) {
                return "User existe pas";
            }
            PassController.getInstance().then(function (resultPass) {
                const pass = resultPass.findById({
                    where: { id: resU?.id_pass }
                });

                pass.then(function (resP) {

                    if (resP == null) {
                        console.log(chalk.red("Pas d'espace de ce nom"));
                        res.status(404).end();
                        return;
                    }
                    if (resP.valid == false) {
                        console.log(chalk.red("Enter in the zoo before !"));
                        res.status(402).end();

                    }

                    if (requestedIdSpace == resP.space_now) {
                        console.log(chalk.red("You are already in !"));
                        res.status(400).end();
                    }
                    var route = resP.route?.split('/');


                    const len = route.length;

                    var test = 0;
                    var result = 0;
                    var spaceUtil = "0";
                    for (let i = 0; i < len; i++) {
                        if (route[i] == requestedIdSpace) {
                            spaceUtil = route[i];
                            test = i;
                        }


                    }

                    if (spaceUtil == "0") {
                        console.log(chalk.red("You don't have the access to this space"));
                        res.status(402).end();
                    }

                    if (resP.id == "4") {
                        for (let i = 0; i < len; i++) {
                            if (route[i] == resP.space_now) {
                                result = i;

                            }

                        }
                        if (route[result + 1] != route[test]) {
                            console.log(chalk.red("Wrong Road you have the Excape Game Pass ! "))
                            res.status(402).end();
                            return;

                        }



                    }


                    SpaceController.getInstance().then(function (resultSpace) {

                        const space = resultSpace.findById({
                            where: { id: spaceUtil }
                        });
                        space.then(function (resS) {
                            if (resS === null)
                                return ("L'espace n'existe pas");
                            if (resS.id == undefined)
                                return ("No Idea");


                            resS.infoHebdo++;
                            resS.infoQuoti++;
                            resP.space_now = requestedIdSpace;




                            console.log("Welcome to the " + resS.name + " space");

                            resS.save();
                            resP.save();
                            res.status(200).end();
                            return;




                        });



                    });

                });
            });
        });
    });
});


userRouter.get("/exit/:id", async function (req, res) {
    const requestedId = req.params.id;

    UserController.getInstance().then(function (resultUser) {
        const user = resultUser.findById({
            where: { id: requestedId }
        });
        user.then(function (resU) {
            if (resU === null) {
                return "User existe pas";
            }


            PassController.getInstance().then(function (resultPass) {
                const pass = resultPass.findById({
                    where: { id: resU?.id_pass }
                });

                pass.then(function (resP) {
                    /*
                                        if (resP != null && resP.valid != true) {
                                            if (verificationExit(resP) == true) {
                                                if (resP.valid == false) {
                                                    resP.valid = true;
                                                    resP.save();
                                                    console.log(chalk.green("------------------- Welcome to Planode-Zoo ----------------------"));
                    
                                                    res.status(200).end();
                                                } else {
                                                    console.log(chalk.red("Your pass is useless"));
                                                    res.status(401).end();
                                                }
                                    } 
                                        }*/

                });

            });
        });
    });
});







/*
userRouter.post("/:id/:id_pass/:id_space", async function (req, res) {
    {
 
        if (pass.route != undefined) {
            var route = pass.route?.split('/');
            if (route.length != undefined) {
                const len = route.length;
                for (let i = 0; i < len; i++) {
                    if (space.id == route[i]) {
 
                        //   space.infoHebdo ++ ;
 
                        console.log("Welcome to the " + space.name + "space");
 
 
 
                    } else {
                        console.log("Error Pas de parcours");
                    }
 
                }
 
            }
        }
 
    }*/
export {
    userRouter
};