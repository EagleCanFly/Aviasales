const
    formSearch = document.querySelector('.form-search'),
    fromCity = document.querySelector('.input__cities-from'),
    toCity = document.querySelector('.input__cities-to'),
    departDate = document.querySelector('.date-depart'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from');

cities = ["Москва", "Санкт-Петербург", "Воронеж", "Челябинск", "Волгоград"];

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCity = cities.filter((item) => {
            const itemLow = item.toLowerCase();
            return itemLow.includes(input.value.toLowerCase());
        });

        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
            list.append(li)
        });
    }
};

fromCity.addEventListener('input', () => {
    showCity(fromCity, dropdownCitiesFrom);
});

toCity.addEventListener('input', () => {
    showCity(toCity, dropdownCitiesTo);
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    const target = event.target;
    fromCity.value = target.textContent;
    dropdownCitiesFrom.textContent = '';
});

dropdownCitiesTo.addEventListener('click', (event) => {
    const target = event.target;
    toCity.value = target.textContent;
    dropdownCitiesTo.textContent = '';
});