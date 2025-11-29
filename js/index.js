let toggleBtn = document.querySelector('#toggleBtn');
let sideNav = document.querySelector('#sideNav');

// Toggle Side Nav
toggleBtn.addEventListener('click', () => {
  if (toggleBtn.classList.contains('fa-align-justify')) {
    toggleBtn.classList.replace('fa-align-justify', 'fa-xmark');
    sideNav.classList.replace('d-none', 'd-flex');
  } else {
    toggleBtn.classList.replace('fa-xmark', 'fa-align-justify');
    sideNav.classList.replace('d-flex', 'd-none');
  }
});


const homePageMeals = [
  "Ezme", "Kabse", "Asado", "Migas", "Sushi", "Cacik", "Locro",
  "Burek", "Corba", "Hummus", "Kumpir", "Knafeh", "Tamiya",
  "Bistek", "Paella", "Fainá", "Wontons", "Big Mac", "Falafel",
  "Lasagne", "Timbits", "Dal fry", "Koshari", "Poutine"
];

let homeMealsGlobal = [];

async function fetchHomePageMeals() {
  let homeMeals = [];

  for (let name of homePageMeals) {
    document.querySelector('#spinner').classList.remove('d-none');

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let data = await response.json();

    if (!data.meals) continue;

    let mealData = data.meals[0];

    const ingredientsList = [];
    for (let i = 1; i <= 20; i++) {
      const ing = mealData[`strIngredient${i}`];
      const measure = mealData[`strMeasure${i}`];
      if (ing && ing.trim() !== "") {
        ingredientsList.push(`${measure} ${ing}`);
      }
    }

    homeMeals.push({
      id: mealData.idMeal,
      name: mealData.strMeal,
      area: mealData.strArea,
      category: mealData.strCategory,
      instructions: mealData.strInstructions,
      image: mealData.strMealThumb,
      video: mealData.strYoutube,
      recipe: ingredientsList
    });
  }

  return homeMeals;
}

async function runHomePageMeal() {
  let meals = await fetchHomePageMeals();
  homeMealsGlobal = meals;
  document.querySelector('#spinner').classList.add('d-none');
  contactSection.classList.add('d-none');
  renderMeals(meals);
}

runHomePageMeal();


function renderMeals(meals) {
  let html = "";

  meals.forEach((meal, index) => {
    html += `
      <div class="col-md-3 px-2">
        <div onclick="getMealDetails(${index})"
            class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100" src="${meal.image}">
            <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                <h3>${meal.name}</h3>
            </div>
        </div>
      </div>`;
  });

  document.querySelector('#rowData').innerHTML = html;
}


function getMealDetails(i) {
  const meal = homeMealsGlobal[i];
  let ingredientsHTML = "";
  searchContainer.classList.add('d-none');
  contactSection.classList.add('d-none');


  meal.recipe.forEach(r => {
    ingredientsHTML += `<li class="alert alert-info m-2 p-1">${r}</li>`;
  });

  let detailsHTML = `
    <div class="col-md-4 text-white">
      <img class="w-100 rounded-3" src="${meal.image}">
      <h2>${meal.name}</h2>
    </div>

    <div class="col-md-8 text-white">
      <h2>Instructions</h2>
      <p>${meal.instructions}</p>
      <h3><span class="fw-bolder">Area:</span> ${meal.area}</h3>
      <h3><span class="fw-bolder">Category:</span> ${meal.category}</h3>

      <h3>Recipes:</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${ingredientsHTML}
      </ul>

      <a target="_blank" href="${meal.video}" class="btn btn-danger mt-3">YouTube</a>
    </div>
  `;

  document.querySelector('#rowData').innerHTML = detailsHTML;
}

// search

async function searchByName(name) {
  if (name.trim().length === 0) {
    document.querySelector('#rowData').innerHTML = "";
    return;
  }

  document.querySelector('#spinner').classList.remove('d-none');
  contactSection.classList.add('d-none');


  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
  let data = await response.json();

  document.querySelector('#spinner').classList.add('d-none');

  if (!data.meals) {
    document.querySelector('#rowData').innerHTML =
      `<h3 class="text-white text-center mt-5">No meals found</h3>`;
    return;
  }

  let meals = data.meals.map(mealData => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (mealData[`strIngredient${i}`]) {
        ingredients.push(`${mealData[`strMeasure${i}`]} ${mealData[`strIngredient${i}`]}`);
      }
    }
    return {
      id: mealData.idMeal,
      name: mealData.strMeal,
      area: mealData.strArea,
      category: mealData.strCategory,
      instructions: mealData.strInstructions,
      image: mealData.strMealThumb,
      video: mealData.strYoutube,
      recipe: ingredients
    };
  });

  homeMealsGlobal = meals;
  renderMeals(meals);
}


