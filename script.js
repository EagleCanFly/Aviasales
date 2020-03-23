
const
    formSearch = document.querySelector('.form-search'),
    fromCity = document.querySelector('.input__cities-from'),
    toCity = document.querySelector('.input__cities-to'),
    departDate = document.querySelector('.input__date-depart'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');

// данные

let cities = [];
const citiesApi = 'data/cities.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const apiToken = 'dee0597eea4716ca6387449d6e7d5e7d';
const calendar = 'http://min-prices.aviasales.ru/calendar_preload',
MAX_COUNT = 10;

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
            return itemLow.startsWith(input.value.toLowerCase());
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

const getNameCity = (code) => {
    const objCity = cities.find((item) => item.code === code);
    return objCity.name;
};

const getChanges = (num) => {
    if (num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else {
        return 'Без пересадок'
    }
};

const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/';

    link += data.origin;

    const date = new Date(data.depart_date);

    const day = date.getDate();

    link += day < 10 ? '0' + day : day;

    const month = date.getMonth() + 1;

    link += month < 10 ? '0' + month : month;

     link += data.destination; 

     link += '1';
    
    //https://www.aviasales.ru/search/SVX2905KGD1
    return link;
}

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if (data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
<div class="ticket__wrapper">
	<div class="left-side">
		<a href="${getLinkAviasales(data)}" target ="_blank" class="button button__buy">Купить
			за ${data.value}₽</a>
	</div>
	<div class="right-side">
		<div class="block-left">
			<div class="city__from">Вылет из города
				<span class="city__name">${data.origin}</span>
			</div>
			<div class="date">${getDate(data.depart_date)}</div>
		</div>

		<div class="block-right">
			<div class="changes">${getChanges(data.number_of_changes)}</div>
			<div class="city__to">Город назначения:
				<span class="city__name">${getNameCity(data.destination)}</span>
			</div>
		</div>
	</div>
</div>
        `;
    } else {
        deep = '<h3> На текущую дату билетов нет </h3>';
    };

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};
const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';

   // innerHTML очищает всё и записывает новые данные
   cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
   


    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
    console.log(ticket);
};

const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';

    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

    const sortCheapTickets = cheapTickets.sort((a, b) => { // от самой маленькой даты до большой
        if (a.value > b.value) return 1;
        if (a.value < b.value) return -1;
    });

    for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }

    console.log(sortCheapTickets);
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
        from: fromCityObj,
        to: toCityObj,
        when: departDate.value,
    };
    if (formData.from && formData.to) {
        const requestData = '?depart_date=' + formData.when +
            '&origin=' + formData.from.code +
            '&destination=' + formData.to.code +
            '&one_way=true';

        getData(calendar + requestData, (response) => {
            renderCheap(response, formData.when);
        });
    } else {
        alert('Введите верное имя города');
    }
});

// вызовы функций

getData(citiesApi, (data) => {
    cities = JSON.parse(data).filter((item) => {
        return item.name;
    });

    // сортировка по алфавиту
    cities.sort(function (a, b) {
        if (a.value > b.value) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        return 0;
    });
});
