const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;


let db;

const request = indexedDB.open('budget',1);

request.onupgradeneeded =({target}) => {
    let db =target.result;
    db.createObjectStore('storage', {autoIncrement:true});
};

request.onerror = function (event) {
    console.log('error!' + event.target.errorCode);
};

request.onsuccess =({target}) => {
    db = target.result;
    if(navigator.onLine){ checkData(); }
};

function searchData(){
    const transaction = db.transaction(['storage','readwrite']);
    const storage = transaction.objectStore('storage');
    const getAll = storage.getAll();

    getAll.onsuccess = function(){
        if(getAll.result.length>0){
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers:{
                    Accept:'application/json,text/plain, */*',
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => { return response.json() })
            .then(() => {
                const transaction = db.transaction(['storage','readwrite']);
                const storage = transaction.objectStore('storage');

                storage.clear();
              });
        }
    };
};

function saveRecord (record){
    const transaction = db.transaction(['storage','readwrite']);
    const storage = transaction.objectStore('storage');
    storage.add(record);
}
window.addEventListener('Online', searchData);

