let countriesArray;
const countriesContainer = document.querySelector('.countries__container');
const completeCountry = document.querySelector('.country-complete');
const baseUrl = "https://restcountries.eu/rest/v2/";
let baseURl_params = ['flag','name','population','subregion','capital','region','topLevelDomain','nativeName','currencies','languages','borderCountries']

window.onload = ()=>{
	fetchCountries(baseUrl + "all?fields=" + baseURl_params.join(';'))

}

function fetchCountries(url){
	 fetch(url)
		.then(response => {
			console.log(response.status)
			if(response.status == 200) {
				return response.json();
			} else throw response;
		})
		.then(displayCountries)
		.catch(displayNotFound)
}


function displayNotFound(error){
	if(error.status == 404){
	countriesContainer.innerHTML = '';
	const p = document.createElement('p')
	p.textContent = '..........NOT FOUND.........'
	p.style.fontStyle = 'italic';
	p.style.textAlign = 'center'
	countriesContainer.append(p)	
	}
}
function displayCountries(countries){
	countriesArray = countries
	countriesContainer.innerHTML = '';
	countries.forEach((country,index) => {

		countriesContainer.appendChild(buildCountry(country,index))
	})
}


const getTemplate = (function(){
	let template ;
	return function countryTemplate(id){
		if(!template) template = document.getElementById(id);
		return template.content.firstElementChild.cloneNode(true);
	}
})();

function buildCountry(country,index){
	console.log(country)
	const {name ,flag , population , region , capital } = country;
	const countryTemplate = getTemplate('country');

	const countryImg = countryTemplate.querySelector('.country__flag');
	const countryName = countryTemplate.querySelector('.country__heading');
	const countryPopulation = countryTemplate.querySelector('.country__population');
	const countryRegion = countryTemplate.querySelector('.country__region');
	const countryCapital = countryTemplate.querySelector('.country__capital');
	
	countryTemplate.dataset.index = index;
	countryImg.setAttribute('src',flag);
	countryName.textContent = name;
	countryPopulation.textContent = population;
	countryRegion.textContent = region;
	countryCapital.textContent = capital;

	countryTemplate.addEventListener('click' , e => {
		completeCountry.innerHTML = '';
		console.log(countriesArray )
		console.log((countriesArray[e.currentTarget.dataset.index]))
		completeCountry.append(complete(countriesArray[e.currentTarget.dataset.index]));
		document.body.style.overflow = 'hidden';
		completeCountry.style.transform = `translateX(0)`;
		const backBtn = document.querySelector('.btn--back');
		backBtn.addEventListener('click' ,()=>{
		 completeCountry.style.transform = 'translateX(100%)';
		 document.body.style.overflow = 'initial';
		
		})
	})
	return countryTemplate;
}


// searchBox 
const searchInput = document.querySelector(".search__input");
searchInput.addEventListener("keypress" , e => {
	if(e.target.value && e.key == "Enter"){
		fetchCountries(baseUrl + "name/" + e.target.value + "?fullText=true")
	}
})


//Filters
let filtersShown = false;
const filterIcon = document.querySelector('.filter-box__icon');
const filterList = document.querySelector('.filter-box__list')
const filterItems = document.querySelectorAll('.filter-box__key')
filterIcon.addEventListener("click" , toggleFilterList)

function toggleFilterList() {
	if (!filtersShown) {
		filterList.classList.add("filter-box__list--show");
		filtersShown = true;
	
	} else {
		filterList.classList.remove("filter-box__list--show");
		filtersShown = false;
	}
}
filterItems.forEach(styleSelectedFilter)
	

function styleSelectedFilter(item) {
		item.addEventListener("change", e => {
			for (let item of filterItems) {
				item.parentElement.style.background = "";
				item.parentElement.classList.remove("filter-box__list-item--bg-gray");
			}
			if (item.checked) {
				item.parentElement.classList.add("filter-box__list-item--bg-gray");
			}
	
			if(e.currentTarget.value == "all") 	fetchCountries(baseUrl + "all?fields=" + baseURl_params.join(';'));
			else fetchCountries(baseUrl + 'region/' + e.currentTarget.value)
		});
}



