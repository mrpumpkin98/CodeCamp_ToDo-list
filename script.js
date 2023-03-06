//===================>>>[ todo 리스트 목록을 만드는 기능 ]<<<==================
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');

const savedWeatherData = JSON.parse(localStorage.getItem('saved-weather'));
const savedTodoList = JSON.parse(localStorage.getItem('saved-items'));

const createTodo = function (storageDate) {
    let todoContents = todoInput.value;
    if (storageDate) {
        todoContents = storageDate.contents;
    }

    const newLi = document.createElement('li');
    const newSpan = document.createElement('span');
    const newBtn = document.createElement('button');

    newBtn.addEventListener('click', () => {
        newLi.classList.toggle('complete');
        saveItemsFn();
    })

    newLi.addEventListener('dblclick', () => {
        newLi.remove();
        saveItemsFn();
    })

    if (storageDate?.complete === true) {
        newLi.classList.add('complete')
    }

    newSpan.textContent = todoContents;
    newLi.appendChild(newBtn);
    newLi.appendChild(newSpan);
    todoList.appendChild(newLi);
    todoInput.value = '';
    saveItemsFn();
}

const keyCodeCheck = function () {
    if (window.event.keyCode === 13 && todoInput.value.trim() !== '') {
        createTodo();
    }
}

const deleteAll = function () {
    const liList = document.querySelectorAll('li');
    for (let i = 0; i < liList.length; i++) {
        liList[i].remove()
    }
    saveItemsFn();
}

const saveItemsFn = function () {
    const saveItems = [];
    for (let i = 0; i < todoList.children.length; i++) {
        const todoObj = {
            contents: todoList.children[i].querySelector('span').textContent,
            complete: todoList.children[i].classList.contains('complete')
        };

        saveItems.push(todoObj);
    }

    saveItems.length === 0 ? localStorage.removeItem('saved-items') : localStorage.setItem('saved-items', JSON.stringify(saveItems));

};

if (savedTodoList) {
    for (let i = 0; i < savedTodoList.length; i++) {
        createTodo(savedTodoList[i])
    }
}

const weatherDataActive = function ({ location, weather }) {
    const weatherMainList = [
        'Clear',
        'Clouds',
        'Drizzle',
        'Rain',
        'Snow',
        'Thunderstorm'
    ];
    weather = weatherMainList.includes(weather) ? weather : 'Fog';
    const locationNameTag = document.querySelector('#location-name-tag')
    locationNameTag.textContent = location;
    console.log(weather)
    document.body.style.backgroundImage = `url('./images/${weather}.jpg')`


};




const weatherSearch = function ({ latitude, longitude }) {
    const openWeatherRes = fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=33d9d8b3fcd26e46f20dad0561ec7a81`
    ).then((res) => {
        return res.json();
    }).then((json) => {
        const weatherData = {
            location: json.name,
            weather: json.weather[0].main
        };
        weatherDataActive(weatherData);
    }).catch((err) => {
        console.log(err)
    })
};


const accessToGeo = function ({ coords }) {
    const { latitude, longitude } = coords;
    // shorthand property
    const positionObj = {
        latitude,
        longitude
    }
    weatherSearch(positionObj);
}

const askForLocation = function () {
    navigator.geolocation.getCurrentPosition(accessToGeo, (err) => {
        console.log(err);
    });
}
askForLocation();
if (savedWeatherData) {
    weatherDataActive(savedWeatherData);
}

// const promiseTest = function () {
//     return new Promise((resolver, reject) => {
//         setTimeout(() => {
//             resolver(100);
//             // reject('error');
//         }, 2000);
//     });
// };

// promiseTest().then((res) => {
//     console.log(res);
// })