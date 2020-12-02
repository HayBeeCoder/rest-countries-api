const main = document.querySelector(".main");

/*function render_country(country) {
	while ((country_complete = document.querySelector(".country-complete"))) {
		document.removeChild(country_complete);
	}
	let clone = country_template.content.firstElementChild.cloneNode(true);
	clone.querySelector(".country-complete__img-wrapper img").src = country.flag;
	clone.querySelector(".country-complete__value--nativeName").textContent =
		country.nativeName;
	clone.querySelector(".country-complete__value--population").textContent =
		country.population;
	clone.querySelector(".country-complete__value--region").textContent =
		country.region;
	clone.querySelector(".country-complete__value--subRegion").textContent =
		country.subRegion;
	clone.querySelector(".country-complete__value--capital").textContent =
		country.capital;
	// clone.querySelector('.country-complete__value--currencies').textContent =
	clone.querySelector(".country-complete__value--topLevelDomain").textContent =
		country.topLevelDomain;
	clone.querySelector(
		".country-complete__value--language"
	).textContent = country.language.join();
	main.appendChild(clone);
}*/
// let light = true;

const baseUrl = "https://restcountries.eu/rest/v2/";
let baseURl_params =
	"flag;name;population;region;subRegion;capital;topLevelDomain;nativeName;currencies;languages;orderCountries";
const not_found = document.querySelector(".countries--not-found");
const countries_container = document.querySelector(".countries__container");
//toggle references
const toggle_text = document.querySelector(".toggle__text");
const toggler = document.querySelector(".toggle");
const toggle_moon = document.querySelector(".toggle__icon-moon");
const toggle_sunny = document.querySelector(".toggle__icon-sunny");
// filter references
const filter_icon = document.querySelector(".filter-box__icon");
const filter_list = document.querySelector(".filter-box__list");
const filter_items = document.querySelectorAll(".filter-box__key");
const filter_item = document.querySelector(".filter-box__key");
console.log(filter_item);

let filter_list__shown = false;
// search refereces
const search_input = document.querySelector(".search-box__input input");

window.onload = function () {
	if (filter_item.checked) {
		filter_item.parentElement.classList.add("filter-box__list-item--bg-gray");
	}

	request_countries(baseUrl + "all?fields=" + baseURl_params);
	// toggler.addEventListener("click", toggle);
	search_input.addEventListener("change", search);
	filter_icon.addEventListener("click", toggle_filterList);
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
}*/

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
						<p class='country__key'>population</p>
						<p class='country__value'>${format_population(String(population))}</p>
					</li>
					<li class='country__info'>
						<p class='country__key'>region</p>
						<p class='country__value'>${region}</p>
					</li>
					<li class='country__info'>
						<p class='country__key'>capital</p>
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
	<div class="container country-complete__container">
		<button class="btn btn--icon">
			<div class="yellow"></div>
			<span class="btn__icon">
				<ion-icon name="arrow-back-outline"></ion-icon>
			</span>
			<p class="btn__text">
				Back
			</p>
		</button>
		<div class="country-complete__details">
			<div class="country-complete__img-wrapper">
				<img src="	${flag}" alt="${name} flag">
			</div>
			<div class="country-complete__text-wrapper">
				<h1 class="country-complete__name">
					${name}
				</h1>
				<div class="country-complete__lists">
					<ul class="country-complete__list">

						<li class="country-complete__info country-complete__info--nativeName">
							<p class="coul.ntry-complete__key">Native Name:</p>
							<p class="country-complete__value country-complete__value--nativeName">${nativeName}
							</p>
						</li>

						<li class="country-complete__info country-complete__info--population">
							<p class="country-complete__key">Population:</p>
							<p class="country-complete__value  country-complete__value--population">
								${format_population(String(population))}</p>
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
