import './style.css';
import './app.css';
// import * as fs from './helpers/fs';

import logo from './assets/images/logo-universal.png';
import {Greet,ReadDirectory,Confirm} from '../wailsjs/go/main/App';

window.runtime.WindowSetTitle(" ")

document.querySelector('#app').innerHTML = `
    <img id="logo" class="logo">
    <button class="btn" onclick="openDirectoryDialog()">Buscar carpeta Para ver Estructura</button>
    <div class="result_dialog" id="result_dialog">result_dialog</div>
    <div class="result_folder" id="result_folder">result_folder</div>

`;
document.getElementById('logo').src = logo;

// let nameElement = document.getElementById("name");
// nameElement.focus();
let resultElement = document.getElementById("result_dialog");


// Setup the greet function
window.greet = function () {
    // RunTimeTesting
    // window.runtime.Hide()//esconde la aplicaicon a segundo plano, no minimiza
    // setTimeout(() => {
    //     window.runtime.Show()
    // }, 3000);
    // Get name
    let name = nameElement.value;

    // Check if the input is empty
    if (name === "") return;

    // Call App.Greet(name)
    try {
        Greet(name)
            .then((result) => {
                // Update result with data back from App.Greet()
                resultElement.innerText = result;
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
};

// Setup the greet function
window.readdir = function (item) {
    try {
        ReadDirectory(item)
            .then((result) => {
                console.log(result)
                document.getElementById("result_folder").innerText = " Su Estructura es \n" + result;
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
};

window.confirmDialog = function (item) {

    try {
        Confirm(item)
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
};

window.openDirectoryDialog = function (item) {

    try {
        window.go.main.App.OpenDialog()
        // OpenDialog({
        //         defaultDirectory: "C:/",
        //         title: "Please select a folder to save Top and Bot CAD files..."
        //     })
            .then((result) => {
                // Update result with data back from App.Greet()
                // resultElement.innerText = result;
                result = result.replace(/\\/gi,"\\\\")
                console.log(result)
                document.getElementById("result_dialog").innerText = " Tu path es " + result;
                window.readdir(result)
            })
            .catch((err) => {
                console.error(err);
            });
    } catch (err) {
        console.error(err);
    }
};

// console.log(fs.getDirectory("./helpers") )