function complete(country){
	const {languages,flag,name,population,region,capital,nativeName,subregion,currencies,borderCountries,topLevelDomain} = country;
	const completeTemplate  = document.querySelector('#country-detailed').content.firstElementChild.cloneNode(true);
	console.log(completeTemplate)
	const _img = completeTemplate.querySelector('.country-complete__img');
	console.log(_img)
	const _name = completeTemplate.querySelector('.country-complete__name');
	const _nativeName = completeTemplate.querySelector('.country-complete__value--nativeName');
	const _population = completeTemplate.querySelector('.country-complete__value--population');
	const _region = completeTemplate.querySelector('.country-complete__value--region');
	const _subRegion = completeTemplate.querySelector('.country-complete__value--subRegion');
	const _capital = completeTemplate.querySelector('.country-complete__value--capital');
	const _topLevelDomain = completeTemplate.querySelector('.country-complete__value--topLevelDomain');
	const _currencies = completeTemplate.querySelector('.country-complete__value--currencies');
	const _borderCountries = completeTemplate.querySelector('.country-complete__border-countries');
	const _languages = completeTemplate.querySelector('.country-complete__value--languages')
	_img.setAttribute('src',flag)
	_img.setAttribute('alt' , name + ' flag');
	_name.textContent = name;
	_nativeName.textContent = nativeName;
	_population.textContent = population;
	_region.textContent = region;
	_subRegion.textContent = subregion;
	_capital.textContent = capital;
	_topLevelDomain.textContent = topLevelDomain;
	_currencies.textContent = currencies.map(currency => currency.code).join();
	_borderCountries.textContent = borderCountries;
	_languages.textContent = languages.map(language => language.name).join();
		
	return completeTemplate
}



// Toggle switch 
let light = true;
const toggleIconWrapper = document.querySelector('.toggle__icon-wrapper');
const toggleText = document.querySelector('.toggle__text')
const toggle = document.querySelector('.toggle');
toggle.addEventListener('click' , ()=>{
	 if(light){
		 console.log('hello')
		 toggleIconWrapper.classList.add('toggle__icon-wrapper--translate')
		 toggleText.classList.add('toggle__text--translate');
		 document.body.classList.add('dark');
		 light = false;
	 }else{
		toggleIconWrapper.classList.remove('toggle__icon-wrapper--translate');
		toggleText.classList.remove('toggle__text--translate');
		document.body.classList.remove('dark');
		light = true;

	 }
})


