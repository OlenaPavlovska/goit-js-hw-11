import ApiService from './apiService.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.photo-card a ', {
  captions: true,
  captionDelay: 400,
  captionsData: 'alt',
});
const apiService = new ApiService();
const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', fetchPictures);
hideButton();
function onSubmit(e) {
  e.preventDefault();
  const searchQuery = refs.form.elements.searchQuery.value.trim();
  apiService.setSearchQuery(searchQuery);
  clearMarkup();
  apiService.resetPage();
  if (apiService.searchQuery === '') {
    Notiflix.Notify.warning('Please, fill in the search field');
    return;
  }
  fetchPictures().finally(() => {
    refs.form.reset();
    if (apiService.totalHits != undefined) {
      Notiflix.Notify.success(
        `Hooray! We found ${apiService.totalHits} images.`
      );
    }
  });
}
async function createPicturesMarkup() {
  try {
    hideButton();
    const { hits, totalHits } = await apiService.getPictures();
    if (totalHits === 0) {
      Notiflix.Notify.info(
        `"Sorry, there are no images matching your search query. Please try again."`
      );
      // hideButton();
    }
    apiService.totalHits = totalHits;
    return hits.reduce((markup, hit) => markup + createPictureCard(hit), '');
  } catch (err) {
    console.log(err);
  }
}
function createPictureCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a href="${largeImageURL}">
  <img class="photo-img" src=${webformatURL} alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
</p>
    <p class="info-item">
      <b>Comments</b>
       <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
       <span>${downloads}</span>
    </p>
  </div>
</div>`;
}
async function fetchPictures() {
  try {
    const markup = await createPicturesMarkup();
    if (markup === undefined) throw new Error('');
    showMarkup(markup);
    const maxPage = Math.ceil(apiService.totalHits / apiService.per_page);
    if (apiService.page === maxPage) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      hideButton();
    }
    if (apiService.totalHits < apiService.per_page) {
      return hideButton();
    }
    showButton();
  } catch (err) {
    onError(err);
  }
}
function showMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}
function clearMarkup() {
  refs.gallery.innerHTML = '';
}
function onError(err) {
  Notiflix.Notify.failure(err.message);
  clearMarkup();
  showMarkup(`<p>${err.message}</p>`);
}
function showButton() {
  refs.loadMoreBtn.classList.remove('hidden');
}
function hideButton() {
  refs.loadMoreBtn.classList.add('hidden');
}
