
const
    formSearch = document.querySelector('.form-search'),
    fromCity = document.querySelector('.input__cities-from'),
    toCity = document.querySelector('.input__cities-to'),
    departDate = document.querySelector('.date-depart'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');

// данные

let cities = [];
const citiesApi = 'data/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const apiToken = 'dee0597eea4716ca6387449d6e7d5e7d';
const calendar = 'http://min-prices.aviasales.ru/calendar_preload';

// функции

const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
};

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCity = cities.filter((item) => {
            const itemLow = item.name.toLowerCase();
            return itemLow.includes(input.value.toLowerCase());
        });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li)
        });
    }
};

const selectCity = (event, input, list) => {
    const target = event.target;
    input.value = target.textContent;
    list.textContent = '';
};

// события

fromCity.addEventListener('input', () => {
    showCity(fromCity, dropdownCitiesFrom);
});

toCity.addEventListener('input', () => {
    showCity(toCity, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', () => {
    selectCity(event, fromCity, dropdownCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', () => {
    selectCity(event, toCity, dropdownCitiesTo);
});

// вызовы функций

getData(citiesApi, (data) => {
    cities = JSON.parse(data).filter((item) => {
        return item.name;
    });
});

// getData(proxy + calendar + , (data) => {
//     const price = JSON.parse(data).filter((item) => {

//         if (item.depart_date === '2020-05-25') return item.value;
//     })
//     console.log(price);

// });