async function searchByFLetter(letter) {
  if (!letter || letter.trim().length === 0) {
    document.querySelector('#rowData').innerHTML = "";
    return;
  }

  letter = letter[0];

  document.querySelector('#spinner').classList.remove('d-none');
  contactSection.classList.add('d-none');


  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
  let data = await response.json();

  document.querySelector('#spinner').classList.add('d-none');

  if (!data.meals) {
    document.querySelector('#rowData').innerHTML =
      `<h3 class="text-white text-center mt-5">No meals found</h3>`;
    return;
  }

  let meals = data.meals.map(mealData => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (mealData[`strIngredient${i}`] && mealData[`strIngredient${i}`].trim() !== "") {
        ingredients.push(`${mealData[`strMeasure${i}`]} ${mealData[`strIngredient${i}`]}`);
      }
    }
    return {
      id: mealData.idMeal,
      name: mealData.strMeal,
      area: mealData.strArea,
      category: mealData.strCategory,
      instructions: mealData.strInstructions,
      image: mealData.strMealThumb,
      video: mealData.strYoutube,
      recipe: ingredients
    };
  });

  homeMealsGlobal = meals;

  renderMeals(meals);
}



let searchItem = document.querySelector('#searchItem');
let searchContainer = document.querySelector('#searchContainer');
let categoryItem = document.querySelector('#categoryItem');
let categoriesGlobal = [];

searchItem.addEventListener('click', () => {
  document.querySelector('#rowData').innerHTML = "";
  searchContainer.classList.remove('d-none');
  contactSection.classList.add('d-none');
});

function truncateWords(str, numWords) {
  const words = str.split(" ");
  if (words.length <= numWords) return str;
  return words.slice(0, numWords).join(" ");
}

async function listMealsCategory() {
  document.querySelector('#spinner').classList.remove('d-none');

  const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  const data = await response.json();

  console.log(data.categories)
  const categories = data.categories.map(cat => ({
    name: cat.strCategory,
    imgUrl: cat.strCategoryThumb,
    description: truncateWords(cat.strCategoryDescription, 20)
  }));

  categoriesGlobal = categories;
  renderCategories(categories);
}

function renderCategories(categories) {
  let html = "";
  searchContainer.classList.add('d-none');
  contactSection.classList.add('d-none');


  categories.forEach((cat, index) => {
    html += `
      <div class="col-md-3 px-2">
        <div onclick="showCategoryDetails(${index})"
            class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            
            <img class="w-100" src="${cat.imgUrl}">
            
            <div class=" text-center meal-layer position-absolute d-flex flex-column align-items-start text-black p-2">
                <h3 class="w-100">${cat.name}</h3>
                <p class="text-center">
                    ${cat.description}
                </p>
            </div>

        </div>
      </div>
    `;
  });

  document.querySelector('#spinner').classList.add('d-none');
  document.getElementById("rowData").innerHTML = html;
}


categoryItem.addEventListener('click', () => {
  listMealsCategory();
})

async function showCategoryDetails(index) {
  const category = categoriesGlobal[index];

  document.querySelector('#spinner').classList.remove('d-none');
  searchContainer.classList.add('d-none');
  contactSection.classList.add('d-none');


  // Fetch meals by category
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category.name}`);
  const data = await response.json();

  if (!data.meals) {
    document.querySelector('#spinner').classList.add('d-none');
    document.getElementById('rowData').innerHTML =
      `<h3 class="text-white text-center mt-5">No meals found in this category</h3>`;
    return;
  }

  const categoryMeals = await Promise.all(
    data.meals.map(async mealItem => {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.idMeal}`);
      const mealData = await res.json();
      const meal = mealData.meals[0];

      const ingredientsList = [];
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim() !== "") {
          ingredientsList.push(`${measure} ${ing}`);
        }
      }

      return {
        id: meal.idMeal,
        name: meal.strMeal,
        area: meal.strArea,
        category: meal.strCategory,
        instructions: meal.strInstructions,
        image: meal.strMealThumb,
        video: meal.strYoutube,
        recipe: ingredientsList
      };
    })
  );

  document.querySelector('#spinner').classList.add('d-none');
  homeMealsGlobal = categoryMeals;
  renderMeals(categoryMeals);
}

let areaItem = document.querySelector('#areaItem');
areaItem.addEventListener('click', () => {
  searchContainer.classList.add('d-none');
  contactSection.classList.add('d-none');
  listCountriesName();

})

let regionsGlobal = [];

async function listCountriesName() {
  document.querySelector('#spinner').classList.remove('d-none');

  const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
  const data = await response.json();

  regionsGlobal = data.meals.map(item => item.strArea);

  const container = document.getElementById("rowData");
  container.innerHTML = regionsGlobal.map(area => `
    <div class="col-md-3 mb-3">
      <div class="rounded-2 text-center cursor-pointer p-3  text-white" onclick="showRegionMeals('${area}')">
        <i class="fa-solid fa-house-laptop fa-4x"></i>
        <h3>${area}</h3>
      </div>
    </div>
  `).join("");

  document.querySelector('#spinner').classList.add('d-none');
}

