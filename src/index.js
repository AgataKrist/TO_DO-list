import './styles/main.scss'
import { Application } from "./Application";
import { auth } from "./auth";

//вызываем класс и в параметре указываем в какой блок будет
// Applcation изначально ложиться новый созданный элемент
const notCompleted = new Application({
   el: document.querySelector(".notCompleted")
})



