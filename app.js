const form = document.querySelector('#searchForm')
const container = document.querySelector('#container');

const onRequset = async (e) => {
   e.preventDefault();
   const inputVal = form.elements.q.value;
   console.log(inputVal);

   getMovieData(inputVal);
}

const getMovieData = async (inputVal) => {

   switch (inputVal) {
      case '':
         alert('NO TITLE INCLUDED...')
         break;
      default:
         manageOldCards('delete', '.preView', '.card');
         try {
            const req = await axios.get(`http://api.tvmaze.com/search/shows?q=${inputVal}`);
            console.log(req.data);
            makeNewPreViews(req.data);


         } catch (err) {
            alert('UNABLE TO FIND ANY TITLES...', err)
            manageOldCards('delete', '.preView');
         }
   }
   form.elements.q.value = "";

}

const manageOldCards = (action, ...arguments) => {
   for (let arg of arguments) {
      const items = document.querySelectorAll(arg);
      if (action === 'hide' || action === 'show') {
         for (let item of items) item.classList.toggle('hide')
      } else {
         for (let item of items) item.remove();
      }

   }
}


const makeNewPreViews = (data) => {
   switch (data.length) {
      case 0:
         alert("NO SHOWS' DATA");
         break;
      default:
         for (let n of data) appendPreView(n);
   }

}

const appendPreView = (data) => {
   if (data.show.image && data.show.name) {
      const newPreView = document.createElement('div');
      const preViewImg = document.createElement('div');
      const title = document.createElement('h3');

      preViewImg.classList.add('preViewImg')
      preViewImg.style.backgroundImage = `url('${data.show.image.medium}')`

      title.append(data.show.name);
      title.classList.add('preViewTitle')

      newPreView.append(preViewImg, title);
      newPreView.classList.add('preView');
      container.append(newPreView);

      listenAndCreateCard(newPreView, data);

      setTimeout(function () {
         newPreView.classList.add('transition');
      }, 0.01)


   }
}

const listenAndCreateCard = (el, data) => {
   el.addEventListener('click', () => {
      manageOldCards('hide', '.preView');

      const card = document.createElement('div');
      const cardContent = document.createElement('div');
      const info = document.createElement('div');
      const img = document.createElement('div');
      const title = document.createElement('h3');
      const description = document.createElement('div');
      const score = document.createElement('h4');

      const returnBtn = document.createElement('button');


      img.style.backgroundImage = `url(${data.show.image.original})`;
      img.classList.add('cardImg');

      title.append(data.show.name);
      title.classList.add('cardTitle');

      description.innerHTML = data.show.summary;
      description.classList.add('cardDescription');

      score.append('Global Scoring: ', Math.floor(data.score) * 5);
      score.classList.add('cardScore');

      info.append(title, score, description);
      info.classList.add('cardInfo');

      returnBtn.append('Go back');
      returnBtn.setAttribute('id', 'returnBtn')

      cardContent.append(img, info);
      cardContent.classList.add('cardContent');

      card.append(returnBtn, cardContent);
      card.classList.add('card', 'c');
      container.append(card)

      setTimeout(function () {
         card.classList.add('transition');
      }, 0.01)

      settingUpReturnBtn(img);
   })
}

const settingUpReturnBtn = (el) => {
   returnBtn.addEventListener('click', function () {
      manageOldCards('show', '.preView');
      manageOldCards('delete', '.card');
   })
   // returnBtn.addEventListener('mouseenter', function () {
   //    window.innerWidth >= 1475 ? el.style.backgroundColor = 'rgb(197, 125, 58)' : el.style.backgroundColor = 'none';
   // })
   // returnBtn.addEventListener('mouseleave', function () {
   //    window.innerWidth >= 1475 ? el.style.backgroundColor = 'rgb(250, 154, 65)' : el.style.backgroundColor = 'none';
   // })
}

form.addEventListener('submit', onRequset);