/*
const not_found = document.querySelector(".countries--not-found");
const countries_container = document.querySelector(".countries__container");
//toggle references
const toggle_text = document.querySelector(".toggle__text");
const toggler = document.querySelector(".toggle");
const toggle_moon = document.querySelector(".toggle__icon-moon");
const toggle_sunny = document.querySelector(".toggle__icon-sunny");
// filter references
const filter_icon = document.querySelector(".filter-box__icon");
console.log(filter_icon)
const filter_list = document.querySelector(".filter-box__list");
const filter_items = document.querySelectorAll(".filter-box__key");
const filter_item = document.querySelector(".filter-box__key");
// console.log(filter_item);

/*
let filter_list__shown = false;
// search refereces
const search_input = document.querySelector(".search-box__input input");

window.onload = function () {
	if (filter_item.checked) {
		filter_item.parentElement.classList.add("filter-box__list-item--bg-gray");
	}

	request_countries(baseUrl + "all?fields=" + baseURl_params);
	// toggler.addEventListener("click", toggle);
	filter_icon.addEventListener("click", toggle_filterList);
	search_input.addEventListener("change", search);
	
	style_filterItem_selected();
};

//utility functions------------------------------------------------------------------------

function style_filterItem_selected() {
	filter_items.forEach((item) => {
		item.addEventListener("change", () => {
			for (let item of filter_items) {
				item.parentElement.style.background = "";
				item.parentElement.classList.remove("filter-box__list-item--bg-gray");
			}
			if (item.checked) {
				item.parentElement.classList.add("filter-box__list-item--bg-gray");
			}
		});
	});
}

function format_population(value) {
	let formatted_value;
	function format_digit(value) {
		if (value.length <= 3) {
			formatted_value = value + "," + formatted_value;
			return;
		}
		let arr = Array.from(value).reverse(),
			slice = arr.slice(0, 3).reverse().join("");
		formatted_value = formatted_value ? slice + "," + formatted_value : slice;
		return format_digit(value.slice(0, value.length - 3));
	}
	format_digit(value);
	return formatted_value;
}
function toggle() {
	if (light) {
		console.log("hello");
		toggle_text.textContent = "Light mode";
		toggle_moon.classList.remove("toggle__icon-active");
		toggle_sunny.classList.add("toggle__icon-active");
		light = false;
	} else {
		console.log("world");
		toggle_text.textContent = "Dark mode";
		toggle_moon.classList.add("toggle__icon-active");
		toggle_sunny.classList.remove("toggle__icon-active");
		light = true;
	}
}

function search() {
	if (search_input.value == "") {
		request_countries(baseUrl + "all?fields=" + baseURl_params);
	}
	let url = baseUrl + "name/" + search_input.value + "?fullText=true";
	request_countries(url);
}

function toggle_filterList() {
	console.log(filter_list__shown);
	if (!filter_list__shown) {
		filter_list.classList.add("filter-box__list--show");
		filter_list__shown = true;
	
	} else {
		filter_list.classList.remove("filter-box__list--show");
		filter_list__shown = false;
	}
}

function request_countries(url) {
	fetch(url)
		.then((response) => {
			if (response.status == 200) {
				return response.json();
			} else if (response.status == 404) {
				return null;
			} else {
				throw new Error(response);
			}
		})
		.then((json) => {
			if (json == null) {
				display_error();
			} else {
				display_countries(json, "main.main");
				// let countries_array = document.querySelectorAll(".country");
				// make_countries_clickable(countries_array);
			}
		})
		.catch((error) => {
			console.log(error);
		});
}
/*
function make_countries_clickable(countries) {
	console.log(countries);
	// console.log(countries)
	countries.forEach((country, index) => {
		console.log(country);
		country.addEventListener("click", (e) => {
			render_country(countries[index]);
		});
	});
}

function display_countries(countries, targetElement) {
	const old_element = document.querySelector(targetElement);
	console.log(old_element)
	const new_element = old_element.cloneNode(true);
 console.log(new_element);

	const countries_container = new_element.querySelector(".countries__container");
	console.log(countries_container);
	countries_container.innerHTML = countries.map(get_country).join("\n");
	console.log(new_element);
	old_element.replaceWith(new_element);
}

function get_country(country, index) {
	const { flag, name, population, region, capital } = country;
	return `
			<div class= 'country' data-index='${index}'>
				 <div class='country__image-wrapper'>
				 	<img class= 'country__flag' src= '${flag}'>
				 </div>
		
			<div class='country__details'>
				<h1 class='country__heading'>${name} </h1>
				<ul class='country__list'>
					<li class='country__info'>
						<p class='country__key'>population: </p>
						<p class='country__value'>${format_population(String(population))}</p>
					</li>
					<li class='country__info'>
						<p class='country__key'>region: </p>
						<p class='country__value'>${region}</p>
					</li>
					<li class='country__info'>
						<p class='country__key'>capital: </p>
						<p class='country__value'>${capital}</p>
					</li>
				</ul>
			</div>
			</div>
		`;
}

function get_complete_country(country) {
	const {
		flag,
		name,
		population,
		region,
		capital,
		nativeName,
		subRegion,
		currencies,
		borderCountries,
		topLevelDomain,
	} = country;

	return `
						</li>
						<li class="country-complete__info country-complete__info--region">
							<p class="country-complete__key">Region:</p>
							<p class="country-complete__value country-complete__value--region">${region}</p>
						</li>
						<li class="country-complete__info">
							<p class="country-complete__key country-complete__info--subRegion">Sub Region:
							</p>
							<p class="country-complete__value country-complete__value--subRegion"> ${subRegion}
							</p>
						</li>
						<li class="country-complete__info">
							<p class="country-complete__key country-complete__info--capital">Capital:</p>
							<p class="country-complete__value country-complete__value--capital">${capital}</p>
						</li>
					</ul>

					<ul class="country-complete__list">
						<li class="country-complete__info">
							<p class="country-complete__key">Top Level Domain:</p>
							<p class="country-complete__value country-complete__value--topLevelDomain ">${topLevelDomain}
							</p>
						</li>
						<li class="country-complete__info">
							<p class="country-complete__key">Currencies:</p>
							<p class="country-complete__value country-complete__value--currencies">${get_currencies(
								currency
							)}</p>
						</li>
						<li class="country-complete__info">
							<p class="country-complete__key">Languages:</p>
							<p class="country-complete__value country-complete__value--languages">${get_languages(
								language
							)}</p>
						</li>

					</ul>
				</div>
				<div class="country-complete__border">
					<p class="country-complete__key">Border Countries:</p>
					<div class="country-complete__border-countries">
						${get_border_countries()}
					</div>

				</div>
			</div>
		</div>

	</div>
`;
}

function get_border_country(country) {
	return `<button class="btn">${country}</button>`;
}
function get_border_countries(countries) {
	return countries.map(get_border_country).join("\n");
}

function get_languages(languages) {
	return languages.join(",");
}

function get_currencies(currencies) {
	return currencies.join(",");
}

// --------------------------------------------------------------------------------------------------
*/