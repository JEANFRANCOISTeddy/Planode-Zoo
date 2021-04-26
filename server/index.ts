import { config } from "dotenv";
config();
import express, { Express } from "express";
import bodyParser from "body-parser";

import { Pass, PassInstance, SequelizeManager, SpaceInstance } from "./models";
import { buildRoutes } from "./routes";
import userModel, { UserInstance } from "./models/user.model";


import { UserController, PassController, SpaceController } from "./controllers/index";

import { type } from "node:os";
const chalk = require('chalk');
var cron = require("node-cron");
const app: Express = express();

app.use(bodyParser.json());

buildRoutes(app);

//start(visit);
/*
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

}*/


/*
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

}*/




//let sleep = require('util').promisify(10000);



export function verification(pass: PassInstance) {


  let maDate = new Date();
  maDate.setFullYear(2021);
  maDate.setMonth(4);
  maDate.setHours(14);
  maDate.setDate(26);





  let nHeure = maDate.getHours();
  let nJour = maDate.getDate();
  let nJourWeek = maDate.getDay();
  let nMonth = maDate.getMonth();
  let nYear = maDate.getFullYear();
  var start = pass.day_start_validation.split("/");
  var end = pass.day_end_validation.split("/");



  console.log(nJour);


  if (pass.id != undefined) {


    switch (pass.id.toString()) {

      case '1' || '4':

        if ((parseInt(start[0]) <= nJour) && (parseInt(end[0]) >= nJour) && (parseInt(start[2]) == nYear) && (parseInt(start[1]) == nMonth)) {

          if (nHeure > 18 && nHeure < 7) {
            console.log("It's too late, Buy th Night Pazss to get Access");
            console.error("tooLate");
            return false;
          }

          if (nJourWeek > 5) {
            console.log("It's the Week-End, Buy the Week end Pass to get Access");
            console.error("Week-End");
            return false;
          }

        } else {

          console.log(chalk.red("Wrong Day"));
          return false;
        }

        return true;


      case '2':
        if ((parseInt(start[0]) <= nJour) && (parseInt(end[0]) >= nJour) && (parseInt(start[2]) == nYear) && (parseInt(start[1]) == nMonth)) {
          if (nHeure < 18 && nHeure > 7) {
            console.log("It's too early !  Buy the Day Pass to get Access !");
            console.error("tooEarly");
            return false;
          }
          if (nJourWeek > 5) {
            console.log("It's the Week-End, Buy the Week end Pass to get Access");
            console.error("Week-End");
            return false;
          }
        } else {
          console.log(chalk.red("Wrong Day"));
          return false;
        }
        return true;

      case '3':
        if ((parseInt(start[0]) <= nJour) && (parseInt(end[0]) >= nJour) && (parseInt(start[2]) == nYear) && (parseInt(start[1]) == nMonth)) {
          if (nJourWeek < 5) {
            console.log("It's not the Week-End !  Buy a different Ticket to get Access");
            console.error("Not the Week-End");
            return false;
          }
        } else {
          console.log(chalk.red("Wrong Day"));
          return false;
        }

        return true;





      case '5':
        return true;

      default:
        console.log(pass.id);
        console.log('Out Of expression');
        return false;


    }

  }

}












cron.schedule('*/30 * * * * * ', () => {
  Quoti();
});

cron.schedule('*/2 * * * *', () => {
  Hebdo()
});
//chron.add(10, Quoti()); // called every 10 seconds / Quoti
//chron.add(150, Hebdo()); // called every 100 seconds / Hebdo

async function Quoti() {
  console.log(chalk.blue("NEW INFO QUOTI"))
  for (let j = 0; j < 4; j++) {
    SpaceController.getInstance().then(function (resultSpace) {
      const space = resultSpace.findById({
        where: { id: j }

      });
      space.then(async function (res) {
        if (res != undefined) {

          console.log(chalk.yellow("Info Quotidienne sur l'espace " + res.name + " qui a fais " + res.infoQuoti + " Visite"));


          res.infoQuoti = 0;
          res.save();
          console.log("----------------------");
        }

      });
    });
  }
}




function Hebdo() {
  console.log(chalk.blue("NEW INFO Hebdo"))
  for (let j = 0; j < 4; j++) {
    SpaceController.getInstance().then(function (resultSpace) {
      const space = resultSpace.findById({
        where: { id: j }

      });
      space.then(async function (res) {
        if (res != undefined) {
          console.log(chalk.blue("NEW INFO HEBDO"))
          console.log(" Info Hebdomadaire sur l'espace " + res.name + " qui a fais " + res.infoHebdo + " Visite")
          res.infoHebdo = 0;
          await res.save();

        }

      });
    });
  }
}


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Listening on ${port}...`);
});





