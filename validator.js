"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Concentration_req_json_1 = __importDefault(require("./Concentration_req.json"));
// Read concentration reqs json file
// const CONCENTRATION_REQUIREMENTS = await ((await fetch("./Concentration_req.json")).json())
console.log(Concentration_req_json_1.default);
// set up classes the student has already taken
const alreadyTaken = ["CSCI 0190", ""];

