const cafe_list = document.getElementById('cafe-list');
const form = document.getElementById('add-cafe-form');

let renderList = ((doc)=>{
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id',doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafe_list.appendChild(li)

    cross.addEventListener('click',((e) =>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    }))
})

// db.collection('cafes').orderBy('city').get().then((snapshot)=>{
//     snapshot.forEach(docs =>{
//         renderList(docs);
//     })
// })

form.addEventListener('submit',((e)=>{
    e.preventDefault();
    db.collection('cafes').add({
        name : form.name.value,
        city: form.city.value
    });
    form.reset();
}))

db.collection('cafes').orderBy('city').onSnapshot((snapshot) =>{
    let changes = snapshot.docChanges();
    changes.forEach((change) =>{
        if(change.type == 'added'){
            renderList(change.doc);
        }else if(change.type == 'removed'){
            let li = cafe_list.querySelector(`[data-id=${change.doc.id}]`);
            cafe_list.removeChild(li);
        }
    })
})