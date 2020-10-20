var renderBlocks = null
var components = {}

window.storyblok.init({
  accessToken: 'NujaNjA0OvQY89GyaHeZyQtt'
})

// Get the JSON of "home" from Storyblok
var loadStory = function() {
  // The url path of the browser can define which story/content entry you get form the api
  // In the root path of your website you receive the content entry with the slug "home"
  var path = window.location.pathname == '/' ? 'home' : window.location.pathname
  window.storyblok.get({slug: path, version: 'draft'}, function(data) {
    window.storyblok.resolveRelations(data.story, ['Recipe.Layout','Overview.layout','Overview.recipes'], () => {
      console.log(data);
      console.log(path);
      renderBlocks(data,path)
    })
    
  })
}
loadStory()

// Listen to changes of the content
window.storyblok.on('change', function() {loadStory() 
})
window.storyblok.on('published', function() { loadStory() })

// Simple rendering engine
renderBlocks = function(data,path) {
  var blok = data.story.content
  console.log(blok);
  var contentDiv = document.querySelector('.content')
  contentDiv.innerHTML = ''
  if (path == "/layout/globals"){
    contentDiv.insertAdjacentHTML('beforeend', components["Header"](blok.header,blok.color));
    contentDiv.insertAdjacentHTML('beforeend', components["Placeholder"](blok));
  }
  else if (path == "home" || path == "/home"){
    contentDiv.insertAdjacentHTML('beforeend', components["Header"](blok.layout.content.header,blok.layout.content.color));
    contentDiv.insertAdjacentHTML('beforeend', components["Overview"](blok, blok.layout.content.color));
  }
  else{
      contentDiv.insertAdjacentHTML('beforeend', components["Header"](blok.Layout.content.header,blok.Layout.content.color));
      contentDiv.insertAdjacentHTML('beforeend', components["Recipe_Detail"](blok, blok.Layout.content.color));
  }
 

  // Enter editmode after rendering
  window.storyblok.tryEditmode()
}

components = {
  Header (header,color) {
    return `${header._editable}
    <header>
    <div class = "header__container">
    <div style = "border-color:${color[0].color.color}" class = "header__wrapper">
    <div class = "header__space">
    <h1 class = "header__title"> <a style = "color:${color[0].color.color}" href = "/home" class = "header__link"> ${header[1].Name} </a> </h1>
    <div class = "social__wrapper">
    ${header[0].socials.map((item) => item.used ? `<img class = "social__icon" src="/public/assets/${item.component == "Facebook" ? "fb": item.component == "Twitter" ? "tw":"ig"}.png" alt="fb">` : ``)}
    </div>
    </div>
    </div>
    </div>
    </header>`
  },
  Recipe_Detail(blok,color) {
    return `${blok._editable}
<article class = "detail">
<h2 class = "recipes__title"> Recipes </h2>
<div class = "detail__container">
<div style = "background-color:${color[0].color.color}" class = "recipe__detail">
<div class = "detail__wrapper"> 
<img class="detail__image" src="${blok.Picture.filename}" alt="">
<div class = "time__wrapper">
    <img src="/public/assets/line.png" alt="">
    <div class = "clock__wrapper">
    <img src="/public/assets/clock.png" alt="">
    <p style = "color:${color[1].color.color}"> ${blok.Duration} min </p>
    </div>
    <img src="/public/assets/line.png" alt="">
    </div>
<h3 class = "recipe__title" style = "color:${color[1].color.color}"> ${blok.Name}</h3>
</div>
<div class = "ingredient__wrapper"> 
<h3 class = "ingredient__title" style = "color:${color[1].color.color}">Ingredients</h3>
<ul class = "ingredients">
${blok.Ingredients.tbody.map((item) => `<li class = "ingredient" style = "color:${color[1].color.color}"> ${item.body[0].value} </li>`)}
</ul>
<a class = "recipe__button" style = "color:${color[1].color.color}; border-color:${color[1].color.color} " href="${blok.VideoLink}"> Watch Video </a>
</div>
</div>
</div>
</article>`
  },
  Overview(blok,color){
return `${blok._editable}
<article class = "recipes">
<h2 class = "recipes__title"> Recipes </h2>
<div class = "recipes__container">
${blok.recipes.map((recipe) => `
<div class = "recipe" style = "background-color:${color[0].color.color}">
<img src="${recipe.content.Picture.filename}" alt="">
<div class = "info__container">
<div class = "info__wrapper">
<h3 class = "recipe__title" style = "color:${color[1].color.color}"> ${recipe.content.Name} </h3>
<div class = "time__wrapper">
<img src="public/assets/line.png" alt="">
<div class = "clock__wrapper">
<img src="public/assets/clock.png" alt="">
<p class = "time" style = "color:${color[1].color.color}"> ${recipe.content.Duration} min </p>
</div>
<img src="public/assets/line.png" alt="">
</div>
<a class="recipe__button" style = "color:${color[1].color.color}; border-color:${color[1].color.color}" href="/recipes/${recipe.slug}"> Recipe </a>
</div>
</div>
</div>
`)}
</div>
</article>`
},
Placeholder(blok){
return `${blok._editable} <article class = "recipes">
<h2 class = "recipes__title"> Recipes </h2>
<div class = "recipes__container">
<div class = "recipe" style = "background-color:${blok.color[0].color.color}">
<img src="/public/assets/Spaghetti.png" alt="">
<div class = "info__container">
<div class = "info__wrapper">
<h3 class = "recipe__title" style = "color:${blok.color[1].color.color}"> Placeholder </h3>
<div class = "time__wrapper">
<img src="/public/assets/line.png" alt="">
<div class = "clock__wrapper">
<img src="/public/assets/clock.png" alt="">
<p style = "color:${blok.color[1].color.color}" class = "time"> ... min </p>
</div>
<img src="/public/assets/line.png" alt="">
</div>
<a style = "color:${blok.color[1].color.color}; border-color:${blok.color[1].color.color}" class="recipe__button" href=""> Recipe </a>
</div>
</div>
</div>
</div>
</article>`
}
}
