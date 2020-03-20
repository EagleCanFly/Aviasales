
const
    formSearch = document.querySelector('.form-search'),
    fromCity = document.querySelector('.input__cities-from'),
    toCity = document.querySelector('.input__cities-to'),
    departDate = document.querySelector('.input__date-depart'),
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

const renderCheapDay = (cheapTicket) => {
    console.log(cheapTicket);
};

const renderCheapYear = (cheapTickets) => {
    console.log(cheapTickets);
};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;


    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return date === item.depart_date;
    });

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear)
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

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const fromCityObj = cities.find((item) => {
        return fromCity.value === item.name;
    });
    const toCityObj = cities.find((item) => {
        return toCity.value === item.name;
    });

    const formData = {
        from: fromCityObj.code,
        to: toCityObj.code,
        when: departDate.value,
    };

    const requestData = '?depart_date=' + formData.when +
        '&origin=' + formData.from +
        '&destination=' + formData.to +
        '&one_way=true';

    getData(calendar + requestData, (response) => {
        renderCheap(response, formData.when);
    });
});

// вызовы функций

getData(citiesApi, (data) => {
    cities = JSON.parse(data).filter((item) => {
        return item.name;
    });
});
