let countriesArray;
let countriesArrayWithAlpaCode;
const countriesContainer = document.querySelector('.countries__container');
const completeCountry = document.querySelector('.country-complete');
const baseUrl = "https://restcountries.eu/rest/v3.1/";
const searchInput = document.querySelector(".search__input");
let baseURl_params = ['alpha3Code','flag','name','population','subregion','capital','region','topLevelDomain','nativeName','currencies','languages','borders']

window.onload = ()=>{
	fetchCountries(baseUrl + "all?fields=" + baseURl_params.join(';'));
	filterItems.forEach(styleSelectedFilter)
}

//====================================================================Countries
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
	countriesArray = countries;
	 countriesArrayWithAlpaCode = countriesArray.map(country => country['alpha3Code']);
	countriesContainer.innerHTML = '';
	countries.forEach((country,index) => {
		searchInput.value = '';
		countriesContainer.appendChild(buildCountry(country,index))
	})
}



function buildCountry(country,index){
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
	countryPopulation.textContent = formatPopulation(population.toString());
	countryRegion.textContent = region;
	countryCapital.textContent = capital;

	countryTemplate.addEventListener('click' ,displayCompleteCountry)
	return countryTemplate;
}


function getcompleteCountry(country){
	const {languages,flag,name,population,region,capital,nativeName,subregion,currencies,borders,topLevelDomain} = country;
	const completeTemplate  = document.querySelector('#country-detailed').content.firstElementChild.cloneNode(true);
	const _img = completeTemplate.querySelector('.country-complete__img');
	const _name = completeTemplate.querySelector('.country-complete__name');
	const _nativeName = completeTemplate.querySelector('.country-complete__value--nativeName');
	const _population = completeTemplate.querySelector('.country-complete__value--population');
	const _region = completeTemplate.querySelector('.country-complete__value--region');
	const _subRegion = completeTemplate.querySelector('.country-complete__value--subRegion');
	const _capital = completeTemplate.querySelector('.country-complete__value--capital');
	const _topLevelDomain = completeTemplate.querySelector('.country-complete__value--topLevelDomain');
	const _currencies = completeTemplate.querySelector('.country-complete__value--currencies');
	const _borderCountries = completeTemplate.querySelector('.country-complete__border-countries');
	const _languages = completeTemplate.querySelector('.country-complete__value--languages');

	handleBorderCountries(borders,_borderCountries);
	_img.setAttribute('src',flag)
	_img.setAttribute('alt' , name + ' flag');
	_name.textContent = name;
	_nativeName.textContent = nativeName;
	_population.textContent = formatPopulation(population.toString());
	_region.textContent = region;
	_subRegion.textContent = subregion;
	_capital.textContent = capital;
	_topLevelDomain.textContent = topLevelDomain;
	_currencies.textContent = currencies.map(currency => currency.code).join();
	_languages.textContent = languages.map(language => language.name).join();
		
	return completeTemplate
}

function handleBorderCountries(countries,parentElement){
	if(!countries.length){
		parentElement.textContent = 'NO BORDER COUNTRIES :('
	}else{
		countries.forEach(country => {
			parentElement.appendChild(makeBorderCountryButton(country))
		})
	}
}
function makeBorderCountryButton(abbrevCountry){
	let index = countriesArrayWithAlpaCode.indexOf(abbrevCountry);
	const button = document.createElement('button');
	button.classList.add('btn');
	button.dataset.index = index;
	button.textContent = countriesArray[index].name;
	button.addEventListener('click' , displayCompleteCountry);
	return button;
}

//make the template variable unavailable to the public.(IIFE;)
const getTemplate = (function(){
	let template ;
	return function countryTemplate(id){
		if(!template) template = document.getElementById(id);
		return template.content.firstElementChild.cloneNode(true);
	}
})();



//accesses global completeCountry variable
function displayCompleteCountry(e){
		completeCountry.innerHTML = '';
		completeCountry.append(getcompleteCountry(countriesArray[e.currentTarget.dataset.index]));
		document.body.style.overflow = 'hidden';
		completeCountry.style.transform = `translateX(0)`;
		const backBtn = document.querySelector('.btn--back');
		backBtn.addEventListener('click' ,()=>{
		 completeCountry.style.transform = 'translateX(100%)';
		 document.body.style.overflow = 'initial';
		
		})
}


// ======================================================================searchBox 
searchInput.addEventListener("keypress" , e => {
	if(e.target.value && e.key == "Enter"){
		fetchCountries(baseUrl + "name/" + e.target.value + "?fullText=true")
	}
})


//==========================================================================Filters
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


function formatPopulation(value){
	let slice , modifiedValue = '';
	while(value.length > 3){
		const { length } = value;
		 slice = value.slice(length-3);
		 modifiedValue = ','+ slice + modifiedValue;
		value = value.slice(0,length-3)
	}

	return value + modifiedValue;
}
