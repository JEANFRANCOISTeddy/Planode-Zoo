import express from 'express';
import { userMiddleware } from "../middlewares/auth.middleware";
import { employeeMiddleware } from "../middlewares/employee.middleware";
import { PassController } from '../controllers';
import { SpaceController } from '../controllers';
import { UserController } from '../controllers';
import { PassInstance, SpaceInstance, UserInstance } from '../models';
import { verification } from '../index';
import { hash } from 'bcrypt';
import {accessMiddleware} from "../middlewares/access.middleware";
const chalk = require('chalk');
const userRouter = express.Router();


/**
 * Get all users created
 */
userRouter.get("/", employeeMiddleware, async function (req, res) {
    const userController = await UserController.getInstance();
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;
    const users = await userController.findAll({
        limit,
        offset
    });

    if (users !== null) {
        res.status(200);
        res.json(users);
    } else {
        res.status(409).end();
    }
});

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
    const role = req.body.role;
    const id_pass = req.body.id_pass;

    if (lastname === undefined || firstname === undefined || mail === undefined || phone === undefined || password === undefined || admin === undefined || role === undefined || id_pass === undefined) {
        res.status(400).end();
        return;
    }

    if (role !== "receptionist" && role !== "caretaker" && role !== "maintenance" && role !== "seller" && role !== "visitor") {
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
        role,
        id_pass
    });

    if (user !== null) {
        res.status(201);
        res.json(user);
    } else {
        res.status(409).end();
    }
});

/**
 * Log user and create session
 */
userRouter.post("/login", async function (req, res) {
    const mail = req.body.mail;
    const password = req.body.password;
    const id_zoo = req.body.id_zoo;
    if (mail === undefined || password === undefined || id_zoo === undefined) {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const session = await userController.login(mail, password, id_zoo);
    if (session === null) {
        res.status(404).end();
        return;
    } else {
        res.json({
            token: session.token
        });
    }
});

/**
 * Find a user by his id
 */
userRouter.get("/:id", async function (req, res) {
    const requestedId = req.params.id;
    if (requestedId === null) {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.findById(requestedId);
    if (user !== null) {
        res.status(200);
        res.json(user);
    } else {
        res.status(409).end();
    }
});

/**
 * Logout and delete session
 */
userRouter.delete("/logout", userMiddleware, async function (req, res) {
    const auth = req.headers["authorization"];
    if (auth === undefined) {
        res.status(400).end();
        return;
    }

    const token = auth.slice(7);
    const userController = await UserController.getInstance();
    const session = await userController.getSession(token);
    if (session == null) {
        res.status(403).end();
        return;
    }

    const session_destroy = await userController.logout({
        where: { id: session.id },
        force: true
    });

    if (session_destroy !== null) {
        res.status(200);
        res.json(session_destroy);
    } else {
        res.status(409).end();
    }
});

/**
 * Modify a created user
 */
userRouter.put("/update/:id", async function (req, res) {
    const userController = await UserController.getInstance();
    const requestedId = req.params.id;
    if (requestedId === null) {
        res.status(400).end();
        return;
    }

    const lastname = req.body.lastname;
    const firstname = req.body.firstname;
    const mail = req.body.mail;
    const phone = req.body.phone;
    const password = req.body.password;
    const admin = req.body.admin;
    const role = req.body.role;

    const user = await userController.findById(requestedId);
    if (user !== null) {
        user.lastname = req.body.lastname;
        user.firstname = req.body.firstname;
        user.mail = req.body.mail;
        user.phone = req.body.phone;
        user.password = await hash(req.body.password, 5);
        user.admin = req.body.admin;
        user.role = req.body.role;

        const userSaved = await user.save();
        if (userSaved !== null) {
            res.status(200);
            res.json(user);
        }
    } else {
        res.status(409).end();
    }
});

/**
 * Delete USER with a specify id
 */
userRouter.delete("/delete/:id", employeeMiddleware, async function (req, res) {
    const requestedId = req.params.id;
    if (requestedId === null) {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.deleteById({
        where: { id: requestedId },
        force: true
    });
    if (user !== null) {
        res.status(200);
        res.json(user);
    } else {
        res.status(409).end();
    }
});

userRouter.get("/enter/:id", accessMiddleware, async function (req, res) {
    const requestedId = req.params.id;

    UserController.getInstance().then(function (resultUser) {
        const user = resultUser.findById(requestedId);
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
                                return;
                            } else {
                                console.log(chalk.red("Your pass is useless"));
                                res.status(401).end();
                                return;
                            }
                        } else {
                            res.status(402).end();
                            return;
                        }
                    }
                });
            });
        });
    });
});


userRouter.get("/visit/:id/:id_space",accessMiddleware,  async function (req, res) {
    const requestedId = req.params.id;
    const requestedIdSpace = req.params.id_space;

    UserController.getInstance().then(function (resultUser) {
        const user = resultUser.findById(requestedId);
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
                        return;
                    }
                    if (requestedIdSpace == resP.space_now) {
                        console.log(chalk.red("You are already in !"));
                        res.status(400).end();
                        return;
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

                        if (resP.space_now != "0") {
                            if (route[result + 1] == route[test]) {


                            } else {
                                console.log(chalk.red("Wrong Road you have the Excape Game Pass ! "))
                                res.status(402).end();
                                return;
                            }

                        } else if ((result == 0) && (route[0] == requestedIdSpace)) {


                        } else {
                            console.log(chalk.red("Wrong Road you have the Excape Game Pass ! "))
                            res.status(402).end();
                            return;
                        }
                    }





                    SpaceController.getInstance().then(function (resultSpace) {

                        const space = resultSpace.findById(spaceUtil);
                        space.then(function (resS) {
                            if (resS === null) {
                                console.log("L'espace n'existe pas");
                                res.status(404).end();
                                return;
                            }

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
        const user = resultUser.findById(requestedId);
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

export {
    userRouter
};