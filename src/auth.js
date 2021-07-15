// Конфигурация нашего firebase UI
const firebaseConfig = {
    apiKey: "AIzaSyCpQzT739SzbhetaywDUItzR3ZjBmgVOwQ",
    authDomain: "romelloauth.firebaseapp.com",
    projectId: "romelloauth",
    storageBucket: "romelloauth.appspot.com",
    messagingSenderId: "386803724487",
    appId: "1:386803724487:web:938e8fd06c9d01f4c90ee2"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const database = firebase.database()

const $loginForm = document.querySelector('.login-form')
const $logged = document.querySelector('.logged')
const $loginBtn = document.querySelector('.login-button')
const $regBtn = document.querySelector('.register-button')
const $logoutBtn = document.querySelector('.logout-button')
const $content = document.querySelector('.content')
const $prelouder = document.querySelector('.preloader')
const $passwordInputError = document.querySelector('.passwordinput-error')    
let userEmail = localStorage.getItem('userEmail')


firebase.auth().onAuthStateChanged(function(user) {
       if (user) {
            $prelouder.style.display = 'none';
            $loginForm.classList.add('hide')
            $logged.classList.remove('hide')
            $content.classList.remove('hide')
            var user = firebase.auth().currentUser
        } else if (user != null) {
            var email_id = user.email
            $prelouder.style.display = 'none'
        } else {
            $prelouder.style.display = 'none'
        }
    })

// Правила https://firebasetutorials.com/firebase-realtime-database-rules/

$loginBtn.addEventListener('click', login)
$regBtn.addEventListener('click', register)
$logoutBtn.addEventListener('click', signOut)

function register() {
    let emailInput = document.querySelector('.emailinput').value;
    let passInput = document.querySelector('.passwordinput').value;

    userEmail = localStorage.setItem('userEmail', emailInput)

    // Валидация e-mail
    if (ValidateEmail(emailInput) === false) {
        $passwordInputError.innerHTML = "Вы ввели некорректный e-mail"
        setTimeout(() => {
            $passwordInputError.innerHTML = ""
        }, 3000)
        return
    }

    // Валидация пароля > 6 символов
    if (passInput.length < 6) {
        $passwordInputError.innerHTML = "Пароль должен быть больше 6 символов"
        setTimeout(() => {
            $passwordInputError.innerHTML = ""
        }, 3000)
        return
    }

    auth.createUserWithEmailAndPassword(emailInput, passInput)
        .then(() => {
            // Объявляем пользователя
            var user = auth.currentUser
            // Сохраняем введеные данные в БД
            var database_ref = database.ref()
            // Создаем данные о юзере в Firebase БД
            var user_data = {
                    email: emailInput,
                    last_login: Date.now()
                }
            // Сохраняем user_data под уникальным user.uid
            database_ref.child('users/' + user.uid).set(user_data)
            userEmail = localStorage.getItem('userEmail')

            setTimeout(function() {
                // alert('Вы успешно зарегистрировались, приятного полета')
                document.querySelector('.emailinput').value = ""
                document.querySelector('.passwordinput').value = ""
            }, 100)
        })
        .catch((error) => {
            // Ловим ошибки в случае возникновения
            var errorCode = error.code
            var errorMessage = error.message
            if (error.code === 'auth/email-already-in-use') {
                $passwordInputError.innerHTML = "Пользователь с таким email уже зарегистрирован"
            }
            console.log(error)
            setTimeout(() => {
                $passwordInputError.innerHTML = ""
            }, 3000)
        })
        return userEmail
}


function login() {
    let emailInput = document.querySelector('.emailinput').value;
    let passInput = document.querySelector('.passwordinput').value;

    userEmail = localStorage.setItem('userEmail', emailInput)

    auth.signInWithEmailAndPassword(emailInput, passInput)
        .then(() => {
            // Объявляем пользователя
            var user = auth.currentUser
                // Обновляем информацию о пользователе в БД
            var database_ref = database.ref()
                // Данные обновились
            var user_data = {
                    last_login: Date.now()
                }
                // Обновляем параметры user_data под user.uid
            database_ref.child('users/' + user.uid).set(user_data)
                // Таймаут для входа
            // setTimeout(function() {
            //     alert('Вы успешно вошли в систему, можете поиграться')
            // }, 100)

            document.querySelector('.emailinput').value = ""
            document.querySelector('.passwordinput').value = ""
            $loginForm.classList.add('hide')
            $logged.classList.remove('hide')
            $content.classList.remove('hide')
        })
        .catch((error) => {
            // Ловим ошибки
            var errorCode = error.code
            var errorMessage = error.message
            // alert(errorMessage)
      
            if (error.code === 'auth/wrong-password') {
                $passwordInputError.innerHTML = "Вы ввели неверный пароль"
            } else if (error.code === 'auth_email-already-exists') {
                $passwordInputError.innerHTML = "Пользователь с таким email уже зарегистрирован"
            } else if (error.code === 'auth/invalid-email') {
                $passwordInputError.innerHTML = "Указан неправильный адрес электронной почты"
            } else if (error.code === 'auth/user-not-found') {
                $passwordInputError.innerHTML = "Пользователь с таким email не обнаружен"
            }
            setTimeout(() => {
                $passwordInputError.innerHTML = ""
            }, 3000)
        })

    userEmail = document.querySelector('.emailinput').value
    return userEmail
}


function ValidateEmail(emailInput) {
    if (emailInput.length <= 0) {
        return false
    }
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailInput)) {
        return true
    } else {
        return false
    }
}

function signOut() {
    firebase.auth().signOut()
    .then(() => {
        // Sign-out successful.
        $logged.classList.add('hide')
        $content.classList.add('hide')
        $loginForm.classList.remove('hide')
        userEmail = localStorage.removeItem('userEmail')
    })
    .catch((error) => {
        // An error happened.
    });
}



export { userEmail }
