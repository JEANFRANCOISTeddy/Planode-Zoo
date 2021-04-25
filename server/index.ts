import { config } from "dotenv";
config();
import express, { Express } from "express";
import bodyParser from "body-parser";

import { Pass, PassInstance, SequelizeManager, SpaceInstance } from "./models";
import { buildRoutes } from "./routes";
import userModel, { UserInstance } from "./models/user.model";


import { UserController, PassController, SpaceController } from "./controllers/index";

import { type } from "node:os";

var cron = require("node-cron");
const app: Express = express();

app.use(bodyParser.json());

buildRoutes(app);

start(visit);

function visit(user: UserInstance, pass: PassInstance) {
  var route = pass.route?.split('/');
  if (route === null)
    return ("Pas d'espace");
  const len = route.length;

  for (let i = 0; i < len; i++) {
    SpaceController.getInstance().then(function (resultSpace) {
      const space = resultSpace.findById({
        where: { id: route[i] }
      });
      space.then(function (res) {
        if (res === null)
          return ("L'espace n'existe pas");
        if (res.id == undefined)
          return ("No Idea");


        res.infoHebdo++;
        res.infoQuoti++;


        console.log("ok");

        console.log("Welcome to the " + res.name + " space");
        res.save();



      });


    });
  }

}



function start(callback: { (user: UserInstance, pass: PassInstance): "Pas d'espace" | undefined; (arg0: UserInstance, arg1: PassInstance): void; }) {
  for (let i = 1; i <= 2; i++) {
    UserController.getInstance().then(function (resultUser) {
      const user = resultUser.findById({
        where: { id: i }
      });
      user.then(function (resU) {
        for (let j = 1; j <= 2; j++) {
          PassController.getInstance().then(function (resultPass) {
            const pass = resultPass.findById({
              where: { id: j }
            });
            pass.then(function (resP) {

              console.log(resU?.id_pass);
              if (resP?.id != resU?.id_pass) {
                if (resP != null && resP.valid != true) {
                  if (verification(resP) == true) {
                    resP.valid = true;
                    console.log("------------------- Welcome to Planode-Zoo ----------------------");

                    if (resU === null) {
                      return "User existe pas";
                    }
                    callback(resU, resP);
                  }




                } else {
                  return console.error("Not allow");
                }
              } else {
                console.log("test");

              }
            });
          });
        }

      });
    });
  }

}




//let sleep = require('util').promisify(10000);



function verification(pass: PassInstance) {


  const maDate = new Date("April 5, 2015 12:15:00");
  const nHeure = maDate.getHours();
  const nJour = maDate.getDay();
  if (pass.id != undefined) {

    switch (pass.id.toString()) {

      case '1':

        if (nHeure > 18 && nHeure < 7) {
          console.log("It's too late, Buy th Night Pazss to get Access");
          return console.error("tooLate");
        }
        if (nJour > 5) {
          console.log("It's the Week-End, Buy the Week end Pass to get Access");
          return console.error("Week-End");
        }
        return true;
        break;

      case '2':

        if (nHeure < 18 && nHeure > 7) {
          console.log("It's too early !  Buy the Day Pass to get Access !");
          return console.error("tooEarly");

        }
        if (nJour > 5) {
          console.log("It's the Week-End, Buy the Week end Pass to get Access");
          return console.error("Week-End");
        }
        return true;

      case '3':

        if (nJour < 5) {
          console.log("It's not the Week-End !  Buy a different Ticket to get Access");
          return console.error("Not the Week-End");
        }

        return true;

      case '5':
        return true;

      default:
        console.log(pass.id);
        console.log('Out Of expression');
        break;


    }

  }

}












cron.schedule('*/20 * * * * * ', () => {
  Quoti();
});

cron.schedule('*/30 2 * * * *', () => {
  Hebdo()
});
//chron.add(10, Quoti()); // called every 10 seconds / Quoti
//chron.add(150, Hebdo()); // called every 100 seconds / Hebdo

async function Quoti() {

  for (let j = 0; j < 4; j++) {
    SpaceController.getInstance().then(function (resultSpace) {
      const space = resultSpace.findById({
        where: { id: j }

      });
      space.then(async function (res) {
        if (res != undefined) {
          console.log("Info Quotidienne sur l'espace " + res.name + " qui a fais " + res.infoHebdo + " Visite")

          res.infoQuoti = 0;
          await res.save();
          console.log("AAAAAAAAAAAAAH");
        }

      });
    });
  }
}




function Hebdo() {

  for (let j = 0; j < 4; j++) {
    SpaceController.getInstance().then(function (resultSpace) {
      const space = resultSpace.findById({
        where: { id: j }

      });
      space.then(function (res) {
        if (res != undefined) {
          console.log(" Info Hebdomadaire sur l'espace " + res.name + " qui a fais " + res.infoHebdo + " Visite")
          res.infoHebdo = 0;
          res.save();
        }

      });
    });
  }
}


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Listening on ${port}...`);
});