async function showRegionMeals(areaName) {
  document.querySelector('#spinner').classList.remove('d-none');


  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`);
  const data = await response.json();

  if (!data.meals) {
    document.querySelector('#spinner').classList.add('d-none');
    document.getElementById('rowData').innerHTML = `<h3 class="text-white text-center mt-5">No meals found in ${areaName}</h3>`;
    return;
  }

  const meals = await Promise.all(
    data.meals.map(async mealItem => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.idMeal}`);
        const mealData = await res.json();
        const meal = mealData.meals[0];

        const ingredientsList = [];
        for (let i = 1; i <= 20; i++) {
          const ing = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
          if (ing && ing.trim() !== "") ingredientsList.push(`${measure} ${ing}`);
        }

        return {
          id: meal.idMeal,
          name: meal.strMeal,
          area: meal.strArea,
          category: meal.strCategory,
          instructions: meal.strInstructions,
          image: meal.strMealThumb,
          video: meal.strYoutube,
          recipe: ingredientsList
        };
      } catch (err) {
        console.error("Meal fetch failed for", mealItem.idMeal, err);
        return null;
      }
    })
  );

  homeMealsGlobal = meals.filter(m => m !== null);

  document.querySelector('#spinner').classList.add('d-none');
  contactSection.classList.add('d-none');
  renderMeals(homeMealsGlobal);
}


async function listFirst20Ingredients() {
  document.querySelector('#spinner').classList.remove('d-none');

  const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
  const data = await response.json();

  const ingredients = data.meals.slice(0, 20);

  const container = document.getElementById("rowData");
  container.innerHTML = ingredients.map(ing => `
    <div class="col-md-3 mb-3">
      <div class="rounded-2 text-center cursor-pointer p-3 text-white"
           onclick="getIngredientsMeals('${ing.strIngredient}')">
        <img src="https://www.themealdb.com/images/ingredients/${ing.strIngredient}.png" class="img-fluid mb-2" alt="${ing.strIngredient}">
        <h5>${ing.strIngredient}</h5>
        <p>${ing.strDescription ? ing.strDescription.slice(0, 100) : "No description"}</p>
      </div>
    </div>
  `).join("");

  document.querySelector('#spinner').classList.add('d-none');
  contactSection.classList.add('d-none');

}

async function getIngredientsMeals(ingredientName) {
  document.querySelector('#spinner').classList.remove('d-none');

  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
  const data = await response.json();

  if (!data.meals) {
    document.querySelector('#spinner').classList.add('d-none');
    document.getElementById('rowData').innerHTML =
      `<h3 class="text-white text-center mt-5">No meals found with ${ingredientName}</h3>`;
    return;
  }

  const meals = await Promise.all(
    data.meals.map(async mealItem => {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.idMeal}`);
      const meal = (await res.json()).meals[0];

      const ingredientsList = [];
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim() !== "") ingredientsList.push(`${measure} ${ing}`);
      }

      return {
        id: meal.idMeal,
        name: meal.strMeal,
        area: meal.strArea,
        category: meal.strCategory,
        instructions: meal.strInstructions,
        image: meal.strMealThumb,
        video: meal.strYoutube,
        recipe: ingredientsList
      };
    })
  );

  homeMealsGlobal = meals;
  document.querySelector('#spinner').classList.add('d-none');

  renderMeals(meals);
}

let ingredientItem = document.querySelector('#ingredientItem'); // make sure your sidebar li has this id
ingredientItem.addEventListener('click', () => {
  listFirst20Ingredients();
  contactSection.classList.add('d-none');
});



let contactItem = document.querySelector('#contactItem');
let contactSection = document.querySelector('#contactSection');

contactItem.addEventListener('click', () => {
  document.querySelector('#rowData').innerHTML = "";
  searchContainer.classList.add('d-none');

  contactSection.classList.remove('d-none');
});


let nameInput = document.getElementById("nameInput");
let emailInput = document.getElementById("emailInput");
let phoneInput = document.getElementById("phoneInput");
let ageInput = document.getElementById("ageInput");
let passwordInput = document.getElementById("passwordInput");
let repasswordInput = document.getElementById("repasswordInput");
let submitBtn = document.getElementById("submitBtn");

const regex = {
  name: /^[A-Za-z ]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{10,14}$/,
  age: /^[1-9][0-9]?$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
};

function inputsValidation() {
  searchContainer.classList.add('d-none');

  let validName = regex.name.test(nameInput.value.trim());
  toggleAlert("nameAlert", validName);

  let validEmail = regex.email.test(emailInput.value.trim());
  toggleAlert("emailAlert", validEmail);

  let validPhone = regex.phone.test(phoneInput.value.trim());
  toggleAlert("phoneAlert", validPhone);

  let validAge = regex.age.test(ageInput.value.trim());
  toggleAlert("ageAlert", validAge);

  let validPassword = regex.password.test(passwordInput.value.trim());
  toggleAlert("passwordAlert", validPassword);

  let validRepassword = passwordInput.value === repasswordInput.value && passwordInput.value !== "";
  toggleAlert("repasswordAlert", validRepassword);

  submitBtn.disabled = !(validName && validEmail && validPhone && validAge && validPassword && validRepassword);
}

function toggleAlert(id, ok) {
  document.getElementById(id).classList.toggle("d-none", ok);
}
