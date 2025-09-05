
const createElements= (arr)=>{
 const htmlElements =  arr.map((el) =>`<span class="btn">${el}</span>
           `)
           return htmlElements.join("");
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner =(status)=>{
    if(status==true){
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    } else{
        document.getElementById('word-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add('hidden');
    }
}

const loadLesson=() =>{
    fetch('https://openapi.programming-hero.com/api/levels/all')
   .then(res=> res.json() )
    .then((json) =>displayLessson(json.data))

};

const removeActive=() =>{
    const lessonButtons = document.querySelectorAll(".lesson-btn")
   lessonButtons.forEach((btn) =>btn.classList.remove("active"))
};



const loadLevelWord =(id) =>{
   manageSpinner(true);

    const url =`https://openapi.programming-hero.com/api/level/${id}`;

    fetch(url)
    .then((res)=>res.json())

  .then((data)=>{
    removeActive();
    const clickBtn= document.getElementById(`lesson-btn-${id}`);
    clickBtn.classList.add("active")
    displayLevelWord(data.data);
  });
};
const displayLevelWord=(words)=>{
    const wordContainer =document.getElementById("word-container")
     wordContainer.innerHTML="";

     if(words.length==0){
       wordContainer.innerHTML=`
       
       <div class=" font-bng text-center space-y-6 col-span-full">
       <img class="mx-auto" src="./assets/alert-error.png">
    <h1 class="text-gray-700 text-xl">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</h1>
    <p class="text-5xl font-bold">নেক্সট Lesson এ যান</p>
  </div>`;
        return;
     } 

      words.forEach((word) =>{
        console.log(word);
       const card =document.createElement("div");
       card.innerHTML=`
       <div class="bg-white shadow-md space-y-2 text-center rounded-md py-10 px-5">
    <h1 class="text-lg font-bold">${word.word ? word.word:'not detected'}</h1>
    <p class="text-sm ">Meaning /Pronounciation</p>
    <p class="font-bold text-lg">"${word.meaning ? word.meaning:'not detected'} / ${word.pronunciation ? word.pronunciation:'not detected'}"</p>
         <div class="flex justify-between">
             <button onclick="pronounceWord('${word.word}')" class="bg-[#1A91FF10] hover:bg-[#1A91FF80] px-2"><i class="fa-solid fa-volume-high"></i></button>
             <button onclick="loadWordDetail(${word.id})" class="bg-[#1A91FF10] hover:bg-[#1A91FF80] px-2 py-1"><i class="fa-solid fa-circle-info"></i></button>
         </div>
  </div>     
       `;
       wordContainer.append(card)
      })
      manageSpinner(false);
};
  const loadWordDetail=async (id)=>{
    const url=`https://openapi.programming-hero.com/api/word/${id}`;
    const res= await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
  };

  const displayWordDetails=(word)=>{
       const detailsBox= document.getElementById("detail-conatainer")
       detailsBox.innerHTML =`
       
        <div>
           <h1 class="text-2xl font-bold">
            ${word.word} ( <i class="fa-solid fa-microphone"></i>    :${word.pronunciation})
           </h1> 

        </div>
        <div>
           <h1 class="font-bold">
            Meaning
           </h1>
           <p>${word.meaning}</p> 

        </div>
        <div>
           <h1 class="font-bold">
            Example
           </h1> 
           <p>${word.sentence}</p>

        </div>
        <div>
           <h1 class="font-bold">
        সমার্থক শব্দ গুলো
           </h1> 
          <div>
           ${createElements(word.synonyms)}
        </div> 
        </div>
     
        
       
       `;
        document.getElementById("word_modal").showModal();
       
     };

const displayLessson= (lessons) =>{
   const levelContainer = document.getElementById("level-container");
   levelContainer.innerHTML="";
   for(let lesson of lessons){

    const btnDiv= document.createElement('div');
    btnDiv.innerHTML=`
    <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn ">
    <i class="fa-solid fa-book-open"></i>
    Lesson -${lesson.level_no} </button>`;
    levelContainer.append(btnDiv);

   }
}
 loadLesson()


 document.getElementById('btn-search').addEventListener('click', () => {
  removeActive();

  const input = document.getElementById('input-search');
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;

      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayLevelWord(filterWords);
    });
});
