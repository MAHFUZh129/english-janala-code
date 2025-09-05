
const loadLesson=() =>{
    fetch('https://openapi.programming-hero.com/api/levels/all')
   .then(res=> res.json() )
    .then((json) =>displayLessson(json.data))

}
const displayLessson= (lessons) =>{
   const levelContainer = document.getElementById("level-container");
   levelContainer.innerHTML="";
   for(let lesson of lessons){

    const btnDiv= document.createElement('div');
    btnDiv.innerHTML=`
    <button class="btn btn-outline btn-primary ">
    <i class="fa-solid fa-book-open"></i>
    Lesson -${lesson.level_no} </button>`;
    levelContainer.append(btnDiv);

   }
}
 loadLesson()