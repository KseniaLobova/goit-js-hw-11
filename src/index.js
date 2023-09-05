
import axios from "axios";
import Notiflix from 'notiflix';


// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
const lightbox = new SimpleLightbox('.gallery a')


const formEl= document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const inputEl = document.querySelector('.input-form')
console.log(inputEl)
const loadMore = document.querySelector('.load-more')


// слухачі подій
formEl.addEventListener('submit', handlerSubmit)
loadMore.addEventListener('click', handlerMoreImg)


loadMore.classList.add('is-hidden')

let page = 1;


async function handlerSubmit(evt) {
    evt.preventDefault();
    // console.log(evt.target.searchQuery.value)
 console.log(inputEl.value)
  const inputValue = inputEl.value;
   page = 1;
  if (!inputValue || inputValue.trim() === "") {
     evt.target.reset();
    loadMore.classList.add("is-hidden")
     gallery.innerHTML = " "
  return  Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  }
   try{ const response = await serviceValue(page,inputValue);
  console.log(response)
    
     if (response.totalHits === 0) {
         evt.target.reset();
       gallery.innerHTML=''
       loadMore.classList.add("is-hidden")
   
       return   Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
     }
     gallery.innerHTML = creatMarkup(response)
     Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`)
     loadMore.classList.remove('is-hidden')
     lightbox.refresh()
     if (response.totalHits < 40) {
        Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`)
       loadMore.classList.add("is-hidden")
      
     }

   }
 
   catch (error) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    gallery.innerHTML = "";
}
    }
// функція запит на бекенд
async function serviceValue(currentPage="1",value) {
    const BASE_URL = "https://pixabay.com/api/";
    const searchParams = new URLSearchParams({
        q: value,
        key:'39209258-9417428640479392afc310d0d',
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page:currentPage,
        per_page: 40,
    })
        const response = await axios(`${BASE_URL}?${searchParams}`)
    return response.data;
}
function creatMarkup(response) {
 return response.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<a class="gallery-item" href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes} Likes</b>
    </p>
    <p class="info-item">
      <b>${views} Views</b>
    </p>
    <p class="info-item">
      <b>${comments} Comments</b>
    </p>
    <p class="info-item">
      <b>${downloads}     Downloads</b>
    </p>
  </div>
</div></a>`).join('')
}
async function handlerMoreImg() {
  page += 1;
  const inputValue = inputEl.value.trim();
  try {
    const response = await serviceValue(page, inputValue);
   
    // console.log(response.totalHits)
    const totalPage = Math.floor(response.totalHits / 40)
    console.log(totalPage)
    if (page > totalPage) {
      loadMore.classList.add("is-hidden")
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
    }
     gallery.insertAdjacentHTML("beforeend", creatMarkup(response));
    lightbox.refresh()
  } 
  catch (error) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    gallery.innerHTML = "";
  }
}

